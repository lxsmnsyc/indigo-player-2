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
import { SliderCallback } from '../../utils/useSlider';
import StateProps from '../StateProps';
import States from '../States';

export interface SeekbarStateState {
  setSeekbarState: SliderCallback;
}

const SeekbarState = createModel<SeekbarStateState>(() => {
  const [instance, player, emitter] = StateProps.useSelectors((state) => [
    state.instance,
    state.player,
    state.emitter,
  ]);

  const [
    setIsSeekbarHover,
    setIsSeekbarSeeking,
    setSeekbarPercentage,
    setActiveThumbnail,
  ] = States.useSelectors((state) => [
    state.setIsSeekbarHover,
    state.setIsSeekbarSeeking,
    state.setSeekbarPercentage,
    state.setActiveThumbnail,
  ]);
  const mod = React.useMemo(() => instance.getModule('ThumbnailsExtension'), [instance]);

  const setSeekbarState = React.useCallback((state, prevState) => {
    let at = null;
    const thumbnailsExtension: any = mod;
    if ((state.hover || state.seeking) && thumbnailsExtension) {
      at = thumbnailsExtension.getThumbnail(
        state.percentage * (player.duration ?? 0),
      );
    }
    setIsSeekbarHover(state.hover);
    setIsSeekbarSeeking(state.seeking);
    setSeekbarPercentage(state.percentage);
    setActiveThumbnail(at);

    if (!state.seeking && prevState.seeking) {
      emitter.emit('show', 'false');
      instance.seekTo((player.duration ?? 0) * state.percentage);
    }
  }, [
    instance,
    setIsSeekbarHover,
    setIsSeekbarSeeking,
    setSeekbarPercentage,
    setActiveThumbnail,
    player.duration,
    emitter,
    mod,
  ]);

  return {
    setSeekbarState,
  };
});

export default SeekbarState;
