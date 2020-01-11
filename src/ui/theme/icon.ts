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

export const GUI_ICON = css``;
export const GUI_ICON_PLAY = css``;
export const GUI_ICON_VOLUME_1 = css``;
export const GUI_ICON_BACK = css``;
export const GUI_ICON_SETTINGS = css``;
export const GUI_ICON_PIP = css``;
export const GUI_ICON_HD = css``;
export const GUI_ICON_CC = css``;
export const GUI_ICON_FULLSCREEN = css``;
export const GUI_ICON_FULLSCREEN_EXIT = css``;
export const GUI_ICON_PAUSE = css``;
export const GUI_ICON_VOLUME = css``;
export const GUI_ICON_VOLUME_OFF = css``;
export const GUI_ICON_PLAY_ROUNDED = css``;

export const ICON_TAG = {
  PLAY: 'play_arrow',
  PLAY_ROUNDED: 'play_circle_filled',
  VOLUME: 'volume_up',
  VOLUME_1: 'volume_down',
  VOLUME_OFF: 'volume_off',
  FULLSCREEN: 'fullscreen',
  FULLSCREEN_EXIT: 'fullscreen_exit',
  CC: 'closed_caption',
  HD: 'hd',
  PAUSE: 'pause',
  PIP: 'featured_video',
  SETTINGS: '',
  BACK: '',
};

export const ICON_TO_CLASS = {
  [ICON_TAG.PLAY]: GUI_ICON_PLAY,
  [ICON_TAG.PLAY_ROUNDED]: GUI_ICON_PLAY_ROUNDED,
  [ICON_TAG.VOLUME]: GUI_ICON_VOLUME,
  [ICON_TAG.VOLUME_1]: GUI_ICON_VOLUME_1,
  [ICON_TAG.VOLUME_OFF]: GUI_ICON_VOLUME_OFF,
  [ICON_TAG.FULLSCREEN]: GUI_ICON_FULLSCREEN,
  [ICON_TAG.FULLSCREEN_EXIT]: GUI_ICON_FULLSCREEN_EXIT,
  [ICON_TAG.CC]: GUI_ICON_CC,
  [ICON_TAG.HD]: GUI_ICON_HD,
  [ICON_TAG.PAUSE]: GUI_ICON_PAUSE,
  [ICON_TAG.PIP]: GUI_ICON_PIP,
  [ICON_TAG.SETTINGS]: GUI_ICON_SETTINGS,
  [ICON_TAG.BACK]: GUI_ICON_BACK,
};
