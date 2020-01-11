import { keyframes } from 'emotion';

export const RESET_BUTTON = `
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`;

export const STRETCH = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const SHADED = `
  position: relative;

  &:after {
    content: '';
    ${STRETCH}
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const ERROR_GLITCH_1 = keyframes`
  0% {
    clip: rect(4px, 170px, 23px, 0);
  }

  5.88235% {
    clip: rect(13px, 170px, 24px, 0);
  }

  11.76471% {
    clip: rect(22px, 170px, 7px, 0);
  }

  17.64706% {
    clip: rect(12px, 170px, 25px, 0);
  }

  23.52941% {
    clip: rect(20px, 170px, 10px, 0);
  }

  29.41176% {
    clip: rect(25px, 170px, 1px, 0);
  }

  35.29412% {
    clip: rect(10px, 170px, 19px, 0);
  }

  41.17647% {
    clip: rect(2px, 170px, 9px, 0);
  }

  47.05882% {
    clip: rect(11px, 170px, 13px, 0);
  }

  52.94118% {
    clip: rect(23px, 170px, 17px, 0);
  }

  58.82353% {
    clip: rect(5px, 170px, 13px, 0);
  }

  64.70588% {
    clip: rect(12px, 170px, 7px, 0);
  }

  70.58824% {
    clip: rect(22px, 170px, 18px, 0);
  }

  76.47059% {
    clip: rect(2px, 170px, 3px, 0);
  }

  82.35294% {
    clip: rect(3px, 170px, 21px, 0);
  }

  88.23529% {
    clip: rect(9px, 170px, 4px, 0);
  }

  94.11765% {
    clip: rect(4px, 170px, 10px, 0);
  }

  100% {
    clip: rect(17px, 170px, 25px, 0);
  }
`;

const ERROR_GLITCH_2 = keyframes`
  0% {
    clip: rect(20px, 170px, 1px, 0);
  }

  5.88235% {
    clip: rect(16px, 170px, 3px, 0);
  }

  11.76471% {
    clip: rect(7px, 170px, 1px, 0);
  }

  17.64706% {
    clip: rect(12px, 170px, 3px, 0);
  }

  23.52941% {
    clip: rect(4px, 170px, 23px, 0);
  }

  29.41176% {
    clip: rect(7px, 170px, 10px, 0);
  }

  35.29412% {
    clip: rect(22px, 170px, 2px, 0);
  }

  41.17647% {
    clip: rect(23px, 170px, 8px, 0);
  }

  47.05882% {
    clip: rect(17px, 170px, 16px, 0);
  }

  52.94118% {
    clip: rect(6px, 170px, 17px, 0);
  }

  58.82353% {
    clip: rect(11px, 170px, 7px, 0);
  }

  64.70588% {
    clip: rect(7px, 170px, 12px, 0);
  }

  70.58824% {
    clip: rect(8px, 170px, 17px, 0);
  }

  76.47059% {
    clip: rect(7px, 170px, 21px, 0);
  }

  82.35294% {
    clip: rect(1px, 170px, 13px, 0);
  }

  88.23529% {
    clip: rect(22px, 170px, 8px, 0);
  }

  94.11765% {
    clip: rect(25px, 170px, 5px, 0);
  }

  100% {
    clip: rect(17px, 170px, 16px, 0);
  }
`;

export const TEXT_GLITCH = (background: string, color1: string, color2: string): string => `
  &:before,
  &:after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: ${background};
    clip: rect(0, 0, 0, 0);
  }

  &:after {
    left: 2px;
    text-shadow: -1px 0 ${color1};
    animation: ${ERROR_GLITCH_1} 2s 3 1.5s linear alternate-reverse;
  }

  &:before {
    left: -2px;
    text-shadow: 2px 0 ${color2};
    animation: ${ERROR_GLITCH_2} 3s 3 1.5s linear alternate-reverse;
  }
`;
