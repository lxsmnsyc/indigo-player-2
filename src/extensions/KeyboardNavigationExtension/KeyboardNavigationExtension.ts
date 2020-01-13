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
import Module from '../../module';
import { InstanceInterface, KeyboardNavigationPurpose, Events } from '../../types';
import FullscreenExtension from '../FullscreenExtension/FullscreenExtension';
import StateExtension, { StateInterface } from '../StateExtension/StateExtension';


enum KeyCodes {
  SPACEBAR = 32,
  K = 75,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  M = 77,
  F = 70,
  C = 67,
  I = 73,
}

const SKIP_CURRENTTIME_OFFSET = 5;

const SKIP_VOLUME_OFFSET = 0.1;

export default class KeyboardNavigationExtension extends Module {
  public name = 'KeyboardNavigationExtension';

  private hasFocus = false;

  constructor(instance: InstanceInterface) {
    super(instance);

    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  public triggerFocus(): void {
    this.hasFocus = true;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.instance.config.keyboardNavigation === 'focus' && !this.hasFocus) {
      return;
    }

    switch (event.which || event.keyCode) {
      // Toggles play and pause.
      case KeyCodes.SPACEBAR:
      case KeyCodes.K:
        this.onPause(event);
        break;

      // Seeks back x seconds.
      case KeyCodes.LEFT_ARROW:
        this.onJumpBack(event);
        break;

      // Seeks forward x seconds.
      case KeyCodes.RIGHT_ARROW:
        this.onJumpForward(event);
        break;

      // Increases the volume.
      case KeyCodes.UP_ARROW:
        this.onVolumeUp(event);
        break;

      // Decreases the volume.
      case KeyCodes.DOWN_ARROW:
        this.onVolumeDown(event);
        break;

      // Toggles mute.
      case KeyCodes.M:
        this.onMute(event);
        break;

      // Toggles fullscreen.
      case KeyCodes.F:
        this.onFullscreen(event);
        break;

      case KeyCodes.C:
        this.emitPurpose(KeyboardNavigationPurpose.REQUEST_TOGGLE_SUBTITLES);
        event.preventDefault();
        break;

      case KeyCodes.I:
        this.emitPurpose(KeyboardNavigationPurpose.REQUEST_TOGGLE_MINIPLAYER);
        event.preventDefault();
        break;

      default:
    }
  }

  private onMouseDown(event: MouseEvent): void {
    this.hasFocus = this.instance.container.contains(event.target as Node);
  }

  private getState(): StateInterface | null {
    const mod = this.instance.getModule('StateExtension');

    if (mod) {
      return (mod as StateExtension).getState();
    }
    return null;
  }

  private emitPurpose(purpose: KeyboardNavigationPurpose): void {
    this.instance.emit(Events.KEYBOARDNAVIGATION_KEYDOWN, {
      purpose,
    });
  }

  private onMute(event: KeyboardEvent): void {
    const state = this.getState();

    if (state && state.volume > 0) {
      this.instance.setVolume(0);
      this.emitPurpose(KeyboardNavigationPurpose.VOLUME_MUTED);
    } else {
      this.instance.setVolume(1);
      this.emitPurpose(KeyboardNavigationPurpose.VOLUME_UNMUTED);
    }
    event.preventDefault();
  }

  private onPause(event: KeyboardEvent): void {
    const state = this.getState();
    if (state && state.playRequested) {
      this.instance.pause();
      this.emitPurpose(KeyboardNavigationPurpose.PAUSE);
    } else {
      this.instance.play();
      this.emitPurpose(KeyboardNavigationPurpose.PLAY);
    }
    event.preventDefault();
  }

  private onJumpBack(event: KeyboardEvent): void {
    const state = this.getState();

    if (state) {
      const { currentTime } = state;

      if (currentTime) {
        let prevTime = currentTime - SKIP_CURRENTTIME_OFFSET;
        if (prevTime < 0) {
          prevTime = 0;
        }
        this.instance.seekTo(prevTime);
        this.emitPurpose(KeyboardNavigationPurpose.PREV_SEEK);
      }
    }
    event.preventDefault();
  }

  private onJumpForward(event: KeyboardEvent): void {
    const state = this.getState();

    if (state) {
      const { currentTime, duration } = state;

      if (currentTime && duration) {
        let nextTime = currentTime + SKIP_CURRENTTIME_OFFSET;
        if (nextTime > duration) {
          nextTime = duration;
        }
        this.instance.seekTo(nextTime);
        this.emitPurpose(KeyboardNavigationPurpose.NEXT_SEEK);
      }
    }
    event.preventDefault();
  }

  private onVolumeUp(event: KeyboardEvent): void {
    const state = this.getState();

    if (state) {
      let nextVolume = state.volume + SKIP_VOLUME_OFFSET;
      if (nextVolume > 1) {
        nextVolume = 1;
      }
      this.instance.setVolume(nextVolume);
      this.emitPurpose(KeyboardNavigationPurpose.VOLUME_UP);
    }
    event.preventDefault();
  }

  private onVolumeDown(event: KeyboardEvent): void {
    const state = this.getState();

    if (state) {
      let prevVolume = state.volume - SKIP_VOLUME_OFFSET;
      if (prevVolume < 0) {
        prevVolume = 0;
      }
      this.instance.setVolume(prevVolume);
      this.emitPurpose(KeyboardNavigationPurpose.VOLUME_DOWN);
    }
    event.preventDefault();
  }

  private onFullscreen(event: KeyboardEvent): void {
    const fullscreenExtension = this.instance.getModule(
      'FullscreenExtension',
    );
    if (fullscreenExtension) {
      (fullscreenExtension as FullscreenExtension).toggleFullscreen();
      this.emitPurpose(KeyboardNavigationPurpose.TOGGLE_FULLSCREEN);
      event.preventDefault();
    }
  }
}
