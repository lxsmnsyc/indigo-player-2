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
  AdBreak, Ad, InstanceInterface, Events, NextHook, AdBreakType,
} from '../../types';
import Module from '../../module';

interface FWAdBreak extends AdBreak {
  maxAds: number;
  freewheelSlot?: any;
}

export default class FreeWheelExtension extends Module {
  public name = 'FreeWheelExtension';

  private sdk: any;

  private mediaElement?: HTMLMediaElement;

  private adManager: any;

  private adContext: any;

  private adsRequested = false;

  private adBreaks: FWAdBreak[] = [];

  private currentAdBreak?: FWAdBreak;

  private currentAd?: Ad;

  private adSequenceIndex = 0;

  private adContainer?: HTMLElement;

  // Store the previous current time to omit playing a midroll
  // if the start position !== 0.
  private prevCurrentTime = 0;

  constructor(instance: InstanceInterface) {
    super(instance);

    if (
      !(window as any).tv
      || !(window as any).tv.freewheel
      || !(window as any).tv.freewheel.SDK
    ) {
      return;
    }

    this.sdk = (window as any).tv.freewheel.SDK;
    this.sdk.setLogLevel(this.sdk.LOG_LEVEL_QUIET);

    this.on(
      Events.INSTANCE_INITIALIZED,
      this.onInstanceInitialized.bind(this),
    );
    this.on(Events.PLAYER_STATE_TIMEUPDATE, this.onPlayerTimeUpdate.bind(this));
    this.on(Events.PLAYER_STATE_ENDED, this.onPlayerEnded.bind(this));

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

  public onControllerPlay(next: NextHook): void {
    if (!this.adsRequested) {
      this.emit(Events.ADBREAK_STATE_PLAY, null);
      this.adContext.submitRequest();
      return;
    }

    if (this.currentAdBreak) {
      this.emit(Events.ADBREAK_STATE_PLAY, null);
      if (this.mediaElement) {
        this.mediaElement.play().catch(() => {
          // fall through
        });
      }
      return;
    }

    next();
  }

  public onControllerPause(next: NextHook): void {
    if (this.currentAdBreak) {
      this.emit(Events.ADBREAK_STATE_PAUSE, null);
      if (this.mediaElement) {
        this.mediaElement.pause();
      }
      return;
    }

    next();
  }

  public onControllerSetVolume(next: NextHook, volume: number): void {
    if (this.mediaElement) {
      this.mediaElement.volume = volume;
      this.mediaElement.muted = volume === 0;
    }
    next();
  }

  public onControllerSeekTo(next: NextHook): void {
    if (this.currentAdBreak) {
      return;
    }

    next();
  }

  public createMediaElement(): void {
    this.mediaElement = document.createElement('video');
    this.mediaElement.style.width = '100%';
    this.mediaElement.style.height = '100%';

    this.mediaElement.addEventListener('playing', () => {
      this.emit(Events.ADBREAK_STATE_PLAYING, null);
    });

    this.mediaElement.addEventListener('timeupdate', () => {
      if (this.currentAdBreak) {
        this.emit(Events.ADBREAK_STATE_TIMEUPDATE, {
          currentTime: this.currentAdBreak.freewheelSlot.getPlayheadTime(),
        });
      }
    });

    this.mediaElement.addEventListener('waiting', () => {
      this.emit(Events.ADBREAK_STATE_BUFFERING, null);
    });

    if (this.adContainer) {
      this.adContainer.appendChild(this.mediaElement);
    }
  }

  private onInstanceInitialized(): void {
    this.adContainer = document.createElement('div');
    this.adContainer.style.position = 'absolute';
    this.adContainer.style.left = '0px';
    this.adContainer.style.right = '0px';
    this.adContainer.style.top = '0px';
    this.adContainer.style.bottom = '0px';
    this.adContainer.style.display = 'none';
    this.adContainer.id = 'fwAdsContainer';
    this.instance.adsContainer.appendChild(this.adContainer);

    // Create ads specific media element.
    this.createMediaElement();

    const { AdManager }: { AdManager: any } = this.sdk;
    this.adManager = new AdManager();
    this.adContext = this.adManager.newContext();

    this.adContext.addEventListener(
      this.sdk.EVENT_REQUEST_COMPLETE,
      this.onAdRequestComplete.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_SLOT_STARTED,
      this.onSlotStarted.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_SLOT_ENDED,
      this.onSlotEnded.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_AD_IMPRESSION,
      this.onAdImpression.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_AD_IMPRESSION_END,
      this.onAdImpressionEnd.bind(this),
    );

    const { freewheel } = this.instance.config;

    if (freewheel) {
      this.adManager.setNetwork(freewheel.network);
      this.adManager.setServer(freewheel.server);
      this.adContext.setVideoAsset(
        freewheel.videoAsset,
        freewheel.duration,
        freewheel.network,
      );
      this.adContext.setSiteSection(freewheel.siteSection);
      this.adContext.setProfile(freewheel.profile);

      freewheel.cuepoints.forEach((cuepoint) => {
        if (cuepoint === AdBreakType.PREROLL) {
          this.adContext.addTemporalSlot('preroll', this.sdk.ADUNIT_PREROLL, 0);
        } else if (cuepoint === AdBreakType.POSTROLL) {
          this.adContext.addTemporalSlot(
            'postroll',
            this.sdk.ADUNIT_POSTROLL,
            freewheel.duration,
          );
        } else {
          const time = cuepoint;
          this.adContext.addTemporalSlot(
            `midroll-${time}`,
            this.sdk.ADUNIT_MIDROLL,
            time,
          );
        }
      });
    }

    this.adContext.registerVideoDisplayBase(this.adContainer.id);
  }

  public onAdRequestComplete(event: any): void {
    this.adsRequested = true;

    if (event.success) {
      const slots = this.adContext.getTemporalSlots();
      this.adBreaks = slots.map(
        (slot: any, index: any) => ({
          sequenceIndex: index,
          id: slot.getCustomId(),
          type: slot.getAdUnit(),
          startsAt: slot.getTimePosition(),
          duration: slot.getTotalDuration(),
          hasBeenWatched: false,
          maxAds: slot.getAdCount(),
          freewheelSlot: slot,
        }),
      );
    }

    this.emit(Events.ADBREAKS, {
      adBreaks: this.adBreaks,
    });

    const preroll: FWAdBreak | undefined = this.adBreaks.find(
      ({ type }) => AdBreakType.PREROLL === type,
    );

    if (preroll && !this.shouldSkipPreroll()) {
      this.playAdBreak(preroll);
    } else if (this.instance.media) {
      this.instance.media.play();
    }
  }

  public adClick(): void {
    if (!this.currentAd) {
      return;
    }

    this.currentAd.freewheelAdInstance
      .getRendererController()
      .processEvent({ name: this.sdk.EVENT_AD_CLICK });
  }

  private onSlotStarted(event: any): void {
    const { slot } = event;

    const adBreak = this.slotToAdBreak(slot);
    this.currentAdBreak = adBreak;

    this.emit(Events.ADBREAK_STARTED, {
      adBreak,
    });

    if (this.instance.media) {
      this.instance.media.pause();
    }
  }

  private onSlotEnded(event: any): void {
    const { slot } = event;

    const adBreak = this.slotToAdBreak(slot);

    if (adBreak) {
      adBreak.hasBeenWatched = true;

      this.currentAdBreak = undefined;

      this.emit(Events.ADBREAK_ENDED, {
        adBreak,
      });

      if (adBreak.type !== AdBreakType.POSTROLL) {
        if (this.instance.media) {
          this.instance.media.play();
        }
      }

      if (this.adContainer) {
        this.adContainer.style.display = 'none';
      }
    }
  }

  private onAdImpression(event: any): void {
    this.adSequenceIndex = 0;

    this.currentAd = {
      sequenceIndex: this.adSequenceIndex,
      freewheelAdInstance: event.adInstance,
    };

    this.emit(Events.AD_STARTED, {
      adBreak: this.currentAdBreak,
      ad: this.currentAd,
    });
  }

  private onAdImpressionEnd(): void {
    const ad = this.currentAd;

    this.currentAd = undefined;

    this.emit(Events.AD_ENDED, {
      adBreak: this.currentAdBreak,
      ad,
    });

    this.adSequenceIndex += 1;
  }

  private onPlayerTimeUpdate({ currentTime }: any): void {
    const midroll: FWAdBreak | undefined = this.adBreaks.find(
      (adBreak) => adBreak.type === AdBreakType.MIDROLL
        && adBreak.startsAt <= currentTime
        && adBreak.startsAt > this.prevCurrentTime
        && !adBreak.hasBeenWatched,
    );

    if (midroll) {
      this.playAdBreak(midroll);
    }

    this.prevCurrentTime = currentTime;
  }

  private onPlayerEnded(): void {
    const postroll: FWAdBreak | undefined = this.adBreaks.find(
      (adBreak) => adBreak.type === AdBreakType.POSTROLL && !adBreak.hasBeenWatched,
    );

    if (postroll) {
      this.playAdBreak(postroll);
    }
  }

  private slotToAdBreak(slot: any): FWAdBreak | undefined {
    const slotId = slot.getCustomId();
    return this.adBreaks.find(({ id }) => id === slotId);
  }

  private playAdBreak(adBreak: FWAdBreak): void {
    try {
      adBreak.freewheelSlot.play();
    } catch (error) {
      if (this.instance.media) {
        this.instance.media.play();
      }
    }

    if (this.adContainer) {
      this.adContainer.style.display = 'block';
    }
  }

  private shouldSkipPreroll(): boolean {
    return (this.instance.config.startPosition ?? 0) > 0;
  }
}
