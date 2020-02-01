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
import HlsJs from 'hls.js';
import Media from '../Media';
import { TrackInterface, Events, ErrorCodes } from '../../types';
import PlayerError from '../../utils/player-error';
import HTML5Player from '../../player/HTML5Player/HTML5Player';

function formatTrack(track: Hls.Level, id: number): TrackInterface {
  return {
    id,
    width: track.width,
    height: track.height,
    bandwidth: track.bitrate,
  };
}

export default class HlsMedia extends Media {
  public name = 'HlsMedia';

  public player?: HlsJs;

  public load(): void {
    const player = new HlsJs({
      autoStartLoad: false,
    });

    const mod = this.instance.getModule('HTML5Player');

    if (mod) {
      const { mediaElement } = (mod as HTML5Player);

      if (mediaElement) {
        player.attachMedia(mediaElement);
      }
    }


    player.on(HlsJs.Events.MANIFEST_PARSED, (_, data) => {
      const tracks = (data.levels as unknown as HlsJs.Level[])
        .map(formatTrack)
        .sort((a, b) => b.bandwidth - a.bandwidth);

      this.emit(Events.MEDIA_STATE_TRACKS, {
        tracks,
      });
    });

    player.on(HlsJs.Events.LEVEL_SWITCHED, (_, data) => {
      const { levels } = player;
      const { level } = data;

      this.emit(Events.MEDIA_STATE_TRACKCHANGE, {
        track: formatTrack(levels[level], level),
        auto: player.autoLevelEnabled,
      });
    });

    player.on(HlsJs.Events.ERROR, (_, data) => {
      if (!data.fatal) {
        return;
      }

      if (data.type === HlsJs.ErrorTypes.NETWORK_ERROR) {
        player.startLoad();
      } else if (data.type === HlsJs.ErrorTypes.MEDIA_ERROR) {
        player.recoverMediaError();
      } else {
        this.instance.setError(
          new PlayerError(ErrorCodes.HLSJS_CRITICAL_ERROR, data),
        );
      }
    });

    if (this.instance && this.instance.format) {
      player.loadSource(this.instance.format.src);
    }

    player.startLoad();

    this.player = player;
  }

  public seekTo(time: number): void {
    if (time === Infinity) {
      if (this.instance && this.instance.player && this.player) {
        this.instance.player.seekTo(this.player.liveSyncPosition);
      }
      return;
    }
    super.seekTo(time);
  }

  public unload(): void {
    if (this.player) {
      this.player.destroy();
    }
  }

  public selectTrack(track: TrackInterface | string): void {
    if (this.player) {
      if (track === 'auto') {
        this.player.currentLevel = -1;
      } else {
        this.player.currentLevel = (track as TrackInterface).id;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public selectAudioLanguage(): void {
    // no feature
  }
}
