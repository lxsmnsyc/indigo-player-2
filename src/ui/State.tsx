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
import React, { RefObject } from 'react';
import createModel from '@lxsmnsyc/react-scoped-model';
import {
  TrackInterface,
  InstanceInterface,
  Subtitle,
  Thumbnail,
  KeyboardNavigationPurpose,
  Events, AdBreakType,
} from '../types';
import {
  SettingsTabs, ViewTypes, Data, Actions, Info,
} from './types';
import { EventUnsubscribeFn, attachEvents } from './utils/attachEvents';
import triggerEvent from './triggerEvent';
import { getTranslation } from './i18n';
import { secondsToHMS } from './utils/secondsToHMS';
import FullscreenExtension from '../extensions/FullscreenExtension/FullscreenExtension';
import {
  GUI_SETTINGS,
  GUI_BUTTON_SETTINGS,
} from './theme';
import { StateInterface } from '../extensions/StateExtension/StateExtension';

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


function uniqueBy<T, R>(array: T[], map: (value: T) => R): T[] {
  const newArr: T[] = [];
  const records: R[] = [];

  array.forEach((item) => {
    const newValue = map(item);

    if (!records.includes(newValue)) {
      newArr.push(item);
      records.push(newValue);
    }
  });

  return newArr;
}

export const StateContext = React.createContext<Info | null>(null);

interface StateStoreProps {
  instance: InstanceInterface;
  player: StateInterface;
}

interface StateStoreState {
  visibleControls: boolean;

  // Seekbar
  isSeekbarHover: boolean;
  isSeekbarSeeking: boolean;
  seekbarPercentage: number;

  // Volume
  isVolumeControlsOpen: boolean;
  isVolumebarSeeking: boolean;

  // Settings
  settingsTab?: SettingsTabs;

  lastActiveSubtitle?: Subtitle;
  activeThumbnail?: Thumbnail;

  nodPurpose?: KeyboardNavigationPurpose | null;
}

export const seekbarRef: RefObject<HTMLDivElement> = React.createRef();

export const seekbarTooltipRef: RefObject<HTMLDivElement> = React.createRef();

export const seekbarThumbnailRef: RefObject<HTMLDivElement> = React.createRef();

const StateStore = createModel<Info, StateStoreProps>(({ instance, player }) => {
  return {
  };
});

export class StateStore
  extends React.Component<StateStoreProps, StateStoreState>
  implements StateStore {
  private activeTimer?: number;

  private nodTimer?: number | null;

  private unsubscribe: EventUnsubscribeFn;

  private prevData?: Data;

  private actions: Actions;

  constructor(props: StateStoreProps) {
    super(props);

    this.state = {
      visibleControls: false,

      // Seekbar
      isSeekbarHover: false,
      isSeekbarSeeking: false,
      seekbarPercentage: 0,

      // Volume
      isVolumeControlsOpen: false,
      isVolumebarSeeking: false,
    };

    const { instance } = this.props;

    this.unsubscribe = attachEvents([
      {
        element: instance.container,
        events: ['mouseenter', 'mousemove', 'mousedown'],
        callback: this.showControls.bind(this),
      },
      {
        element: instance.container,
        events: ['mouseleave'],
        callback: this.hideControls.bind(this),
      },
      {
        element: window as any,
        events: ['mousedown'],
        callback: this.closeSettings.bind(this),
      },
    ]);

    instance.on(Events.KEYBOARDNAVIGATION_KEYDOWN, (data: any) => {
      this.showControls();
      this.triggerNod(data.purpose);

      if (data.purpose === KeyboardNavigationPurpose.REQUEST_TOGGLE_SUBTITLES) {
        this.toggleActiveSubtitle();
      }
      if (
        data.purpose === KeyboardNavigationPurpose.REQUEST_TOGGLE_MINIPLAYER
      ) {
        this.togglePip();
      }
    });

    this.actions = this.createActions();
  }

  public componentDidUpdate(): void {
    const data = this.createData();
    const { instance } = this.props;
    triggerEvent(instance, data, this.prevData);
    this.prevData = data;
  }

  public componentWillUnmount(): void {
    this.unsubscribe();
  }


  private setVolumeControlsOpen(isVolumeControlsOpen: boolean): void {
    const { instance } = this.props;

    if (!instance.env?.isMobile) {
      this.setState({ isVolumeControlsOpen });
    }
  }

  private setSeekbarState(state: any, prevState: any): void {
    let activeThumbnail = null;
    const { instance, player } = this.props;
    const thumbnailsExtension: any = instance.getModule(
      'ThumbnailsExtension',
    );
    if ((state.hover || state.seeking) && thumbnailsExtension) {
      activeThumbnail = thumbnailsExtension.getThumbnail(
        state.percentage * (player.duration ?? 0),
      );
    }

    this.setState({
      isSeekbarHover: state.hover,
      isSeekbarSeeking: state.seeking,
      seekbarPercentage: state.percentage,
      activeThumbnail,
    });

    if (!state.seeking && prevState.seeking) {
      this.showControls();
      instance.seekTo((player.duration ?? 0) * state.percentage);
    }
  }

  private setVolumebarState(state: any, prevState: any): void {
    const { instance } = this.props;
    this.setState({
      isVolumebarSeeking: state.seeking,
    });

    if (!state.seeking && prevState.seeking) {
      this.showControls();
    }

    if (state.seeking) {
      const volume = state.percentage;
      instance.setVolume(volume);
    }
  }

  private setPlaybackRate(playbackRate: number): void {
    const { instance } = this.props;
    instance.setPlaybackRate(playbackRate);
  }

  private getTranslation(text: string): string {
    const { instance } = this.props;
    return getTranslation(instance.config.ui.locale)(text);
  }

  private setSettingsTab(settingsTab: SettingsTabs): void {
    this.setState({ settingsTab });
  }

  private toggleSettings(): void {
    this.setState((prevState) => ({
      settingsTab: prevState.settingsTab
        ? SettingsTabs.NONE
        : SettingsTabs.OPTIONS,
    }));
  }

  private hideControls(): void {
    clearTimeout(this.activeTimer);
    this.setState({ visibleControls: false });
  }

  public showControls(): void {
    clearTimeout(this.activeTimer);

    this.setState({ visibleControls: true });

    this.activeTimer = (window as any).setTimeout(() => {
      this.setState({ visibleControls: false });
    }, 2000);
  }

  private selectSubtitle(subtitle: Subtitle): void {
    if (subtitle) {
      this.setState({ lastActiveSubtitle: subtitle });
    }

    const { instance } = this.props;
    (instance.getModule('SubtitlesExtension') as any).setSubtitle(
      subtitle ? subtitle.srclang : null,
    );
  }

  private toggleActiveSubtitle(): void {
    let { lastActiveSubtitle } = this.state;
    const { player, instance } = this.props;
    if (!lastActiveSubtitle) {
      [lastActiveSubtitle] = instance.config.subtitles;
    }

    if (!player.subtitle) {
      this.selectSubtitle(lastActiveSubtitle);
    }
  }

  private togglePip(): void {
    const { instance } = this.props;
    (instance.getModule('PipExtension') as any).togglePip();
  }

  private closeSettings(event: MouseEvent): void {
    const { instance } = this.props;
    const isOver = (className: string): boolean => {
      const { target } = event;
      const container = instance.container.querySelector(className);
      return (
        !!container && (container === target || container.contains(target as Node))
      );
    };

    if (isOver(GUI_SETTINGS) || isOver(GUI_BUTTON_SETTINGS)) {
      return;
    }

    this.setState({ settingsTab: SettingsTabs.NONE });
  }

  private selectTrack(track: TrackInterface): void {
    const { instance } = this.props;
    instance.selectTrack(track);
  }

  private toggleFullscreen(): void {
    const { instance } = this.props;
    (instance.getModule(
      'FullscreenExtension',
    ) as FullscreenExtension).toggleFullscreen();
  }

  private playOrPause(origin?: string): void {
    const { instance, player } = this.props;
    if (!player.playRequested) {
      instance.play();
      if (origin === 'center') {
        this.triggerNod(KeyboardNavigationPurpose.PLAY);
      }
    } else {
      instance.pause();
      if (origin === 'center') {
        this.triggerNod(KeyboardNavigationPurpose.PAUSE);
      }
    }
  }

  private toggleMute(): void {
    const { instance, player } = this.props;
    if (player.volume) {
      instance.setVolume(0);
    } else {
      instance.setVolume(1);
    }
  }

  private triggerNod(purpose: KeyboardNavigationPurpose): void {
    this.setState({ nodPurpose: null }, () => {
      if (this.nodTimer) {
        clearTimeout(this.nodTimer);
        this.nodTimer = null;
      }
      this.setState({ nodPurpose: purpose }, () => {
        this.nodTimer = (window as any).setTimeout(() => {
          this.setState({ nodPurpose: null });
          this.nodTimer = null;
        }, 500);
      });
    });
  }

  /**
   * Create a state snapshot for the player.
   * @return {IData} The snapshot data
   */
  private createData(): Data {
    const { player, instance } = this.props;
    const {
      isSeekbarSeeking,
      isVolumebarSeeking,
      settingsTab,
      seekbarPercentage,
      nodPurpose,
      activeThumbnail,
      isSeekbarHover,
    } = this.state;
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

    // Do we need to show the controls?
    let { visibleControls } = this.state;
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
    let { isVolumeControlsOpen } = this.state;
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
            : adBreak.startsAt / player.duration
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
    let seekbarTooltipText;
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
      const seekbarWidth = (seekbarRef.current as HTMLElement).getBoundingClientRect()
        .width;
      const thumbnailWidth = (seekbarThumbnailRef.current as HTMLElement).getBoundingClientRect()
        .width;
      const offset = thumbnailWidth / 2 / seekbarWidth;
      if (seekbarThumbnailPercentage < offset) {
        seekbarThumbnailPercentage = offset;
      } else if (seekbarThumbnailPercentage > 1 - offset) {
        seekbarThumbnailPercentage = 1 - offset;
      }
    }

    const tracks = uniqueBy<TrackInterface, number>(
      player.tracks.sort(
        (a, b) => Number(b.height) - Number(a.height),
      ),
      (item) => item.height,
    );

    let activeTrack: TrackInterface | string | undefined;
    if (player.track) {
      activeTrack = tracks.find(
        (track) => track.id === player.track?.id,
      );
    }

    let selectedTrack = activeTrack;
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

    let pipSupported = false;
    if (instance.config.ui.pip) {
      pipSupported = true;
    }

    const nodIcon = nodPurpose;

    return {
      // UI specific state
      view,
      visibleControls,
      isCenterClickAllowed,
      settingsTab,
      visibleSettingsTabs,
      isMobile: instance.env?.isMobile,
      image: instance.config.ui.image,
      nodIcon,

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
      pipSupported,

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

      // i18n
      getTranslation: this.getTranslation.bind(this),
    } as Data;
  }

  private createActions(): Actions {
    return {
      playOrPause: this.playOrPause.bind(this),
      toggleFullscreen: this.toggleFullscreen.bind(this),
      setVolumeControlsOpen: this.setVolumeControlsOpen.bind(this),
      toggleMute: this.toggleMute.bind(this),
      setSeekbarState: this.setSeekbarState.bind(this),
      setVolumebarState: this.setVolumebarState.bind(this),
      selectTrack: this.selectTrack.bind(this),
      setSettingsTab: this.setSettingsTab.bind(this),
      toggleSettings: this.toggleSettings.bind(this),
      selectSubtitle: this.selectSubtitle.bind(this),
      toggleActiveSubtitle: this.toggleActiveSubtitle.bind(this),
      setPlaybackRate: this.setPlaybackRate.bind(this),
      togglePip: this.togglePip.bind(this),
    } as Actions;
  }

  public render(): JSX.Element {
    const data = this.createData();
    const { children } = this.props;
    const { actions } = this;

    return (
      <StateContext.Provider value={{ data, actions }}>
        { children }
      </StateContext.Provider>
    );
  }
}
