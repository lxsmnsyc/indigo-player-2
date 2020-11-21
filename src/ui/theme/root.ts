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
import { injectGlobal } from '@emotion/css';
import { GUI_CONTAINER_CONTROLS, GUI_CONTAINER_CONTROLS_SEEKBAR } from './view-controls';
import { GUI_BUTTON, GUI_BUTTON_TOOLTIP } from './button';
import { GUI_ICON } from './icon';
import { GUI_SETTINGS } from './element-settings';
import { STRETCH } from './mixins';

export const GUI_STATE_FULLSCREEN = 'igui__state--fullscreen';
export const GUI_STATE_MOBILE = 'igui__state--mobile';
export const GUI_STATE_ACTIVE = 'igui__state--active';
export const GUI_STATE_PIP = 'igui__state--pip';
export const GUI_CONTAINER = 'igui__container';
export const GUI_PLAYER = 'igui__player';
export const GUI = 'igui';
export const GUI_MAIN = 'igui__main';
export const GUI_ADS = 'igui__ads';

injectGlobal`
  .${GUI_STATE_FULLSCREEN} {
    font-size: 16px;

    & .${GUI_CONTAINER_CONTROLS} {
      & .${GUI_BUTTON} {
        width: 44px;
        height: 48px;

        & .${GUI_ICON} {
          font-size: 32px;
        }

        & .${GUI_BUTTON_TOOLTIP} {
          bottom: 66px;
        }
      }
    }

    & .${GUI_CONTAINER_CONTROLS_SEEKBAR} {
      bottom: 42px;
    }

    & .${GUI_SETTINGS} {
      bottom: 66px;
    }
  }

  .${GUI_STATE_MOBILE} {
    & .${GUI_SETTINGS} {
      ${STRETCH}
    }
  }

  .${GUI_STATE_ACTIVE} {
    & .${GUI_CONTAINER_CONTROLS} {
      opacity: 1;
    }
  }

  .${GUI_CONTAINER} {
    position: relative;
    background-color: #000;
    overflow: hidden;
    color: #fff;
    -webkit-tap-highlight-color: transparent;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 13px;

    & * {
      box-sizing: border-box;
    }
  }

  .${GUI_PLAYER} {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
`;
