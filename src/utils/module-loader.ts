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
  ModuleLoaderInterface, ModuleInterface, InstanceInterface, ModuleLoaderTypes,
} from '../types';


const modules: ModuleLoaderInterface<ModuleInterface>[] = [];

export async function createFirstSupported<T>(
  type: ModuleLoaderTypes,
  instance: InstanceInterface,
  isSupportedArgs?: any,
): Promise<T | undefined> {
  const items = modules.filter((item) => item.type === type);

  const loaded = await Promise.all(items.map(async (loader) => {
    if (await loader.isSupported(instance, isSupportedArgs)) {
      return (((await loader.create(instance)) as unknown) as T);
    }
    return undefined;
  }));

  return loaded.find((value) => value);
}

export async function createAllSupported<T>(
  type: ModuleLoaderTypes,
  instance: InstanceInterface,
  isSupportedArgs?: any,
): Promise<T[]> {
  const items = modules.filter((item) => item.type === type);

  const instances: T[] = [];

  await Promise.all(items.map(async (loader) => {
    if (await loader.isSupported(instance, isSupportedArgs)) {
      instances.push(((await loader.create(instance)) as unknown) as T);
    }
  }));

  return instances;
}

export function addModuleLoader(mod: ModuleLoaderInterface<ModuleInterface>): void {
  modules.push(mod);
}
