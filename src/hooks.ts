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
import { HookInterface, ModuleInterface, NextHook } from './types';

interface Hook {
  name: string;
  callback: NextHook;
}

export default class Hooks implements HookInterface {
  private module: ModuleInterface;

  private hooks: Hook[] = [];

  private origFunctions: any = {};

  constructor(module: ModuleInterface) {
    this.module = module;
  }

  public create(name: string, callback: NextHook): void {
    this.hookFunction(name);

    this.hooks.push({
      name,
      callback,
    });
  }

  private hookFunction(name: string): void {
    if (typeof this.module[name] !== 'function') {
      throw new Error(
        `The method "${name}" does not exist in ${
          this.module.constructor.name
        }`,
      );
    }

    if (this.origFunctions[name]) {
      return;
    }

    // Store the original function and apply a hook.
    this.origFunctions[name] = this.module[name];
    this.module[name] = this.hookedFunction(name);
  }

  private hookedFunction(hookName: string): NextHook {
    return (...args: any): void => {
      const selectedHooks = this.hooks.filter(({ name }) => name === hookName);
      let index = -1;

      const runOrigFunction = (): any => this.origFunctions[hookName].call(this.module, ...args);

      const runNextHook = (): void => {
        const hook = selectedHooks[(index += 1)];

        // If we have no hook to call anymore, call the original function.
        if (!hook) {
          runOrigFunction();
          return;
        }

        let proceed = false;
        const next = (): void => {
          proceed = true;
        };

        // We've got a hook to call, call it.
        hook.callback.call(null, next, ...args);

        // Did the hook proceed?
        if (proceed) {
          runNextHook();
        }
      };

      runNextHook();
    };
  }
}
