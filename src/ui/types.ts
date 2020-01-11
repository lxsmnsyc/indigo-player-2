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
import PlayerError from '../utils/player-error';
import { TrackInterface, Subtitle, Thumbnail } from '../types';

export interface Data {
  paused: boolean;
  view: ViewTypes;
  visibleControls: boolean;
  progressPercentage: number;
  bufferedPercentage: number;
  volumeBarPercentage: number;
  isVolumeControlsOpen: boolean;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  playRequested: boolean;
  adBreakData?: {
    progressPercentage: number;
  };
  cuePoints: number[];
  rebuffering: boolean;
  timeStatPosition: string;
  timeStatDuration: string;
  error?: PlayerError;
  isCenterClickAllowed: boolean;
  isSeekbarHover: boolean;
  isSeekbarSeeking: boolean;
  seekbarPercentage: number;
  seekbarTooltipText: string;
  seekbarTooltipPercentage: number;
  seekbarThumbnailPercentage: number;
  tracks: TrackInterface[];
  activeTrack: TrackInterface;
  selectedTrack: TrackInterface | string;
  settingsTab: SettingsTabs;
  visibleSettingsTabs: SettingsTabs[];
  subtitles: Subtitle[];
  activeSubtitle: Subtitle;
  playbackRate: number;
  pip: boolean;
  pipSupported: boolean;
  activeThumbnail: Thumbnail;
  isMobile: boolean;
  image: string;
  nodIcon: string;
  getTranslation(text: string): string;
}

export interface Actions {
  playOrPause: (origin?: string) => void;
  startSeeking: () => void;
  seekToPercentage: (percentage: number) => void;
  setVolume: (volume: number) => void;
  setVolumeControlsOpen: (isVolumeControlsOpen: boolean) => void;
  startVolumebarSeeking: () => void;
  stopVolumebarSeeking: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setSeekbarState: (state: any, prevState?: any) => void;
  setVolumebarState: (state: any, prevState?: any) => void;
  selectTrack: (track: TrackInterface) => void;
  setSettingsTab: (tab: SettingsTabs) => void;
  toggleSettings: () => void;
  selectSubtitle: (subtitle: Subtitle) => void;
  setPlaybackRate: (playbackRate: number) => void;
  togglePip: () => void;
  toggleActiveSubtitle: () => void;
}

export interface Info {
  data: Data;
  actions: Actions;
}

export enum ViewTypes {
  ERROR = 'error',
  LOADING = 'loading',
  START = 'start',
  CONTROLS = 'controls',
}

export enum SettingsTabs {
  NONE,
  OPTIONS,
  TRACKS,
  SUBTITLES,
  PLAYBACKRATES,
}

export interface StateStore {
  showControls: () => void;
}


export type Optional<T> = T | null | undefined;
