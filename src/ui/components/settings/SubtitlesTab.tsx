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
import Data from '../../hooks/Data';
import { SettingsTabs } from '../../types';
import SettingsHeader from './SettingsHeader';
import { SettingsSelect, SettingsSelectItem } from './SettingsSelect';
import States from '../../hooks/States';
import SettingsTab from '../../hooks/actions/SettingsTab';
import SelectSubtitle from '../../hooks/actions/SelectSubtitle';

const SubtitlesTab = React.memo(() => {
  const [
    getTranslation,
    subtitles,
    activeSubtitle,
  ] = Data.useSelectors((state) => [
    state.getTranslation,
    state.subtitles,
    state.activeSubtitle,
  ]);

  const setSettingsTab = States.useSelector((state) => state.setSettingsTab);

  const selectSubtitle = SelectSubtitle.useSelector((state) => state.selectSubtitle);
  const toggleSettings = SettingsTab.useSelector((state) => state.toggleSettings);

  const select = React.useCallback((sub) => {
    selectSubtitle(sub);
    toggleSettings();
  }, [selectSubtitle, toggleSettings]);

  const back = React.useCallback(() => {
    setSettingsTab(SettingsTabs.OPTIONS);
  }, [setSettingsTab]);

  return (
    <>
      <SettingsHeader
        title={getTranslation('Subtitles')}
        onBackClick={back}
      />
      <SettingsSelect>
        <SettingsSelectItem
          selected={activeSubtitle}
          label={getTranslation('No Subtitles')}
          onClick={select}
          item={null}
        />
        {
          ...subtitles.map((sub) => (
            <SettingsSelectItem
              item={sub}
              selected={activeSubtitle}
              label={sub.label}
              onClick={select}
            />
          ))
        }
      </SettingsSelect>
    </>
  );
});

export default SubtitlesTab;
