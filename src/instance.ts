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
  InstanceInterface,
  Config,
  EnvInterface,
  ControllerInterface,
  PlayerInterface,
  MediaInterface,
  Format,
  ModuleInterface,
  Events,
  ErrorCodes,
  PlayerErrorInterface,
  TrackInterface,
} from './types';
import EventEmitter, { EventCallback } from './utils/event-emitter';
import createConfig from './utils/create-config';
import getEnv from './utils/get-env';
import { selectController, selectExtensions } from './utils/select-module';
import PlayerError from './utils/player-error';
import {
  GUI_CONTAINER, GUI, GUI_PLAYER, GUI_ADS,
} from './ui/theme/root';

export default class Instance implements InstanceInterface {
  public config: Config;

  public container: HTMLElement;

  public playerContainer: HTMLElement;

  public adsContainer: HTMLElement;

  public uiContainer: HTMLElement;

  public env?: EnvInterface;

  public controller?: ControllerInterface;

  public player?: PlayerInterface;

  public media?: MediaInterface;

  public format?: Format;

  public extensions: ModuleInterface[] = [];

  private emitter: EventEmitter;

  constructor(element: HTMLElement | string, config: Config) {
    const el = typeof element === 'string'
      ? document.getElementById(element)
      : element;

    if (!el) {
      throw new Error('Invalid element passed.');
    }

    this.config = createConfig(config);

    this.container = document.createElement('div');
    this.container.classList.add(GUI_CONTAINER);
    this.container.style.paddingTop = `${100 / (config.aspectRatio ?? (16 / 9))}%`;

    this.playerContainer = document.createElement('div');
    this.playerContainer.classList.add(GUI_PLAYER);
    this.container.appendChild(this.playerContainer);

    this.adsContainer = document.createElement('div');
    this.adsContainer.classList.add(GUI_ADS);
    this.container.appendChild(this.adsContainer);

    this.uiContainer = document.createElement('div');
    this.uiContainer.classList.add(GUI);
    this.container.appendChild(this.uiContainer);

    el.appendChild(this.container);

    this.emitter = new EventEmitter();

    this.init(this.config);
  }

  public on(name: string, callback: EventCallback): void {
    this.emitter.on(name, callback);
  }

  public off(name: string, callback: EventCallback): void {
    this.emitter.off(name, callback);
  }

  public emit<T>(name: string, data: T): void {
    this.emitter.emit<T>(name, data);
  }

  public clear(): void {
    this.emitter.clear();
  }

  public play(): void {
    if (this.controller) {
      this.controller.play();
    }
  }

  public pause(): void {
    if (this.controller) {
      this.controller.pause();
    }
  }

  public seekTo(time: number): void {
    if (this.controller) {
      this.controller.seekTo(time);
    }
  }

  public setVolume(volume: number): void {
    if (this.controller) {
      this.controller.setVolume(volume);
    }
  }

  public selectTrack(track: TrackInterface): void {
    if (this.controller) {
      this.controller.selectTrack(track);
    }
  }

  public selectAudioLanguage(language: string): void {
    if (this.controller) {
      this.controller.selectAudioLanguage(language);
    }
  }

  public setPlaybackRate(playbackRate: number): void {
    if (this.controller) {
      this.controller.setPlaybackRate(playbackRate);
    }
  }

  public setError(error: PlayerErrorInterface): void {
    if (this.controller) {
      this.controller.unload();
    }
    this.emit(Events.ERROR, {
      error,
    });
  }

  public canAutoplay(): boolean {
    return this.config.autoplay && (this.env?.canAutoplay ?? false);
  }

  public destroy(): void {
    this.emit(Events.DESTROY, null);

    this.emitter.clear();

    if (this.controller) {
      this.controller.unload();
    }

    const div: HTMLElement = this.container;
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    this.container.remove();
  }

  public getStats(): any {
    return {
      config: this.config,
      controller: [this.controller?.name, this.controller],
      media: [this.media?.name, this.media],
      player: [this.player?.name, this.player],
      extensions: this.extensions.map((extension) => [extension.name, extension]),
    };
  }

  public getModule(moduleName: string): ModuleInterface | undefined {
    const modules = [
      ...this.extensions,
      this.controller,
      this.media,
      this.player,
    ];

    return modules.find((mod) => mod && moduleName === mod.name);
  }

  private async init(config: Config): Promise<void> {
    this.emit(Events.INSTANCE_INITIALIZE, null);

    this.env = await getEnv(config);
    this.controller = await selectController(this);
    this.extensions = await selectExtensions(this);

    try {
      await this.controller?.load();
    } catch (error) {
      if (error instanceof PlayerError) {
        this.setError(error);
      } else {
        this.setError(
          new PlayerError(ErrorCodes.CONTROLLER_LOAD_FAILED, error),
        );
      }
      return;
    }

    this.emit(Events.INSTANCE_INITIALIZED, null);

    // Set initial config values.
    if (config.volume) {
      this.setVolume(config.volume);
    }

    if (config.startPosition) {
      this.seekTo(config.startPosition);
    }

    // Now that we know we can autoplay, actually do it.
    if (this.canAutoplay()) {
      this.play();
    }

    setTimeout(() => this.emit(Events.READY, null));
  }
}
