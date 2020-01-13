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
import React, { useState, useCallback } from 'react';
import { cx } from 'emotion';
import useConstantCallback from '../hooks/useConstantCallback';
import {
  GUI_BUTTON, GUI_BUTTON_STATE_DISABLED, GUI_BUTTON_STATE_ACTIVE, GUI_BUTTON_TOOLTIP,
} from '../theme/button';
import Icon from './Icon';

interface ButtonProps {
  icon?: string;
  className?: string;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
  children?: React.ReactNode;
  onClick: () => void;
}

export default function Button(
  {
    children, onClick, icon, tooltip, disabled, active, className,
  }: ButtonProps,
): JSX.Element {
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const onMouseEnter = React.useCallback(() => {
    if (!isTouch) {
      setHover(true);
    }
  }, [isTouch]);

  const onLeave = useConstantCallback(() => setHover(false));
  const onTouchStart = useConstantCallback(() => {
    setIsTouch(true);
    setHover(true);
  });
  const click = useCallback(() => {
    setIsTouch(false);
    onClick();
  }, [onClick]);

  return (
    <button
      type="button"
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onLeave}
      onTouchCancel={onLeave}
      onClick={click}
      className={cx(GUI_BUTTON, {
        [className ?? '']: !!className,
        [GUI_BUTTON_STATE_DISABLED]: disabled,
        [GUI_BUTTON_STATE_ACTIVE]: active,
      })}
    >
      <>
        { children }
      </>
      <>
        {icon && <Icon value={icon} />}
      </>
      <>
        {hover && tooltip && (
          <span className={GUI_BUTTON_TOOLTIP}>{ tooltip }</span>
        )}
      </>
    </button>
  );
}
