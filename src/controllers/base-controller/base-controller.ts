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
import { ErrorCodes, TrackInterface } from '../../types';
import { selectPlayer, selectMedia } from '../../utils/select-module';
import PlayerError from '../../utils/player-error';
import Controller from '..';

export default class BaseController extends Controller {
  public async load(): Promise<void> {
    this.instance.player = await selectPlayer(this.instance);

    const [format, media] = await selectMedia(this.instance);
    if (!media) {
      throw new PlayerError(ErrorCodes.NO_SUPPORTED_FORMAT_FOUND);
    }

    this.instance.format = format;
    this.instance.media = media;

    await this.instance.player?.load();
    await this.instance.media.load();
  }

  public unload(): void {
    if (this.instance.media) {
      this.instance.media.unload();
    }
    if (this.instance.player) {
      this.instance.player.unload();
    }
  }

  public play(): void {
    if (this.instance && this.instance.media) {
      this.instance.media.play();
    }
  }

  public pause(): void {
    if (this.instance && this.instance.media) {
      this.instance.media.pause();
    }
  }

  public seekTo(time: number): void {
    if (this.instance && this.instance.media) {
      this.instance.media.seekTo(time);
    }
  }

  public setVolume(volume: number): void {
    if (this.instance && this.instance.media) {
      this.instance.media.setVolume(volume);
    }
  }

  public selectTrack(track: TrackInterface): void {
    if (this.instance && this.instance.media) {
      this.instance.media.selectTrack(track);
    }
  }

  public selectAudioLanguage(language: string): void {
    if (this.instance && this.instance.media) {
      this.instance.media.selectAudioLanguage(language);
    }
  }

  public setPlaybackRate(playbackRate: number): void {
    if (this.instance && this.instance.media) {
      this.instance.media.setPlaybackRate(playbackRate);
    }
  }
}
