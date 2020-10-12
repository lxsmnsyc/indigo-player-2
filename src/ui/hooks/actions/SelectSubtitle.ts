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
import createModel, { createSelector } from 'react-scoped-model';
import { useCallback, useMemo } from 'react';
import { Optional } from '../../types';
import { Subtitle } from '../../../types';
import StateProps from '../StateProps';
import States from '../States';
import SubtitlesExtension from '../../../extensions/SubtitlesExtension/SubtitlesExtension';

interface SelectSubtitle {
  selectSubtitle: (subtitle: Optional<Subtitle>) => void;
}

const useStateProps = createSelector(StateProps, (state) => state.instance);
const useStates = createSelector(States, (state) => state.setLastActiveSubtitle);

const SelectSubtitle = createModel<SelectSubtitle>(() => {
  const instance = useStateProps();
  const setLastActiveSubtitle = useStates();

  const mod = useMemo(() => instance.getModule('SubtitlesExtension'), [instance]);

  const selectSubtitle = useCallback((subtitle) => {
    if (subtitle) {
      setLastActiveSubtitle(subtitle);
    }
    if (mod) {
      (mod as SubtitlesExtension).setSubtitle(
        subtitle ? subtitle.srclang : null,
      ).catch(() => {
        //
      });
    }
  }, [mod, setLastActiveSubtitle]);

  return {
    selectSubtitle,
  };
});

export default SelectSubtitle;
