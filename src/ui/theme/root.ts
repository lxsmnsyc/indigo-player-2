import { css } from 'emotion';

export const GUI_STATE_FULLSCREEN = css`
  font-size: 16px;
`;

export const GUI_STATE_MOBILE = css``;
export const GUI_STATE_ACTIVE = css``;

export const GUI_CONTAINER = css`
  color: #fff;
  -webkit-tap-highlight-color: transparent;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 13px;

  * {
    box-sizing: border-box;
  }
`;

export const GUI_PLAYER = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
