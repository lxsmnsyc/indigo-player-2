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
  Format,
  MediaInterface,
  ControllerInterface,
  ModuleInterface,
  PlayerInterface,
  ModuleLoaderTypes,
} from '../types';
import { createAllSupported, createFirstSupported } from './module-loader';

type MediaTuple = [Format | undefined, MediaInterface | undefined];

export async function selectMedia(
  instance: InstanceInterface,
): Promise<MediaTuple> {
  const { sources } = instance.config;

  const medias: MediaTuple[] = await Promise.all(sources.map(async (format) => {
    const media = await createFirstSupported<MediaInterface>(
      ModuleLoaderTypes.MEDIA,
      instance,
      format,
    );

    return [format, media] as MediaTuple;
  }));

  return medias.find((media) => !!media) ?? [undefined, undefined];
}

export async function selectPlayer(
  instance: InstanceInterface,
): Promise<PlayerInterface | undefined> {
  return createFirstSupported<PlayerInterface>(ModuleLoaderTypes.PLAYER, instance);
}

export async function selectExtensions(
  instance: InstanceInterface,
): Promise<ModuleInterface[]> {
  return createAllSupported<ModuleInterface>(ModuleLoaderTypes.EXTENSION, instance);
}

export async function selectController(
  instance: InstanceInterface,
): Promise<ControllerInterface | undefined> {
  return createFirstSupported<ControllerInterface>(
    ModuleLoaderTypes.CONTROLLER,
    instance,
  );
}
