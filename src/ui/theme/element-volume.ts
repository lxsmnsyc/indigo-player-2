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
import { injectGlobal } from 'emotion';
import { GUI_BUTTON } from './button';
import { GUI_ICON_VOLUME_1 } from './icon';

const VOLUMEBAR_HEIGHT = '3px';
const VOLUMEBAR_SCRUBBER_RADIUS = '14px';

export const GUI_VOLUME = 'igui__volume';
export const GUI_VOLUME_CONTAINER = 'igui__volume--container';
export const GUI_VOLUME_COLLAPSE = 'igui__volume--collapse';
export const GUI_VOLUME_STATE_OPEN = 'igui__volume--state-open';
export const GUI_VOLUMEBAR = 'igui__volumebar';
export const GUI_VOLUMEBAR_CONTAINER = 'igui__volumebar--container';
export const GUI_VOLUMEBAR_PROGRESS = 'igui__volumebar--progress';
export const GUI_VOLUMEBAR_SCRUBBER = 'igui__volumebar--scrubber';

injectGlobal`
  .${GUI_VOLUME} {
    display: flex;
    align-items: center;

    & .${GUI_BUTTON} {
      position: relative;

      & .${GUI_ICON_VOLUME_1} {
        position: relative;
        left: -2px;
      }
    }
  }

  .${GUI_VOLUME_CONTAINER} {
    padding: 0 7px;
  }

  .${GUI_VOLUME_COLLAPSE} {
    overflow: hidden;
    width: 0;
    transition: width 150ms ease-in-out;
  }

  .${GUI_VOLUME_STATE_OPEN} {
    & .${GUI_VOLUME_COLLAPSE} {
      width: 76px;
    }
  }

  .${GUI_VOLUMEBAR} {
    cursor: pointer;
    width: 100%;
    height: 16px;
    display: flex;
    align-items: center;
  }

  .${GUI_VOLUMEBAR_CONTAINER} {
    height: ${VOLUMEBAR_HEIGHT};
    background-color: rgba(255, 255, 255, .5);
    position: relative;
    width: 50px;
  }

  .${GUI_VOLUMEBAR_PROGRESS} {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transform-origin: left;
    background-color: #ffffff;
    height: 100%;
  }

  .${GUI_VOLUMEBAR_SCRUBBER} {
    width: ${VOLUMEBAR_SCRUBBER_RADIUS};
    height: ${VOLUMEBAR_SCRUBBER_RADIUS};
    background-color: #ffffff;
    border-radius: 100%;
    position: relative;
    top: calc((${VOLUMEBAR_HEIGHT} / 2) - (${VOLUMEBAR_SCRUBBER_RADIUS} / 2));
    margin-left: calc(-(${VOLUMEBAR_SCRUBBER_RADIUS} / 2));
  }
`;
