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
import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import { Optional, SettingsTabs } from '../types';
import { Subtitle, Thumbnail, KeyboardNavigationPurpose } from '../../types';

type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

interface States {
  visibleControls: boolean;
  isSeekbarHover: boolean;
  isSeekbarSeeking: boolean;
  seekbarPercentage: number;
  isVolumeControlsOpen: boolean;
  isVolumebarSeeking: boolean;
  settingsTab: Optional<SettingsTabs>;
  lastActiveSubtitle: Optional<Subtitle>;
  activeThumbnail: Optional<Thumbnail>;
  nodPurpose: Optional<KeyboardNavigationPurpose>;
  setVisibleControls: Dispatcher<boolean>;
  setIsSeekbarHover: Dispatcher<boolean>;
  setIsSeekbarSeeking: Dispatcher<boolean>;
  setSeekbarPercentage: Dispatcher<number>;
  setIsVolumeControlsOpen: Dispatcher<boolean>;
  setIsVolumebarSeeking: Dispatcher<boolean>;
  setSettingsTab: Dispatcher<Optional<SettingsTabs>>;
  setLastActiveSubtitle: Dispatcher<Optional<Subtitle>>;
  setActiveThumbnail: Dispatcher<Optional<Thumbnail>>;
  setNodPurpose: Dispatcher<Optional<KeyboardNavigationPurpose>>;
}

const States = createModel<States>(() => {
  const [visibleControls, setVisibleControls] = React.useState(false);

  const [isSeekbarHover, setIsSeekbarHover] = React.useState(false);
  const [isSeekbarSeeking, setIsSeekbarSeeking] = React.useState(false);
  const [seekbarPercentage, setSeekbarPercentage] = React.useState(0);

  const [isVolumeControlsOpen, setIsVolumeControlsOpen] = React.useState(false);
  const [isVolumebarSeeking, setIsVolumebarSeeking] = React.useState(false);

  const [settingsTab, setSettingsTab] = React.useState<Optional<SettingsTabs>>(null);

  const [lastActiveSubtitle, setLastActiveSubtitle] = React.useState<Optional<Subtitle>>();
  const [activeThumbnail, setActiveThumbnail] = React.useState<Optional<Thumbnail>>();

  const [nodPurpose, setNodPurpose] = React.useState<Optional<KeyboardNavigationPurpose>>();

  return {
    visibleControls,
    isSeekbarHover,
    isSeekbarSeeking,
    seekbarPercentage,
    isVolumeControlsOpen,
    isVolumebarSeeking,
    settingsTab,
    lastActiveSubtitle,
    activeThumbnail,
    nodPurpose,
    setVisibleControls,
    setIsSeekbarHover,
    setIsSeekbarSeeking,
    setSeekbarPercentage,
    setIsVolumeControlsOpen,
    setIsVolumebarSeeking,
    setSettingsTab,
    setLastActiveSubtitle,
    setActiveThumbnail,
    setNodPurpose,
  };
});

export default States;
