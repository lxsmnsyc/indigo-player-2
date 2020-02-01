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
import StateProps from './StateProps';
import { ViewTypes, SettingsTabs, Optional } from '../types';
import PlayerError from '../../utils/player-error';
import {
  TrackInterface, Subtitle, Thumbnail, AdBreakType,
} from '../../types';
import secondsToHMS from '../utils/secondsToHMS';
import {
  seekbarRef,
  seekbarTooltipRef,
  seekbarThumbnailRef,
} from '../refs';
import States from './States';
import uniqueBy from '../utils/uniqueBy';
import GetTranslation from './actions/GetTranslation';

export interface DataState {
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
  adBreakData: Optional<{
    progressPercentage: number;
  }>;
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
  activeTrack: Optional<TrackInterface>;
  selectedTrack: Optional<TrackInterface | string>;
  settingsTab: Optional<SettingsTabs>;
  visibleSettingsTabs: SettingsTabs[];
  subtitles: Subtitle[];
  activeSubtitle: Optional<Subtitle>;
  playbackRate: number;
  pip: boolean;
  pipSupported: boolean;
  activeThumbnail: Optional<Thumbnail>;
  isMobile: boolean;
  image: Optional<string>;
  nodIcon: string;
  getTranslation: (text: string) => string;
}

const Data = createModel<DataState>(() => {
  const [instance, player] = StateProps.useSelectors((state) => [
    state.instance,
    state.player,
  ]);

  // Figure out which view to show.
  let view = ViewTypes.LOADING;
  if (player.ready && player.waitingForUser) {
    view = ViewTypes.START;
  }
  if (player.videoSessionStarted) {
    view = ViewTypes.CONTROLS;
  }
  if (player.playRequested && !player.started) {
    view = ViewTypes.LOADING;
  }
  if (player.error) {
    view = ViewTypes.ERROR;
  }

  /**
   * Modifiable variables
   */
  let [
    visibleControls,
    isVolumeControlsOpen,
  ] = States.useSelectors((state) => [
    state.visibleControls,
    state.isVolumeControlsOpen,
  ]);

  /**
   * Constant variables
   */
  const [
    isSeekbarSeeking,
    isVolumebarSeeking,
    settingsTab,
    seekbarPercentage,
    nodPurpose,
    activeThumbnail,
    isSeekbarHover,
  ] = States.useSelectors((state) => [
    state.isSeekbarSeeking,
    state.isVolumebarSeeking,
    state.settingsTab,
    state.seekbarPercentage,
    state.nodPurpose,
    state.activeThumbnail,
    state.isSeekbarHover,
  ]);


  // Do we need to show the controls?
  if (
    isSeekbarSeeking
    || isVolumebarSeeking
    || !!settingsTab
    || instance.config.ui.lockControlsVisibility
  ) {
    // If we're seeking, either by video position or volume, keep the controls visible.
    visibleControls = true;
  }

  // Do we need to open the volume bar?
  if (isVolumebarSeeking) {
    // If we're seeking volume, keep the volume bar open.
    isVolumeControlsOpen = true;
  }

  // Create a data object for the currently playing ad.
  let adBreakData;
  if (player.adBreak) {
    adBreakData = {
      progressPercentage: (player.adBreakCurrentTime ?? 0) / player.adBreak.duration,
    };
  }

  // Calculate the current progress percentage.
  // TODO: Do not calculate progressPercentage
  //       if controls are not visible for x-ms (animation time)
  //       and with smooth seeking on.
  let progressPercentage = 0;
  if (player.duration) {
    progressPercentage = (player.currentTime ?? 0) / player.duration;
  }
  if (isSeekbarSeeking) {
    // If we're seeking with the seekbar, no longer show the current video progress
    // but use the seekbar percentage.
    progressPercentage = seekbarPercentage;
  }
  if (adBreakData) {
    // If we're playing an ad, the progress bar displays the progress of the adbreak.
    progressPercentage = adBreakData.progressPercentage;
  }

  // Create a percentages list of the cuepoints.
  let cuePoints: number[] = [];
  if (player.duration && player.adBreaks.length) {
    cuePoints = player.adBreaks
      .filter(
        (adBreak) => adBreak.type === AdBreakType.MIDROLL && !adBreak.hasBeenWatched,
      )
      .map((adBreak) => (
        (player.duration == null)
          ? 0
          : (adBreak.startsAt / player.duration)
      ));
  }

  // Create a proper time stat ((HH)/MM/SS).
  let timeStatDuration = '';
  if (player.duration) {
    timeStatDuration = secondsToHMS(player.duration);
  }
  const timeStatPosition = secondsToHMS(player.currentTime ?? 0);

  // Pass an error if we have one.
  let error;
  if (player.error) {
    error = player.error;
  }

  // Allowing a center click will result in a play or a pause.
  let isCenterClickAllowed = true;
  if (adBreakData || instance.env?.isMobile) {
    // If you click an ad, we don't want to pause but perform an ad clickthrough.
    // Also, on mobile this doesn't make sense because we'll use a tap to show the UI instead.
    isCenterClickAllowed = false;
  }

  // The seekbar tooltip is the current time ((HH)/MM/SS).
  let seekbarTooltipText = '';
  if (player.duration) {
    seekbarTooltipText = secondsToHMS(
      seekbarPercentage * player.duration,
    );
  }

  // Calculate the seekbar tooltip percentage for placement.
  let seekbarTooltipPercentage = seekbarPercentage;
  if (seekbarRef.current && seekbarTooltipRef.current) {
    // The tooltip is placed in the center, we don't want it to go out of bounds.
    // Calculate and adjust the correct placement so it'll
    // stick on the sides (eg, moving mouse to 00:00).
    const seekbarWidth = (seekbarRef.current as HTMLElement).getBoundingClientRect()
      .width;
    const tooltipWidth = (seekbarTooltipRef.current as HTMLElement).getBoundingClientRect()
      .width;
    const offset = tooltipWidth / 2 / seekbarWidth;
    if (seekbarTooltipPercentage < offset) {
      seekbarTooltipPercentage = offset;
    } else if (seekbarTooltipPercentage > 1 - offset) {
      seekbarTooltipPercentage = 1 - offset;
    }
  }

  // Calculate the seekbar thumbnail percentage for placement.
  let seekbarThumbnailPercentage = seekbarPercentage;
  if (seekbarRef.current && seekbarThumbnailRef.current) {
    // The tooltip is placed in the center, we don't want it to go out of bounds.
    // Calculate and adjust the correct placement so
    // it'll stick on the sides (eg, moving mouse to 00:00).
    const seekbarWidth = seekbarRef.current.getBoundingClientRect().width;
    const thumbnailWidth = seekbarThumbnailRef.current.getBoundingClientRect().width;
    const offset = (thumbnailWidth / 2) / seekbarWidth;
    if (seekbarThumbnailPercentage < offset) {
      seekbarThumbnailPercentage = offset;
    } else if (seekbarThumbnailPercentage > 1 - offset) {
      seekbarThumbnailPercentage = 1 - offset;
    }
  }

  const sortedTracks = [...player.tracks].sort(
    (a, b) => Number(b.height) - Number(a.height),
  );

  const tracks = uniqueBy(sortedTracks, (item) => item.height);

  let activeTrack: Optional<TrackInterface>;
  if (player.track) {
    activeTrack = tracks.find(
      (track) => track.id === player.track?.id,
    );
  }

  let selectedTrack: Optional<TrackInterface | string> = activeTrack;
  if (player.trackAutoSwitch) {
    selectedTrack = 'auto';
  }

  const subtitles = instance.config.subtitles || [];

  const activeSubtitle = player.subtitle;

  const visibleSettingsTabs = [SettingsTabs.PLAYBACKRATES];
  if (subtitles.length) {
    visibleSettingsTabs.push(SettingsTabs.SUBTITLES);
  }
  if (tracks.length) {
    visibleSettingsTabs.push(SettingsTabs.TRACKS);
  }

  const getTranslation = GetTranslation.useSelector((state) => state.getTranslation);

  return {
    // UI specific state
    view,
    visibleControls,
    isCenterClickAllowed,
    settingsTab,
    visibleSettingsTabs,
    isMobile: !!instance.env?.isMobile,
    image: instance.config.ui.image,
    nodIcon: nodPurpose ?? '',

    // Player
    playRequested: player.playRequested,
    paused: player.paused,
    rebuffering: player.buffering,
    tracks,
    activeTrack,
    selectedTrack,
    error,
    cuePoints,
    timeStatPosition,
    timeStatDuration,
    playbackRate: player.playbackRate,
    pip: player.pip,
    pipSupported: instance.config.ui.pip,

    // Progress bar
    progressPercentage,
    bufferedPercentage: player.bufferedPercentage,
    isSeekbarHover,
    isSeekbarSeeking,
    seekbarPercentage,
    seekbarTooltipText,
    seekbarTooltipPercentage,
    seekbarThumbnailPercentage,

    // Fullscreen
    fullscreenSupported: player.fullscreenSupported,
    isFullscreen: player.fullscreen,

    // Ads
    adBreakData,

    // Volume button & volume bar
    isVolumeControlsOpen,
    volumeBarPercentage: player.volume,

    // Subtitles
    subtitles,
    activeSubtitle,
    activeThumbnail,

    getTranslation,
  };
});

export default Data;
