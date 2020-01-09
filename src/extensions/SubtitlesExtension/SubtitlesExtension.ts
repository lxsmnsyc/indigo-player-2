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
import * as subtitle from 'subtitle';
import Module from '../../module';
import { InstanceInterface, Events } from '../../types';
import STYLETRON from '../../utils/styletron';
import { insertAfter, applyStyle } from '../../utils/dom';

const SUBTITLES = STYLETRON.renderStyle({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '22px',
  textAlign: 'center',
});

const SUBTITLES_SPAN = STYLETRON.renderStyle({
  transition: 'transform 200ms ease-in-out',
  transform: 'translateY(0px)',
  color: '#ffffff',
  textAhadow: '#000000 0px 0px 7px',
  fontFamily: 'Arial, Helvetica, sans-serif',
  maxWidth: '580px',
  fontSize: '17px',
});

interface TrackTimingCache {
  [key: string]: subtitle.subTitleType[];
}

export default class SubtitlesExtension extends Module {
  public name = 'SubtitlesExtension';

  private timingsCache: TrackTimingCache = {};

  private timings?: subtitle.subTitleType[];

  private activeTiming?: subtitle.subTitleType;

  private currentTimeMs = 0;

  private text: HTMLSpanElement;

  constructor(instance: InstanceInterface) {
    super(instance);

    const container = document.createElement('div');
    container.classList.add(SUBTITLES);
    insertAfter(container, this.instance.playerContainer);

    this.text = document.createElement('span');
    this.text.classList.add(SUBTITLES_SPAN);
    container.appendChild(this.text);

    const onTimeUpdate = (data: any): void => {
      this.currentTimeMs = data.currentTime * 1000;

      if (this.timings) {
        this.selectActiveTiming();
      }
    };

    const onDimensionsChange = (data: any): void => {
      const FONT_SIZE_PERCENT = 0.05;
      let fontSize = Math.round(data.height * FONT_SIZE_PERCENT * 100) / 100;

      if (fontSize > 45) {
        fontSize = 45;
      } else if (fontSize < 15) {
        fontSize = 15;
      }

      applyStyle(this.text, {
        fontSize: `${fontSize}px`,
      });
    };

    this.instance.on(Events.PLAYER_STATE_TIMEUPDATE, onTimeUpdate);

    this.instance.on(Events.DIMENSIONS_CHANGE, onDimensionsChange);
  }

  public async setSubtitle(srclang: string): Promise<void> {
    const subs = this.instance.config.subtitles.find((sub) => sub.srclang === srclang);

    this.emit(Events.PLAYER_STATE_SUBTITLECHANGE, {
      subs,
    });

    if (!srclang) {
      this.setActiveTimings();
    } else {
      const subs2 = this.instance.config.subtitles.find(
        (sub) => sub.srclang === srclang,
      );

      if (!subs2) {
        this.setActiveTimings();
        return;
      }

      const timings = await this.parseSubtitleFile(subs2.src);
      this.setActiveTimings(timings);
    }
  }

  public setOffset(offset: number): void {
    applyStyle(this.text, {
      transform: `translateY(-${offset}px)`,
    });
  }

  private selectActiveTiming(): void {
    let activeTiming: subtitle.subTitleType | undefined;

    if (this.timings) {
      const timing = this.timings.find(
        (track) => this.currentTimeMs >= track.start && this.currentTimeMs < track.end,
      );

      if (timing) {
        activeTiming = timing;
      }
    }

    if (activeTiming !== this.activeTiming) {
      this.activeTiming = activeTiming;

      const text = this.activeTiming ? this.activeTiming.text : null;

      this.text.innerHTML = text ?? '';
      this.text.style.display = text ? 'inline-block' : 'none';

      this.emit(Events.PLAYER_STATE_SUBTITLETEXTCHANGE, {
        text,
      });
    }
  }

  private setActiveTimings(timings?: subtitle.subTitleType[]): void {
    this.timings = timings;
    this.selectActiveTiming();
  }

  private async parseSubtitleFile(url: string): Promise<subtitle.subTitleType[]> {
    if (!this.timingsCache[url]) {
      try {
        const content = await fetch(url).then((response) => response.text());
        this.timingsCache[url] = subtitle.parse(content);
      } catch (error) {
        this.timingsCache[url] = [];
      }
    }

    return this.timingsCache[url];
  }
}
