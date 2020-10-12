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
import React from 'react';
import { createSelector, createSelectors } from 'react-scoped-model';
import { cx } from 'emotion';
import Data from '../hooks/Data';
import {
  GUI_VOLUME, GUI_VOLUME_STATE_OPEN, GUI_VOLUME_COLLAPSE, GUI_VOLUME_CONTAINER, ICON_TAG,
} from '../theme';
import VolumeControlsOpen from '../hooks/actions/VolumeControlsOpen';
import ToggleMute from '../hooks/actions/ToggleMute';
import Button from './Button';
import VolumeBar from './VolumeBar';
import tuple from '../utils/tuple';

const useData = createSelectors(Data, (state) => {
  let vicon = ICON_TAG.VOLUME_OFF;
  if (state.volumeBarPercentage > 0.5) {
    vicon = ICON_TAG.VOLUME;
  } else if (state.volumeBarPercentage > 0) {
    vicon = ICON_TAG.VOLUME_1;
  }

  const tpt = `${state.getTranslation(
    state.volumeBarPercentage === 0 ? 'Unmute' : 'Mute',
  )} (m)`;

  return tuple(
    state.isVolumeControlsOpen,
    vicon,
    tpt,
  );
});

const useVolumeControlsOpen = createSelector(
  VolumeControlsOpen,
  (state) => state.setVolumeControlsOpen,
);

const useToggleMute = createSelector(
  ToggleMute,
  (state) => state.toggleMute,
);

const VolumeButton = React.memo(() => {
  const [
    isVolumeControlsOpen,
    volumeIcon,
    tooltipText,
  ] = useData();

  const setVolumeControlsOpen = useVolumeControlsOpen();

  const VCOOn = React.useCallback(() => setVolumeControlsOpen(true), [setVolumeControlsOpen]);
  const VCOOff = React.useCallback(() => setVolumeControlsOpen(false), [setVolumeControlsOpen]);

  const toggleMute = useToggleMute();

  return (
    <div
      className={cx(GUI_VOLUME, {
        [GUI_VOLUME_STATE_OPEN]: isVolumeControlsOpen,
      })}
      onMouseEnter={VCOOn}
      onMouseLeave={VCOOff}
    >
      <Button
        icon={volumeIcon}
        onClick={toggleMute}
        tooltip={tooltipText}
      />
      <div className={GUI_VOLUME_COLLAPSE}>
        <div className={GUI_VOLUME_CONTAINER}>
          <VolumeBar />
        </div>
      </div>
    </div>
  );
});

export default VolumeButton;
