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
import Button from '../Button';
import ToggleActiveSubtitle from '../../hooks/actions/ToggleActiveSubtitle';
import Data from '../../hooks/Data';
import { GUI_BUTTON_SUBTITLE, ICON_TAG } from '../../theme';

const SubtitlesButton = React.memo(() => {
  const [
    showSubtitlesToggle,
    isSubtitleActive,
    subtitleToggleTooltipText,
  ] = Data.useSelectors((state) => {
    const createTooltipText = (text: string, shortcut?: string): string => `${state.getTranslation(text)} ${
      shortcut ? `(${shortcut})` : ''
    }`.trim();

    return [
      !!state.subtitles.length,
      !!state.activeSubtitle,
      createTooltipText(
        state.activeSubtitle ? 'Disable subtitles' : 'Enable subtitles',
        'c',
      ),
    ];
  });

  const toggleActiveSubtitle = ToggleActiveSubtitle.useSelector(
    (state) => state.toggleActiveSubtitle,
  );

  if (showSubtitlesToggle) {
    return (
      <Button
        className={GUI_BUTTON_SUBTITLE}
        icon={ICON_TAG.CC}
        onClick={toggleActiveSubtitle}
        active={isSubtitleActive}
        tooltip={subtitleToggleTooltipText}
      />
    );
  }

  return null;
});

export default SubtitlesButton;
