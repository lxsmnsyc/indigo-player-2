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
import { GUI_SEEKBAR_CUEPOINT, GUI_SEEKBAR_CUEPOINTS } from '../../theme';

interface SeekbarCuePointProps {
  value: number;
}

const SeekbarCuePoint = React.memo(({ value }: SeekbarCuePointProps) => {
  const style = React.useMemo(() => ({
    left: `${value * 100}%`,
  }), [value]);

  return (
    <div
      className={GUI_SEEKBAR_CUEPOINT}
      style={style}
    />
  );
});

const SeekbarCuePoints = React.memo(() => {
  const [
    showCuePoints,
    cuePoints,
  ] = Data.useSelectors((state) => [
    state.adBreakData && !!state.cuePoints.length,
    state.cuePoints,
  ]);

  return (
    <>
      {
        showCuePoints && (
          <div className={GUI_SEEKBAR_CUEPOINTS}>
            {
              cuePoints.map((cue) => (
                <SeekbarCuePoint value={cue} />
              ))
            }
          </div>
        )
      }
    </>
  );
});

export default SeekbarCuePoints;