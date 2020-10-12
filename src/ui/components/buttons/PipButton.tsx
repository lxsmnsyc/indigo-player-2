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
import React from 'react';
import { createSelector, createSelectors } from 'react-scoped-model';
import Button from '../Button';
import Data from '../../hooks/Data';
import TogglePip from '../../hooks/actions/TogglePip';
import { ICON_TAG, GUI_BUTTON_PIP } from '../../theme';
import tuple from '../../utils/tuple';

const useData = createSelectors(Data, (state) => {
  const createTooltipText = (text: string, shortcut?: string): string => `${state.getTranslation(text)} ${
    shortcut ? `(${shortcut})` : ''
  }`.trim();

  return tuple(
    state.pipSupported && !state.pip,
    createTooltipText('Miniplayer', 'i'),
  );
});

const useTogglePip = createSelector(TogglePip, (state) => state.togglePip);

const PipButton = React.memo(() => {
  const [
    showPip,
    pipTooltipText,
  ] = useData();

  const togglePip = useTogglePip();

  if (showPip) {
    return (
      <Button
        className={GUI_BUTTON_PIP}
        icon={ICON_TAG.PIP}
        onClick={togglePip}
        tooltip={pipTooltipText}
      />
    );
  }

  return null;
});

export default PipButton;
