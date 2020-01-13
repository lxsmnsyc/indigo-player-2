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
import { keyframes, injectGlobal } from 'emotion';
import {
  GUI_BUTTON,
  GUI_BUTTON_STATE_ACTIVE,
  GUI_BUTTON_TOOLTIP,
  GUI_BUTTON_PLAY,
  GUI_BUTTON_FULLSCREEN,
  GUI_BUTTON_SETTINGS,
  GUI_BUTTON_SUBTITLE,
} from './button';
// import { GUI_STATE_FULLSCREEN, GUI_STATE_ACTIVE } from './root';
import { GUI_ICON } from './icon';

export const fullscreenHover = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

export const GUI_TIMESTAT = 'igui__timestat';
export const GUI_TIMESTAT_DURATION = 'igui__timestat--duration';
export const GUI_TIMESTAT_POSITION = 'igui__timestat--position';
export const GUI_CONTAINER_CONTROLS = 'igui__container--controls';
export const GUI_CONTAINER_CONTROLS_SEEKBAR = 'igui__container--controls-seekbar';

injectGlobal`
  .${GUI_CONTAINER_CONTROLS} {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    display: flex;

    opacity: 0;
    transition: opacity 100ms linear;

    &:before {
      content: '';
      position: absolute;
      background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
      left: 0;
      right: 0;
      bottom: 0;
      height: 80px;
      z-index: -1;
      pointer-events: none;
    }

    & .${GUI_BUTTON} {
      width: 36px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      opacity: 0.9;

      &:hover {
        opacity: 1;
      }

      .${GUI_ICON} {
        font-size: 26px;
      }

      .${GUI_BUTTON_TOOLTIP} {
        position: absolute;
        bottom: 58px;
        left: 50%;
        pointer-events: none;
        transform: translateX(-50%);
        background-color: #222222;
        border-radius: 2px;
        padding: 4px 6px;
        white-space: nowrap;
      }
    }

    & .${GUI_BUTTON_PLAY} {
      margin-left: 9px;

      .${GUI_BUTTON_TOOLTIP} {
        left: 2px;
        transform: translateX(0);
      }
    }

    & .${GUI_TIMESTAT} {
      user-select: none;
      display: flex;
      align-items: center;
      margin-right: auto;

      .${GUI_TIMESTAT_DURATION} {
        position: relative;
        margin-left: 8px;

        &:before {
          position: absolute;
          content: '/';
          left: -6px;
        }
      }
    }

    & .${GUI_BUTTON_FULLSCREEN} {
      margin-right: 9px;

      &:hover {
        .${GUI_ICON} {
          animation-name: ${fullscreenHover};
          animation-duration: 350ms;
        }
      }

      .${GUI_BUTTON_TOOLTIP} {
        right: 2px;
        left: auto;
        transform: translateX(0);
      }
    }

    & .${GUI_BUTTON_SETTINGS}.${GUI_BUTTON_STATE_ACTIVE} {

      .${GUI_ICON} {
        transform: rotate(35deg);
      }
    }

    & .${GUI_BUTTON_SUBTITLE} {
      &:before {
        content: '';
        position: absolute;
        height: 2px;
        height: 2px;
        background-color: #ffffff;
        bottom: 7px;
        left: 50%;
        transform: translateX(-50%);
        width: 0px;
        transition: width 120ms linear;
      }

      &.${GUI_BUTTON_STATE_ACTIVE} {
        position: relative;

        &:before {
          width: 21px;
        }
      }
    }
  }

  .${GUI_CONTAINER_CONTROLS_SEEKBAR} {
    padding: 0 12px;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 34px;
  }
`;
