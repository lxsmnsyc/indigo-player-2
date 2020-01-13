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
import Button from '../Button';
import { GUI_SETTINGS_SELECT_OPTION_INFO, GUI_SETTINGS_SELECT, GUI_BUTTON_SELECT_OPTION } from '../../theme';

interface SettingsSelectItemProps {
  selected?: any;
  item: any;
  label: string;
  info?: string;
  onClick: (item: any) => void;
}

export const SettingsSelectItem = React.memo((
  {
    item, onClick, selected, label, info,
  }: SettingsSelectItemProps,
) => {
  const click = React.useCallback(() => {
    onClick(item);
  }, [onClick, item]);

  return (
    <Button
      key={label}
      className={GUI_BUTTON_SELECT_OPTION}
      onClick={click}
      active={item === selected}
    >
      <>
        {label}
        {info && (
          <span className={GUI_SETTINGS_SELECT_OPTION_INFO}>
            {info}
          </span>
        )}
      </>
    </Button>
  );
});

interface SettingsSelectProps {
  children?: React.ReactNode;
}

export const SettingsSelect = React.memo(({ children }: SettingsSelectProps) => (
  <div className={GUI_SETTINGS_SELECT}>
    { children }
  </div>
));
