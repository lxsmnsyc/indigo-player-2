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
import { injectGlobal } from '@emotion/css';

const CONTEXT_MENU_STYLE = 'igui__contextmenu';

injectGlobal`
  .${CONTEXT_MENU_STYLE} {
    min-width: 150px;
    position: absolute;
    background: rgba(0, 0, 0, .5);
    color: #ffffff;
    border-radius: 2px;
    padding: 4px 0;
    z-index: 12;

    button {
      background: none;
      color: inherit;
      border: none;
      padding: 6px 12px;
      font: 12px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Droid Sans, Helvetica Neue, sans-serif;
      cursor: pointer;
      outline: inherit;
      display: flex;
      align-items: center;
      white-space: pre-wrap;

      &:hover {
        background-color: rgba(255, 255, 255, .07);
      }

      img {
        width: 12px;
        margin-right: 3px;
      }
    }
  }
`;

export default CONTEXT_MENU_STYLE;
