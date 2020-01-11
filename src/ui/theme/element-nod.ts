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
import { keyframes, css } from 'emotion';

const NOD_ZOOMIN = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }

  70% { opacity: 1; }

  100% {
    opacity: 0;
    transform: scale(1.5);
  }
`;

export const GUI_NOD_ACTIVE = css``;

export const GUI_NOD = css`
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 24px;
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  animation-duration: 500ms;
  opacity: 0;

  &.${GUI_NOD_ACTIVE} {
    animation-name: ${NOD_ZOOMIN};
  }
`;
