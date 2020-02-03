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
import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import StateProps from '../StateProps';
import useOnUnmount from '../useOnUnmount';
import useConstantCallback from '../useConstantCallback';
import useIsomorphicEffect from '../useIsomorphicEffect';
import States from '../States';

interface VisibleControlsState {
  showControls: () => void;
  hideControls: () => void;
}

const VisibleControls = createModel<VisibleControlsState>(() => {
  const activeTimer = React.useRef<number | null>(null);

  const emitter = StateProps.useSelector((state) => state.emitter);

  const setVisibleControls = States.useSelector((state) => state.setVisibleControls);

  const showControls = useConstantCallback((): void => {
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }

    setVisibleControls(true);

    activeTimer.current = window.setTimeout(() => {
      setVisibleControls(false);
      activeTimer.current = null;
    }, 2000);
  });

  const hideControls = useConstantCallback((): void => {
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }

    setVisibleControls(false);
  });

  useIsomorphicEffect(() => {
    emitter.on('show', showControls);

    return (): void => emitter.off('show', showControls);
  }, [emitter, showControls]);

  useOnUnmount(() => {
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }
  });

  return {
    showControls,
    hideControls,
  };
});

export default VisibleControls;
