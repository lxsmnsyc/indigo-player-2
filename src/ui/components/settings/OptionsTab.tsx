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
import Data from '../../hooks/Data';
import { SettingsSelect, SettingsSelectItem } from './SettingsSelect';
import States from '../../hooks/States';
import { SettingsTabs } from '../../types';
import { GUI_SETTINGS_NOOP } from '../../theme';


const OptionsTab = React.memo(() => {
  const [
    visibleSettingsTabs,
    getTranslation,
    activeTrack,
    activeSubtitle,
    playbackRate,
  ] = Data.useSelectors((state) => [
    state.visibleSettingsTabs,
    state.getTranslation,
    state.activeTrack,
    state.activeSubtitle,
    state.playbackRate,
  ]);

  const setSettingsTab = States.useSelector((state) => state.setSettingsTab);

  if (visibleSettingsTabs.length > 0) {
    return (
      <SettingsSelect>
        {
          visibleSettingsTabs.includes(SettingsTabs.TRACKS) && (
          <SettingsSelectItem
            item={SettingsTabs.TRACKS}
            label={getTranslation('Quality')}
            info={`${activeTrack ? activeTrack.width : ''}`}
            onClick={setSettingsTab}
          />
          )
        }
        {
          visibleSettingsTabs.includes(SettingsTabs.SUBTITLES) && (
          <SettingsSelectItem
            item={SettingsTabs.SUBTITLES}
            label={getTranslation('Subtitles')}
            info={activeSubtitle ? activeSubtitle.label : ''}
            onClick={setSettingsTab}
          />
          )
        }
        {
          visibleSettingsTabs.includes(SettingsTabs.PLAYBACKRATES) && (
          <SettingsSelectItem
            item={SettingsTabs.PLAYBACKRATES}
            label={getTranslation('Speed')}
            info={`${playbackRate}`}
            onClick={setSettingsTab}
          />
          )
        }
      </SettingsSelect>
    );
  }

  return (
    <div className={GUI_SETTINGS_NOOP}>No settings available</div>
  );
});

export default OptionsTab;
