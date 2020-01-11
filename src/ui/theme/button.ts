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
import { css } from 'emotion';
import RESET_BUTTON from '../components/mixins/reset-button';

export const GUI_BUTTON_STATE_DISABLED = css``;
export const GUI_BUTTON_STATE_ACTIVE = css``;

export const GUI_BUTTON = css`
  ${RESET_BUTTON};
  user-select: none;
  cursor: pointer;
  outline: none;

  &.${GUI_BUTTON_STATE_DISABLED} {
    pointer-events: none;
    opacity: 0.5 !important;
  }
`;

export const GUI_BUTTON_TOOLTIP = css``;
export const GUI_BUTTON_PLAY = css``;
export const GUI_BUTTON_FULLSCREEN = css``;
export const GUI_BUTTON_SETTINGS = css``;
export const GUI_BUTTON_SUBTITLE = css``;
export const GUI_BUTTON_SELECT_OPTION = css``;
export const GUI_BUTTON_SETTINGS_BACK = css``;
export const GUI_BUTTON_SETTINGS_OPTIONS = css``;

export const GUI_BUTTON_MOBILE_CLOSE = css`
  float: right;
  width: 31px;
  height: 31px;
  font-size: 18px;
  position: relative;
  z-index: 1;
`;
