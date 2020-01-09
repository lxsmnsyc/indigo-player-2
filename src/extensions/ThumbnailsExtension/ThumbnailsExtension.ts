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
import parse from 'url-parse';
import Module from '../../module';
import { Thumbnail, InstanceInterface } from '../../types';
import BIFParser from './BIFParser';
import vttToJson from '../../utils/vtt-to-json';

export default class ThumbnailsExtension extends Module {
  public name = 'ThumbnailsExtension';

  private thumbnails: Thumbnail[] = [];

  private extension = '';

  private bifParser?: BIFParser;

  constructor(instance: InstanceInterface) {
    super(instance);

    this.load();
  }

  private async loadVttThumbs(file: string): Promise<void> {
    const response = await fetch(file);
    const data = await response.text();

    const json = await vttToJson(data);

    this.thumbnails = json
      .map((item) => {
        const url = parse(item.part);
        const parts = parse(url.hash.replace('#', '?'), true);
        const [x, y, width, height] = (parts.query as any).xywh.split(',').map(Number);

        url.set('hash', undefined);
        const src = url.toString();

        return {
          start: Math.trunc(item.start / 1000),
          src,
          x,
          y,
          width,
          height,
        };
      })
      .sort((a, b) => b.start - a.start);
  }

  private async loadBifThumbs(file: string): Promise<void> {
    const response = await fetch(file);
    const data = await response.arrayBuffer();

    // Since we already have functionality to grab the bif image that we
    // need at a given second, we are only prepping the parser class and
    // do not need to create an array of thumbs
    this.bifParser = new BIFParser(data);
  }

  public async load(): Promise<void> {
    const file = this.instance.config.thumbnails?.src;

    if (file) {
      // Get the file extension for conditional processing
      this.extension = file.split('.').pop() ?? '';

      if (this.extension === 'vtt') {
        await this.loadVttThumbs(file);
      } else if (this.extension === 'bif') {
        await this.loadBifThumbs(file);
      }
    }
  }

  public getThumbnail(seconds: number): Thumbnail | null | undefined {
    if (this.extension === 'vtt') {
      return this.thumbnails.find((thumbnail) => thumbnail.start <= seconds);
    }
    if (this.extension === 'bif' && this.bifParser) {
      return this.bifParser.getImageDataAtSecond(seconds);
    }
    return null;
  }
}
