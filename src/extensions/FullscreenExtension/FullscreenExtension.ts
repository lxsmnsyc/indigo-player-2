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
import screenfull, { Screenfull } from 'screenfull';
import { InstanceInterface, Events } from '../../types';
import Module from '../../module';

interface DocumentPos {
  x: number;
  y: number;
}

const sc = screenfull as Screenfull;

export default class FullscreenExtension extends Module {
  public name = 'FullscreenExtension';

  private documentPos?: DocumentPos

  constructor(instance: InstanceInterface) {
    super(instance);

    if (sc.isEnabled) {
      this.emit(Events.FULLSCREEN_SUPPORTED, null);

      sc.on('change', () => {
        const fullscreen = sc.isFullscreen;

        this.handleDocumentPos(fullscreen);

        this.emit(Events.FULLSCREEN_CHANGE, {
          fullscreen,
        });
      });
    }
  }

  public toggleFullscreen(): void {
    if (sc.isEnabled) {
      sc.toggle(this.instance.container);
    }
  }

  // Code below evades the following Chromium bug:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=142427.
  private handleDocumentPos(isFullscreen: boolean): void {
    if (isFullscreen) {
      const x = window.pageXOffset;
      const y = window.pageYOffset;
      if (x || y) {
        this.documentPos = {
          x: x || 0,
          y: y || 0,
        };
      }
    } else {
      if (!this.documentPos) {
        return;
      }

      window.scrollTo(this.documentPos.x, this.documentPos.y);
      this.documentPos = undefined;
    }
  }
}
