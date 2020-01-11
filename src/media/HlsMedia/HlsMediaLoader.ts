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
import { isSupported } from 'hls.js';
import {
  ModuleLoaderInterface, ModuleLoaderTypes, InstanceInterface, Format, FormatTypes,
} from '../../types';
import HlsMedia from './HlsMedia';

const HlsMediaLoader: ModuleLoaderInterface<HlsMedia> = {
  type: ModuleLoaderTypes.MEDIA,

  create: async (instance: InstanceInterface) => {
    const { default: HlsMediaClass } = await import('./HlsMedia');

    return new HlsMediaClass(instance);
  },

  isSupported: (instance: InstanceInterface, format: Format): boolean => {
    if (instance.player?.name !== 'HTML5Player') {
      return false;
    }

    if (format.type !== FormatTypes.HLS) {
      return false;
    }

    if (instance.env?.isSafari || instance.env?.isIOS) {
      return false;
    }

    if (!isSupported()) {
      return false;
    }

    return true;
  },
};

export default HlsMediaLoader;
