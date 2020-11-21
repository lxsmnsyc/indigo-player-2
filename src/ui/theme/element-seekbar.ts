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
import { STRETCH } from './mixins';

const SEEKBAR_BARS_HEIGHT = '5px';
const SEEKBAR_SCRUBBER_RADIUS = '13px';
const SEEKBAR_SCRUBBER_HALF_RADIUS = '6.5px';

export const GUI_SEEKBAR = 'igui__seekbar';
export const GUI_SEEKBAR_BARS = 'igui__seekbar--bars';
export const GUI_SEEKBAR_SCRUBBER = 'igui__seekbar--scrubber';
export const GUI_SEEKBAR_TOOLTIP = 'igui__seekbar--tooltip';
export const GUI_SEEKBAR_THUMBNAIL_SPRITE = 'igui__seekbar--thumbnail-sprite';
export const GUI_SEEKBAR_THUMBNAIL = 'igui__seekbar--thumbnail';
export const GUI_SEEKBAR_STATE_ACTIVE = 'igui__seekbar--state-active';
export const GUI_SEEKBAR_PROGRESS = 'igui__seekbar--progress';
export const GUI_SEEKBAR_AHEAD = 'igui__seekbar--ahead';
export const GUI_SEEKBAR_BUFFERED = 'igui__seekbar--buffered';
export const GUI_SEEKBAR_STATE_PLAYINGAD = 'igui__seekbar--state-playingad';
export const GUI_SEEKBAR_CUEPOINTS = 'igui__seekbar--cuepoints';
export const GUI_SEEKBAR_CUEPOINT = 'igui__seekbar--cuepoint';

injectGlobal`
  .${GUI_SEEKBAR} {
    cursor: pointer;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    padding-bottom: 6px;
    padding-top: 16px;
  }

  .${GUI_SEEKBAR_BARS} {
    height: ${SEEKBAR_BARS_HEIGHT};
    background-color: rgba(255, 255, 255, .3);;
    position: relative;
    width: 100%;
    transform: scaleY(0.6);
    transition: transform 75ms linear;
  }

  .${GUI_SEEKBAR_SCRUBBER} {
    width: ${SEEKBAR_SCRUBBER_RADIUS};
    height: ${SEEKBAR_SCRUBBER_RADIUS};
    background-color: #ffffff;
    border-radius: 100%;
    position: absolute;
    transition: transform 75ms linear;
    transform-origin: center;
    transform: scale(0);
    margin-left: -${SEEKBAR_SCRUBBER_HALF_RADIUS};
    z-index: 1;
  }

  .${GUI_SEEKBAR_TOOLTIP} {
    position: absolute;
    bottom: 24px;
    transform: translateX(-50%);
    padding: 4px 6px;
    background-color: #222222;
    border-radius: 2px;
    opacity: 0;
    pointer-events: none;
  }

  .${GUI_SEEKBAR_THUMBNAIL} {
    position: absolute;
    bottom: 24px;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    border-radius: 2px;
    overflow: hidden;

    & .${GUI_SEEKBAR_THUMBNAIL_SPRITE} {
      width: 100px;
      height: calc(100px * (9 / 16));
    }
  }

  .${GUI_SEEKBAR_STATE_ACTIVE} {
    & .${GUI_SEEKBAR_BARS} {
      transform: scaleY(1);
    }
    & .${GUI_SEEKBAR_SCRUBBER} {
      transform: scale(1);
    }
    & .${GUI_SEEKBAR_TOOLTIP} {
      opacity: 1;
    }
    & .${GUI_SEEKBAR_THUMBNAIL} {
      opacity: 1;
    }
  }

  .${GUI_SEEKBAR_PROGRESS} {
    ${STRETCH}
    transform-origin: left;
    background-color: #ffffff;
  }

  .${GUI_SEEKBAR_AHEAD} {
    ${STRETCH}
    transform-origin: left;
    background-color: rgba(255, 255, 255, .3);
    z-index: -1;
  }

  .${GUI_SEEKBAR_BUFFERED} {
    ${STRETCH}
    transform-origin: left;
    background-color: rgba(255, 255, 255, .3);
  }

  .${GUI_SEEKBAR_STATE_PLAYINGAD} {
    pointer-events: none;

    & .${GUI_SEEKBAR_PROGRESS} {
      background-color: #ffe600;
    }
  }

  .${GUI_SEEKBAR_CUEPOINT} {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 5px;
    background-color: #ffe600;
  }
`;
