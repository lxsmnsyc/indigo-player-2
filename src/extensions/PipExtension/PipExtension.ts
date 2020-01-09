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
import { InstanceInterface, Events } from '../../types';
import STYLETRON from '../../utils/styletron';

const PIP_CONTAINER = STYLETRON.renderStyle({
  position: 'fixed',
  zIndex: 91337,
  bottom: '12px',
  right: '12px',
  width: '400px',
  height: '400px / 16 * 9',
  boxShadow: '0px 0px 28px rgba(0, 0, 0, .3)',
});

const PIP_HANDLER = STYLETRON.renderStyle({
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  height: '25px',
  zIndex: 1,
  cursor: 'grabbing',
});

const PIP_CLOSE = STYLETRON.renderStyle({
  position: 'absolute',
  width: '28px',
  height: '28px',
  right: 0,
  top: '0px',
  fontSize: '28px',
  cursor: 'pointer',
  color: '#fff',
  textShadow: '0px 0px rgba(0, 0, 0, .5)',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const PIP_PLACEHOLDER = STYLETRON.renderStyle({
  paddingBottom: '56.25%',
  backgroundColor: '#222222',
});

export default class PipExtension extends Module {
  public name = 'PipExtension';

  public pip = false;

  private playerContainer: HTMLElement;

  private playerContainerParent: HTMLElement | null;

  private pipPlaceholder?: HTMLElement;

  private pipContainer?: HTMLElement;

  private moveStartX = 0;

  private moveStartY = 0;

  private internalMoveDragging: (event: MouseEvent) => void;

  private internalStopDragging: (event: MouseEvent) => void;

  constructor(instance: InstanceInterface) {
    super(instance);

    this.playerContainer = this.instance.container;
    this.playerContainerParent = this.instance.container.parentElement;

    this.internalMoveDragging = this.moveDragging.bind(this);
    this.internalStopDragging = this.stopDragging.bind(this);
  }

  public enablePip(): void {
    const container = document.createElement('div');
    container.classList.add(PIP_CONTAINER);

    const handler = document.createElement('div');
    handler.classList.add(PIP_HANDLER);
    handler.addEventListener('mousedown', this.startDragging.bind(this));
    container.appendChild(handler);

    const close = document.createElement('div');
    close.innerHTML = '&times;';
    close.classList.add(PIP_CLOSE);
    close.addEventListener('click', () => this.disablePip());
    container.appendChild(close);

    const placeholder = document.createElement('div');
    placeholder.classList.add(PIP_PLACEHOLDER);
    if (this.playerContainerParent) {
      this.playerContainerParent.appendChild(placeholder);
    }

    this.pipPlaceholder = placeholder;
    this.pipContainer = container;

    container.appendChild(this.playerContainer);
    document.body.appendChild(container);

    this.pip = true;

    this.emit(Events.PIP_CHANGE, {
      pip: this.pip,
    });
  }

  public disablePip(): void {
    if (this.playerContainerParent) {
      this.playerContainerParent.appendChild(this.playerContainer);
    }
    if (this.pipPlaceholder && this.pipPlaceholder.parentElement) {
      this.pipPlaceholder.parentElement.removeChild(this.pipPlaceholder);
    }
    if (this.pipContainer && this.pipContainer.parentElement) {
      this.pipContainer.parentElement.removeChild(this.pipContainer);
    }

    this.pip = false;

    this.emit(Events.PIP_CHANGE, {
      pip: this.pip,
    });
  }

  public togglePip(): void {
    if (this.pip) {
      this.disablePip();
    } else {
      this.enablePip();
    }
  }

  private startDragging(event: MouseEvent): void {
    event.preventDefault();

    this.moveStartX = event.clientX;
    this.moveStartY = event.clientY;

    document.addEventListener('mousemove', this.internalMoveDragging);
    document.addEventListener('mouseup', this.internalStopDragging);
  }

  private moveDragging(event: MouseEvent): void {
    event.preventDefault();

    if (this.pipContainer) {
      const diffX = this.moveStartX - event.clientX;
      this.pipContainer.style.left = `${this.pipContainer.offsetLeft - diffX}px`;

      const diffY = this.moveStartY - event.clientY;
      this.pipContainer.style.top = `${this.pipContainer.offsetTop - diffY}px`;
    }

    this.moveStartX = event.clientX;
    this.moveStartY = event.clientY;
  }

  private stopDragging(): void {
    document.removeEventListener('mousemove', this.internalMoveDragging);
    document.removeEventListener('mouseup', this.internalStopDragging);
  }
}
