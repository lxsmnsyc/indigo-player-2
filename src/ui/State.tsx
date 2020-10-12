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
import StateProps, { StateStoreState } from './hooks/StateProps';
import Lifecycle from './hooks/Lifecycle';
import States from './hooks/States';
import TriggerNod from './hooks/actions/TriggerNod';
import Data from './hooks/Data';
import GetTranslation from './hooks/actions/GetTranslation';
import PlaybackRate from './hooks/actions/PlaybackRate';
import PlayOrPause from './hooks/actions/PlayOrPause';
import SelectSubtitle from './hooks/actions/SelectSubtitle';
import SelectTrack from './hooks/actions/SelectTrack';
import Seekbar from './hooks/actions/SeekbarState';
import SettingsTab from './hooks/actions/SettingsTab';
import ToggleActiveSubtitle from './hooks/actions/ToggleActiveSubtitle';
import ToggleFullscreen from './hooks/actions/ToggleFullscreen';
import ToggleMute from './hooks/actions/ToggleMute';
import TogglePip from './hooks/actions/TogglePip';
import VisibleControls from './hooks/actions/VisibleControls';
import VolumeBarSeek from './hooks/actions/VolumeBarSeek';
import VolumeControlsOpen from './hooks/actions/VolumeControlsOpen';

interface ComposeProps {
  elements: Array<React.FunctionComponentElement<any>>;
  children: React.ReactNode;
}

export function Compose({ elements, children }: ComposeProps): JSX.Element {
  return (
    <>
      { elements.reduceRight((acc, el) => React.cloneElement(el, {}, acc), children) }
    </>
  );
}

interface StateStoreProps extends StateStoreState {
  children: React.ReactNode;
}

export default function StateStore({
  instance, player, emitter, children,
}: StateStoreProps): JSX.Element {
  const providers = React.useMemo(() => [
    /**
     * Top state
     */
    <StateProps.Provider instance={instance} player={player} emitter={emitter} />,
    <States.Provider />,

    /**
     * Actions (sorted by dependency)
     */
    <TriggerNod.Provider />,
    <GetTranslation.Provider />,
    <PlaybackRate.Provider />,
    <Seekbar.Provider />,
    <SelectSubtitle.Provider />,
    <SelectTrack.Provider />,
    <SettingsTab.Provider />,
    <ToggleFullscreen.Provider />,
    <ToggleMute.Provider />,
    <TogglePip.Provider />,
    <VisibleControls.Provider />,
    <VolumeBarSeek.Provider />,
    <VolumeControlsOpen.Provider />,

    <PlayOrPause.Provider />,
    <ToggleActiveSubtitle.Provider />,

    /**
     * Bottom state
     */
    <Data.Provider />,
    <Lifecycle />,
  ], [instance, player, emitter]);

  return (
    <Compose elements={providers}>
      { children }
    </Compose>
  );
}
