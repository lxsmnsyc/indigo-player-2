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
import * as React from 'react';
import Nod from './Nod';
import Data from '../hooks/Data';
import { GUI_CONTAINER_CONTROLS, GUI_CONTAINER_CONTROLS_SEEKBAR } from '../theme';
import Settings from './Settings';
import Center from './Center';
import Rebuffer from './Rebuffer';
import VolumeButton from './VolumeButton';
import TimeStat from './TimeStat';
import PlayButton from './buttons/PlayButton';
import SubtitlesButton from './buttons/SubtitlesButton';
import FullscreenButton from './buttons/FullscreenButton';
import PipButton from './buttons/PipButton';
import SettingsButton from './buttons/SettingsButton';
import Seekbar from './Seekbar';

const ControlsView = React.memo(() => {
  const [
    isCenterClickAllowed,
    rebuffering,
  ] = Data.useSelectors((state) => [
    state.isCenterClickAllowed,
    state.rebuffering,
  ]);

  return (
    <>
      <Nod />
      <Settings />
      {isCenterClickAllowed && <Center />}
      {rebuffering && <Rebuffer />}
      <div className={GUI_CONTAINER_CONTROLS}>
        <PlayButton />
        <VolumeButton />
        <TimeStat />
        <div className={GUI_CONTAINER_CONTROLS_SEEKBAR}>
          <Seekbar />
        </div>
        <SubtitlesButton />
        <PipButton />
        <SettingsButton />
        <FullscreenButton />
      </div>
    </>
  );
});

export default ControlsView;
