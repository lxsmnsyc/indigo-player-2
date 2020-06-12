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
import { EmitterInterface } from './utils/event-emitter';

/**
 * Enums
 */
export enum FormatTypes {
  MP4 = 'mp4',
  WEBM = 'webm',
  MOV = 'mov',
  DASH = 'dash',
  HLS = 'hls',
}

export enum KeyboardNavigationPurpose {
  PAUSE = 'pause',
  PLAY = 'play_arrow',
  PREV_SEEK = 'fast_rewind',
  NEXT_SEEK = 'fast_forward',
  VOLUME_UP = 'volume_up',
  VOLUME_DOWN = 'volume_down',
  VOLUME_MUTED = 'volume_off',
  VOLUME_UNMUTED = 'volume_up',
  TOGGLE_FULLSCREEN = 'fullscreen',
  REQUEST_TOGGLE_SUBTITLES = 'closed_caption',
  REQUEST_TOGGLE_MINIPLAYER = 'featured_video',
}

export enum ModuleLoaderTypes {
  EXTENSION,
  CONTROLLER,
  MEDIA,
  PLAYER,
}

export enum AdBreakType {
  PREROLL = 'preroll',
  MIDROLL = 'midroll',
  POSTROLL = 'postroll',
}

export enum Events {
  // An unrecoverable error occured
  ERROR = 'error',
  DESTROY = 'destroy',
  // booting the instance
  INSTANCE_INITIALIZE = 'instance:initialize',
  // controller, media & extensions are created
  INSTANCE_INITIALIZED = 'instance:initialized',
  // initial properties set (volume, startPosition, ...) and ready for playback
  READY = 'ready',

  // Player state events
  PLAYER_STATE_PLAY = 'player-state:play',
  PLAYER_STATE_PAUSE = 'player-state:pause',
  PLAYER_STATE_PLAYING = 'player-state:playing',
  PLAYER_STATE_ENDED = 'player-state:ended',
  PLAYER_STATE_SEEKED = 'player-state:seeked',
  PLAYER_STATE_TIMEUPDATE = 'player-state:timeupdate',
  PLAYER_STATE_DURATIONCHANGE = 'player-state:durationchange',
  PLAYER_STATE_READY = 'player-state:ready',
  PLAYER_STATE_WAITING = 'player-state:waiting',
  PLAYER_STATE_VOLUMECHANGE = 'player-state:volumechange',
  PLAYER_STATE_SUBTITLECHANGE = 'player-state:subtitlechange',
  PLAYER_STATE_SUBTITLETEXTCHANGE = 'player-state:subtitletextchange',
  PLAYER_STATE_BUFFEREDCHANGE = 'player-state:bufferedchange',
  PLAYER_STATE_RATECHANGE = 'player-state:ratechange',

  // Media state events
  MEDIA_STATE_TRACKS = 'media-state:bitrates',
  MEDIA_STATE_TRACKCHANGE = 'media-state:bitratechange',
  MEDIA_STATE_AUDIOLANGUAGES = 'media-state:audiolanguages',
  MEDIA_STATE_AUDIOLANGUAGECHANGE = 'media-state:audiolanguagechange',

  // Shaka
  SHAKA_INSTANCE = 'shaka:instance',

  // Ads
  ADBREAKS = 'ad:adbreaks',
  ADBREAK_STARTED = 'ad:adbreak-started',
  ADBREAK_ENDED = 'ad:adbreak-ended',
  ADBREAK_STATE_TIMEUPDATE = 'ad-state:adbreak-timeupdate',
  ADBREAK_STATE_PLAY = 'ad-state:adbreak-play',
  ADBREAK_STATE_PAUSE = 'ad-state:adbreak-pause',
  ADBREAK_STATE_PLAYING = 'ad-state:adbreak-playing',
  ADBREAK_STATE_BUFFERING = 'ad-state:adbreak-buffering',
  AD_STARTED = 'ad:ad-started',
  AD_ENDED = 'ad:ad-ended',

  // Misc
  FULLSCREEN_SUPPORTED = 'fullscreen:supported',
  FULLSCREEN_CHANGE = 'fullscreen:change',
  PIP_CHANGE = 'pip:change',
  KEYBOARDNAVIGATION_KEYDOWN = 'keyboardnavigation:keydown',
  DIMENSIONS_CHANGE = 'dimensions:change',

  // State
  STATE_CHANGE = 'state:change',
  STATE_READY = 'state:ready',
  STATE_PLAY_REQUESTED = 'state:playrequested',
  STATE_PLAYING = 'state:playing',
  STATE_PAUSED = 'state:paused',
  STATE_CURRENTTIME_CHANGE = 'state:currenttime-change',
  STATE_BUFFERING = 'state:buffering',
  STATE_ADBREAKS = 'state:adbreaks',
  STATE_ADBREAK_STARTED = 'state:adbreak-started',
  STATE_ADBREAK_ENDED = 'state:adbreak-ended',
  STATE_AD_STARTED = 'state:ad-started',
  STATE_AD_ENDED = 'state:ad-ended',
  STATE_STARTED = 'state:started',
  STATE_CONTENT_STARTED = 'state:content-started',
  STATE_CONTENT_ENDED = 'state:content-ended',
  STATE_ENDED = 'state:ended',
  STATE_ERROR = 'state:error',
  STATE_BUFFERED_CHANGE = 'state:buffered',
  STATE_VOLUME_CHANGE = 'state:volume-change',
  STATE_DURATION_CHANGE = 'state:duration-change',
  STATE_FULLSCREEN_SUPPORTED = 'state:fullscreen-supported',
  STATE_FULLSCREEN_CHANGE = 'state:fullscreen-change',
  STATE_TRACKS = 'state:tracks',
  STATE_TRACK_CHANGE = 'state:track-change',
  STATE_SUBTITLE_CHANGE = 'state:subtitle-change',
  STATE_SUBTITLETEXT_CHANGE = 'state:subtitletext-change',
  STATE_SUBTITLESETTINGS_CHANGE = 'state:subtitlesettings-change',
  STATE_PLAYBACKRATE_CHANGE = 'state:playbackrate-change',
  STATE_PIP_CHANGE = 'state:pip-change',
  STATE_AUDIOLANGUAGES = 'state:audiolanguages',
  STATE_AUDIOLANGUAGE_CHANGE = 'state:audiolanguage-change',
  STATE_DIMENSIONS_CHANGE = 'state:dimensions-change',

  // UI
  UI_VISIBLECONTROLS_CHANGE = 'ui:visiblecontrols-change',
  UI_VIEW_CHANGE = 'ui:view-change',
  UI_STATE_CHANGE = 'ui:state-change',
}

export enum ErrorCodes {
  NO_SUPPORTED_FORMAT_FOUND = 1001,
  CONTROLLER_LOAD_FAILED = 1002,

  // Shaka
  SHAKA_CRITICAL_ERROR = 2001,

  // HLSjs
  HLSJS_CRITICAL_ERROR = 3001,
}

export interface Thumbnail {
  start: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Cuepoint = 'preroll' | 'postroll' | number;

export type NextHook = (...args: any[]) => void;

export interface PlayerErrorInterface {
  code?: ErrorCodes;
  underlyingError: Error;
}

export interface HookInterface {
  create(name: string, callback: NextHook): void;
}

export interface AccessibleObject {
  [key: string]: any;
}

export interface Format {
  type: FormatTypes;
  src: string;
  drm?: {
    widevine?: {
      licenseUrl: string;
    };
    playready?: {
      licenseUrl: string;
    };
  };
}

export interface Subtitle {
  label: string;
  srclang: string;
  src: string;
}

export interface AdBreak {
  sequenceIndex: number;
  id: string;
  type: AdBreakType;
  startsAt: number;
  duration: number;
  hasBeenWatched: boolean;
}

export interface Ad {
  sequenceIndex: number;
  freewheelAdInstance?: any;
}

export interface Config {
  enableLogs: boolean;

  autoplay: boolean;
  keyboardNavigation: boolean | 'focus';

  aspectRatio?: number;
  volume?: number;
  startPosition?: number;

  ui: {
    enabled: boolean;
    lockControlsVisibility: boolean;
    locale: string;
    pip: boolean;
    image?: string;
    ignoreStylesheet?: boolean;
    liveOnly?: boolean;
  };

  sources: Format[];

  freewheel?: {
    clientSide: boolean;
    server: string;
    videoAsset: string;
    duration: number;
    network: number;
    siteSection: string;
    profile: string;
    cuepoints: Cuepoint[];
  };

  googleIMA?: {
    src: string;
  };

  subtitles: Subtitle[];

  thumbnails?: {
    src: string;
  };
}

export interface EnvInterface {
  // Browser support
  isSafari: boolean;
  isEdge: boolean;
  isIE: boolean;
  isChrome: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isFacebook: boolean;

  // Autoplay
  canAutoplay: boolean;
}

export interface TrackInterface {
  id: number;
  width: number;
  height: number;
  bandwidth: number;
}

export interface Loadable {
  load: () => Promise<void> | void;
  unload: () => void;
}

export interface Playable {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
}

export interface Trackable {
  selectTrack: (track: TrackInterface) => void;
  selectAudioLanguage: (language: string) => void;
}

export interface ControllerInterface extends ModuleInterface, Loadable, Playable, Trackable {
}

export interface PlayerInterface extends ModuleInterface, Loadable, Playable {
  setSource: (src: string) => void;
}

export interface MediaInterface extends ModuleInterface, Loadable, Playable, Trackable {
}

export interface InstanceInterface extends EmitterInterface, Playable, Trackable {
  config: Config;
  container: HTMLElement;
  playerContainer: HTMLElement;
  uiContainer: HTMLElement;
  adsContainer: HTMLElement;

  env?: EnvInterface;
  controller?: ControllerInterface;
  player?: PlayerInterface;
  media?: MediaInterface;
  format?: Format;
  extensions: ModuleInterface[];

  destroy: () => void;

  setError: (error: PlayerErrorInterface) => void;
  canAutoplay: () => boolean;

  getModule: (name: string) => ModuleInterface | undefined;
  getStats: () => any;
}


export interface ModuleLoaderInterface<T> {
  type: ModuleLoaderTypes;
  create: (instance: InstanceInterface) => T | Promise<T>;
  isSupported: (
    instance: InstanceInterface,
    isSupportedArgs?: any,
  ) => boolean | Promise<boolean>;
}

export interface ModuleInterface extends EmitterInterface, AccessibleObject {
  name: string;

  hooks?: HookInterface;

  instance: InstanceInterface;
}
