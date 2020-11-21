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

import * as React from 'react';
import { createSelectors } from 'react-scoped-model';
import { cx } from '@emotion/css';
import { ViewTypes } from '../types';
import StartView from './StartView';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
import {
  GUI_STATE_ACTIVE, GUI_MAIN, GUI_STATE_MOBILE, GUI_STATE_FULLSCREEN, GUI_STATE_PIP,
} from '../theme';
import ControlsView from './ControlsView';
import Data from '../hooks/Data';
import tuple from '../utils/tuple';

const useData = createSelectors(Data, (state) => tuple(
  state.visibleControls,
  state.isMobile,
  state.pip,
  state.isFullscreen,
  state.view,
));

const Main = React.memo(() => {
  const [
    visibleControls,
    isMobile,
    pip,
    isFullscreen,
    view,
  ] = useData();

  const className = cx(GUI_MAIN, {
    [GUI_STATE_ACTIVE]: visibleControls,
    [GUI_STATE_MOBILE]: isMobile,
    [GUI_STATE_PIP]: pip,
    [GUI_STATE_FULLSCREEN]: isFullscreen,
  });

  return (
    <div
      className={className}
    >
      {view === ViewTypes.ERROR && <ErrorView />}
      {view === ViewTypes.LOADING && <LoadingView />}
      {view === ViewTypes.START && <StartView />}
      {view === ViewTypes.CONTROLS && <ControlsView />}
    </div>
  );
});

export default Main;
