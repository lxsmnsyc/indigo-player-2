/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
// eslint-disable-next-line spaced-comment
/// reference path="shaka.d.ts"
import * as shaka from 'shaka-player';
import Media from '../Media';
import {
  TrackInterface, InstanceInterface, Events, ErrorCodes,
} from '../../types';
import { STORAGE } from '../../utils/local-storage';
import PlayerError from '../../utils/player-error';

function formatTrack(track: any): TrackInterface {
  return {
    id: track.id,
    width: track.width,
    height: track.height,
    bandwidth: track.bandwidth,
  };
}

export default class DashMedia extends Media {
  public name = 'DashMedia';

  public player?: shaka.Player;

  private track?: TrackInterface;

  constructor(instance: InstanceInterface) {
    super(instance);

    shaka.polyfill.installAll();
  }

  public async load(): Promise<void> {
    const { mediaElement } = (this.instance.getModule('HTML5Player') as unknown as { mediaElement: HTMLMediaElement});

    const player = new shaka.Player(mediaElement);

    player.addEventListener('error', (event: any) => {
      if (event.detail.severity === 2) {
        this.instance.setError(
          new PlayerError(ErrorCodes.SHAKA_CRITICAL_ERROR, event.detail),
        );
      }
    });

    const onAdaptationEvent = (): void => {
      const track = formatTrack(
        player.getVariantTracks().find((tr: any) => tr.active),
      );

      this.track = track;
      this.emitTrackChange();

      const { estimatedBandwidth } = player.getStats();
      STORAGE.set('estimatedBandwidth', estimatedBandwidth);
    };

    player.addEventListener('adaptation', onAdaptationEvent);

    this.emit(Events.SHAKA_INSTANCE, {
      shaka,
      player,
    });

    const configuration: any = {
      abr: {
        enabled: true,
        defaultBandwidthEstimate:
          Number(STORAGE.get('estimatedBandwidth', 0))
          || 1024 * 1000,
      },
    };

    if (this.instance.format && this.instance.format.drm) {
      configuration.drm = {
        servers: {
          'com.widevine.alpha': this.instance.format.drm.widevine?.licenseUrl,
          'com.microsoft.playready': this.instance.format.drm?.playready?.licenseUrl,
        },
        advanced: {
          'com.widevine.alpha': {
            audioRobustness: 'SW_SECURE_CRYPTO',
            videoRobustness: 'SW_SECURE_DECODE',
          },
        },
      };
    }

    player.configure(configuration);

    try {
      await (player.load(this.instance.format?.src) as Promise<any>);

      const tracks = player
        .getVariantTracks()
        .filter((track: any) => track.type === 'variant')
        .sort((a: any, b: any) => b.bandwidth - a.bandwidth)
        .map(formatTrack);

      this.emit(Events.MEDIA_STATE_TRACKS, {
        tracks,
      });

      const audioLanguages = player.getAudioLanguages();

      this.emit(Events.MEDIA_STATE_AUDIOLANGUAGES, {
        audioLanguages,
      });
    } catch (error) {
      if (error.severity === 2) {
        this.instance.setError(
          new PlayerError(ErrorCodes.SHAKA_CRITICAL_ERROR, error),
        );
      }
    }
  }

  public unload(): void {
    if (this.player) {
      this.player.destroy();
    }
  }

  public selectTrack(track: TrackInterface | string): void {
    if (track === 'auto') {
      if (this.player) {
        this.player.configure({ abr: { enabled: true } });
        this.emitTrackChange();
      }
    } else if (this.player) {
      this.player.configure({ abr: { enabled: false } });

      this.track = track as TrackInterface;
      this.emitTrackChange();

      const variantTrack = this.player
        .getVariantTracks()
        .find((vt: any) => vt.id === (track as TrackInterface).id);

      if (variantTrack) {
        this.player.selectVariantTrack(variantTrack, true);
      }
    }
  }

  public selectAudioLanguage(language: string): void {
    if (this.player) {
      this.player.selectAudioLanguage(language);
    }
  }

  private emitTrackChange(): void {
    this.emit(Events.MEDIA_STATE_TRACKCHANGE, {
      track: this.track,
      auto: this.player?.getConfiguration().abr.enabled,
    });
  }
}
