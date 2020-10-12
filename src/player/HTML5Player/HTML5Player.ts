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
import Player from '../Player';
import { Events } from '../../types';

export default class HTML5Player extends Player {
  public name = 'HTML5Player';

  public mediaElement?: HTMLVideoElement;

  public load(): void {
    const mediaElement = document.createElement('video');
    mediaElement.style.width = '100%';
    mediaElement.style.height = '100%';
    mediaElement.preload = 'metadata';
    mediaElement.crossOrigin = 'anonymous';
    mediaElement.volume = 1;
    mediaElement.setAttribute('playsinline', '');
    mediaElement.setAttribute('preload', 'auto');
    this.instance.playerContainer.appendChild(mediaElement);

    mediaElement.addEventListener('playing', () => {
      this.emit(Events.PLAYER_STATE_PLAYING, null);
    });

    mediaElement.addEventListener('ended', () => {
      this.emit(Events.PLAYER_STATE_ENDED, null);
    });

    mediaElement.addEventListener('seeked', () => {
      this.emit(Events.PLAYER_STATE_SEEKED, null);
    });

    mediaElement.addEventListener('durationchange', () => {
      this.emit(Events.PLAYER_STATE_DURATIONCHANGE, {
        duration: mediaElement.duration,
      });
    });

    mediaElement.addEventListener('waiting', () => {
      this.emit(Events.PLAYER_STATE_WAITING, null);
    });

    mediaElement.addEventListener('volumechange', () => {
      let { volume } = mediaElement;
      if (mediaElement.muted) {
        volume = 0;
      }
      this.emit(Events.PLAYER_STATE_VOLUMECHANGE, {
        volume,
      });
    });

    const monitorProgress = (): void => {
      const { buffered } = mediaElement;
      const time: number = mediaElement.currentTime;

      for (let range = 0; range < buffered.length; range += 1) {
        if (buffered.start(range) <= time && buffered.end(range) > time) {
          this.emit(Events.PLAYER_STATE_BUFFEREDCHANGE, {
            percentage: buffered.end(range) / mediaElement.duration,
          });
          break;
        }
      }
    };

    mediaElement.addEventListener('loadeddata', monitorProgress);
    mediaElement.addEventListener('progress', monitorProgress);

    mediaElement.addEventListener('ratechange', () => {
      this.emit(Events.PLAYER_STATE_RATECHANGE, {
        playbackRate: mediaElement?.playbackRate,
      });
    });

    mediaElement.addEventListener('timeupdate', () => {
      this.emit(Events.PLAYER_STATE_TIMEUPDATE, {
        currentTime: mediaElement?.currentTime,
      });
    });

    this.mediaElement = mediaElement;
  }

  public unload(): void {
    if (this.mediaElement) {
      this.mediaElement.pause();
      this.mediaElement.removeAttribute('src');
      this.mediaElement.load();
      this.mediaElement.remove();
    }
  }

  public setSource(src: string): void {
    if (this.mediaElement) {
      this.mediaElement.src = src;
    }
  }

  public play(): void {
    this.emit(Events.PLAYER_STATE_PLAY, null);
    if (this.mediaElement) {
      this.mediaElement.play().catch(() => {
        //
      });
    }
  }

  public pause(): void {
    this.emit(Events.PLAYER_STATE_PAUSE, null);
    if (this.mediaElement) {
      this.mediaElement.pause();
    }
  }

  public seekTo(time: number): void {
    this.emit(Events.PLAYER_STATE_TIMEUPDATE, {
      currentTime: time,
    });

    if (this.mediaElement) {
      this.mediaElement.currentTime = time;
    }
  }

  public setVolume(volume: number): void {
    if (this.mediaElement) {
      this.mediaElement.volume = volume;
      this.mediaElement.muted = volume === 0;
    }
  }

  public setPlaybackRate(playbackRate: number): void {
    if (this.mediaElement) {
      this.mediaElement.playbackRate = playbackRate;
    }
  }
}
