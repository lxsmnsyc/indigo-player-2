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
import {
  AdBreak, InstanceInterface, Events, NextHook, AdBreakType,
} from '../../types';
import Module from '../../module';
import HTML5Player from '../../player/HTML5Player/HTML5Player';

interface AdBreakIMA extends AdBreak {
  googleIMAAd?: any;
}

export default class GoogleIMAExtension extends Module {
  public name = 'GoogleIMAExtension';

  private adContainer?: HTMLElement;

  private adDisplayContainer: any;

  private adsRequested = false;

  private adsLoader: any;

  private ima: any;

  private adsManager: any;

  private adBreaks?: AdBreakIMA[];

  private currentAdBreak?: AdBreakIMA;

  constructor(instance: InstanceInterface) {
    super(instance);

    if (!(window as any).google || !(window as any).google.ima) {
      return;
    }

    this.ima = (window as any).google.ima;

    this.on(
      Events.INSTANCE_INITIALIZED,
      this.onInstanceInitialized.bind(this),
    );

    if (this.instance.controller && this.instance.controller.hooks) {
      this.instance.controller.hooks.create(
        'play',
        this.onControllerPlay.bind(this),
      );
      this.instance.controller.hooks.create(
        'pause',
        this.onControllerPause.bind(this),
      );
      this.instance.controller.hooks.create(
        'setVolume',
        this.onControllerSetVolume.bind(this),
      );
      this.instance.controller.hooks.create(
        'seekTo',
        this.onControllerSeekTo.bind(this),
      );
    }
  }

  private onInstanceInitialized(): void {
    this.adContainer = document.createElement('div');
    this.adContainer.style.position = 'absolute';
    this.adContainer.style.left = '0px';
    this.adContainer.style.right = '0px';
    this.adContainer.style.top = '0px';
    this.adContainer.style.bottom = '0px';
    this.instance.adsContainer.appendChild(this.adContainer);

    const { mediaElement } = this.instance.player as HTML5Player;

    this.adDisplayContainer = new this.ima.AdDisplayContainer(
      this.adContainer,
      mediaElement,
    );
    this.adDisplayContainer.initialize();

    // Stretch the container that Google IMA adds to the DOM
    const imaContainer: HTMLElement = this.adContainer.firstChild as HTMLElement;
    imaContainer.style.top = '0px';
    imaContainer.style.left = '0px';
    imaContainer.style.right = '0px';
    imaContainer.style.bottom = '0px';

    this.adsLoader = new this.ima.AdsLoader(this.adDisplayContainer);
    this.adsLoader.addEventListener(
      this.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onAdsManagerLoaded.bind(this),
      false,
    );
  }

  private onControllerPlay(next: NextHook): void {
    if (!this.adsRequested) {
      this.emit(Events.ADBREAK_STATE_PLAY, null);
      this.requestAds();
      return;
    }

    if (this.currentAdBreak) {
      this.emit(Events.ADBREAK_STATE_PLAY, null);
      this.adsManager.resume();
      return;
    }

    next();
  }

  private onControllerPause(next: NextHook): void {
    if (this.currentAdBreak) {
      this.emit(Events.ADBREAK_STATE_PAUSE, null);
      this.adsManager.pause();
      return;
    }

    next();
  }

  private onControllerSetVolume(next: NextHook, volume: number): void {
    if (this.adsManager) {
      this.adsManager.setVolume(volume);
    }
    next();
  }

  private onControllerSeekTo(next: NextHook): void {
    if (this.currentAdBreak) {
      return;
    }
    next();
  }

  private requestAds(): void {
    const adsRequest = new this.ima.AdsRequest();

    adsRequest.adTagUrl = this.instance.config.googleIMA?.src;

    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 400;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    this.adsLoader.requestAds(adsRequest);
  }

  private onAdsManagerLoaded(event: any): void {
    this.adsRequested = true;

    const { mediaElement } = this.instance.player as HTML5Player;

    this.adsManager = event.getAdsManager(mediaElement, {
      autoAlign: false,
    });

    this.adBreaks = this.adsManager.getCuePoints().map((cuepoint: number, index: any) => {
      let type = AdBreakType.MIDROLL;
      if (cuepoint === 0) {
        type = AdBreakType.PREROLL;
      } else if (cuepoint === -1) {
        type = AdBreakType.POSTROLL;
      }

      return {
        sequenceIndex: index,
        id: `ima-${type === AdBreakType.MIDROLL ? cuepoint : type}`,
        type,
        startsAt: cuepoint,
        hasBeenWatched: false,
      };
    });

    this.emit(Events.ADBREAKS, {
      adBreaks: this.adBreaks,
    });

    this.adsManager.addEventListener(
      this.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      this.onContentPauseRequested.bind(this),
    );

    this.adsManager.addEventListener(
      this.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      this.onContentResumeRequested.bind(this),
    );

    this.adsManager.addEventListener(
      this.ima.AdEvent.Type.AD_PROGRESS,
      this.onAdProgress.bind(this),
    );

    this.adsManager.addEventListener(
      this.ima.AdEvent.Type.RESUMED,
      this.onResumed.bind(this),
    );

    this.adsManager.addEventListener(
      this.ima.AdEvent.Type.STARTED,
      this.onStarted.bind(this),
    );

    this.adsManager.addEventListener(
      this.ima.AdEvent.Type.COMPLETE,
      this.onComplete.bind(this),
    );

    try {
      this.adsManager.init('100%', '100%', this.ima.ViewMode.NORMAL);
      this.adsManager.start();
    } catch (error) {
      if (this.instance.media) {
        this.instance.media.play();
      }
    }
  }

  private onContentPauseRequested(): void {
    if (this.instance.media) {
      this.instance.media.pause();
    }
  }

  private onContentResumeRequested(): void {
    if (this.instance.media) {
      this.instance.media.play();
    }
  }

  private onAdProgress(event: any): void {
    const { duration } = event.getAdData();
    const remainingTime = this.adsManager.getRemainingTime();

    this.emit(Events.ADBREAK_STATE_TIMEUPDATE, {
      currentTime: duration - remainingTime,
    });
  }

  private onResumed(): void {
    this.emit(Events.ADBREAK_STATE_PLAYING, null);
  }

  private onStarted(event: any): void {
    if (this.adBreaks) {
      const adBreak = this.adBreaks[
        event
          .getAd()
          .getAdPodInfo()
          .getPodIndex()
      ];

      this.currentAdBreak = adBreak;

      this.updateAdBreakData(event);

      this.emit(Events.ADBREAK_STARTED, {
        adBreak,
      });

      this.emit(Events.ADBREAK_STATE_PLAYING, null);
    }
  }

  private onComplete(): void {
    const adBreak = this.currentAdBreak;
    this.currentAdBreak = undefined;

    if (adBreak) {
      adBreak.hasBeenWatched = true;
    }

    this.emit(Events.ADBREAK_ENDED, {
      adBreak,
    });
  }

  private updateAdBreakData(imaEvent: any): void {
    if (this.adBreaks) {
      const ad = imaEvent.getAd();
      const duration = ad.getDuration();

      const adBreak = this.adBreaks[ad.getAdPodInfo().getPodIndex()];

      if (adBreak) {
        adBreak.duration = duration;

        this.emit(Events.ADBREAKS, {
          adBreaks: this.adBreaks,
        });
      }
    }
  }
}
