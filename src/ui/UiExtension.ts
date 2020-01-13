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
import { MutableRefObject } from 'react';
import Module from '../module';
import { InstanceInterface, Events } from '../types';
import { GUI } from './theme';
import render from './render';
import { StateInterface } from '../extensions/StateExtension/StateExtension';

export default class UiExtension extends Module {
  public name = 'UiExtension';

  private ref: MutableRefObject<(() => void) | null> = {
    current: null,
  };

  constructor(instance: InstanceInterface) {
    super(instance);

    const container = this.instance.container.querySelector(`.${GUI}`);

    this.instance.on(Events.STATE_CHANGE, ({ state }: any): void => {
      if (container) {
        render(
          container as HTMLElement,
          state as unknown as StateInterface,
          this.instance,
          this.ref,
        );
      }
    });
  }

  // Provide a way for overlays to trigger a mouse move on it's own elements.
  public triggerMouseMove(): void {
    if (this.ref.current) {
      this.ref.current();
    }
  }
}
