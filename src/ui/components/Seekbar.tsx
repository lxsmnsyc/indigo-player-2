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
import { cx } from 'emotion';
import { createSelector } from 'react-scoped-model';
import React from 'react';
import useSlider from '../utils/useSlider';
import SeekbarState from '../hooks/actions/SeekbarState';
import { seekbarRef } from '../refs';
import Data from '../hooks/Data';
import {
  GUI_SEEKBAR, GUI_SEEKBAR_STATE_ACTIVE, GUI_SEEKBAR_STATE_PLAYINGAD, GUI_SEEKBAR_BARS,
} from '../theme';
import SeekbarThumbnail from './seekbar/SeekbarThumbnail';
import SeekbarTooltip from './seekbar/SeekbarTooltip';
import SeekbarBuffered from './seekbar/SeekbarBuffered';
import SeekbarProgress from './seekbar/SeekbarProgress';
import SeekbarSeekAhead from './seekbar/SeekbarSeekAhead';
import SeekbarCuePoints from './seekbar/SeekbarCuePoints';
import SeekbarScrubber from './seekbar/SeekbarScrubber';
import tuple from '../utils/tuple';

const useSeekbarState = createSelector(SeekbarState, (state) => state.setSeekbarState);

const useData = createSelector(Data, (state) => tuple(
  state.isSeekbarHover || state.isSeekbarSeeking,
  state.adBreakData,
  state.liveOnly,
));

const Seekbar = React.memo(() => {
  const setSeekbarState = useSeekbarState();

  useSlider(seekbarRef, setSeekbarState);

  const [
    isActive,
    adBreakData,
    liveOnly,
  ] = useData();

  if (liveOnly) {
    return null;
  }

  return (
    <div
      className={cx(GUI_SEEKBAR, {
        [GUI_SEEKBAR_STATE_ACTIVE]: isActive,
        [GUI_SEEKBAR_STATE_PLAYINGAD]: !!adBreakData,
      })}
      ref={seekbarRef}
    >
      <SeekbarThumbnail />
      <SeekbarTooltip />
      <SeekbarScrubber />
      <div className={GUI_SEEKBAR_BARS}>
        <SeekbarBuffered />
        <SeekbarProgress />
        <SeekbarSeekAhead />
        <SeekbarCuePoints />
      </div>
    </div>
  );
});

export default Seekbar;
