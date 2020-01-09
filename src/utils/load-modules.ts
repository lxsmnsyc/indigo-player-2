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
import { addModuleLoader } from './module-loader';

/**
 * Contorller
 */
import BaseControllerLoader from '../controllers/base-controller/base-controller-loader';

/**
 * Media
 */
import DashMediaLoader from '../media/DashMedia/DashMediaLoader';
import HlsMediaLoader from '../media/HlsMedia/HlsMediaLoader';
import BaseMediaLoader from '../media/BaseMedia/BaseMediaLoader';

/**
 * Player
 */
import HTML5PlayerLoader from '../player/HTML5Player/HTML5PlayerLoader';

/**
 * Extensions
 */
import PipExtensionLoader from '../extensions/PipExtension/PipExtensionLoader';
import BenchmarkExtensionLoader from '../extensions/BenchmarkExtension/BenchmarkExtensionLoader';
import ContextMenuExtensionLoader from '../extensions/ContextMenuExtension/ContextMenuExtensionLoader';
import DimensionsExtensionLoader from '../extensions/DimensionsExtension/DimensionsExtensionLoader';
import FullscreenExtensionLoader from '../extensions/FullscreenExtension/FullscreenExtensionLoader';
import SubtitlesExtensionLoader from '../extensions/SubtitlesExtension/SubtitlesExtensionLoader';
import FreeWheelExtensionLoader from '../extensions/FreeWheelExtension/FreeWheelExtensionLoader';
import GoogleIMAExtensionLoader from '../extensions/GoogleIMAExtension/GoogleIMAExtensionLoader';
import KeyboardNavigationExtensionLoader from '../extensions/KeyboardNavigationExtension/KeyboardNavigationExtensionLoader';
import StateExtensionLoader from '../extensions/StateExtension/StateExtensionLoader';

export default function loadModules(): void {
  addModuleLoader(BaseControllerLoader);

  addModuleLoader(DashMediaLoader);
  addModuleLoader(HlsMediaLoader);
  addModuleLoader(BaseMediaLoader);

  addModuleLoader(HTML5PlayerLoader);

  addModuleLoader(BenchmarkExtensionLoader);
  addModuleLoader(ContextMenuExtensionLoader);
  addModuleLoader(DimensionsExtensionLoader);
  addModuleLoader(PipExtensionLoader);
  addModuleLoader(FullscreenExtensionLoader);
  addModuleLoader(SubtitlesExtensionLoader);
  addModuleLoader(FreeWheelExtensionLoader);
  addModuleLoader(GoogleIMAExtensionLoader);
  addModuleLoader(KeyboardNavigationExtensionLoader);
  addModuleLoader(StateExtensionLoader);
}
