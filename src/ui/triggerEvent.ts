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
import { InstanceInterface, Events } from '../types';
import { Data } from './types';

export default function triggerEvent(
  instance: InstanceInterface,
  data: Data,
  prevData?: Data,
): void {
  if (!prevData) {
    return;
  }

  const eventQueue: { eventName: string; data: any }[] = [];
  const queueEvent = (eventName: string, newData?: any): void => {
    eventQueue.push({ eventName, data: newData });
  };

  // UI state management

  // Trigger the controls visibility.
  if (data.visibleControls && !prevData.visibleControls) {
    queueEvent(Events.UI_VISIBLECONTROLS_CHANGE, {
      visibleControls: true,
    });
  } else if (!data.visibleControls && prevData.visibleControls) {
    queueEvent(Events.UI_VISIBLECONTROLS_CHANGE, {
      visibleControls: false,
    });
  }

  if (data.view !== prevData.view) {
    queueEvent(Events.UI_VIEW_CHANGE, {
      view: data.view,
    });
  }

  // Release the queue
  if (eventQueue.length) {
    eventQueue.forEach(({ eventName, data: d }) => {
      instance.emit(eventName, d);
    });

    instance.emit(Events.UI_STATE_CHANGE, {
      state: data,
      prevState: prevData,
    });
  }

  // Extension triggers

  // Trigger subtitles to move up.
  const subtitlesExtension = instance.getModule('SubtitlesExtension');
  if (subtitlesExtension) {
    if (data.visibleControls && !prevData.visibleControls) {
      (subtitlesExtension as any).setOffset(42);
    } else if (!data.visibleControls && prevData.visibleControls) {
      (subtitlesExtension as any).setOffset(0);
    }
  }
}
