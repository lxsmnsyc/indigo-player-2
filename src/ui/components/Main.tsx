
import * as React from 'react';
import { cx } from 'emotion';
import { StateContext } from '../State';
import { ViewTypes } from '../types';
import StartView from './StartView';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
import {
  GUI_STATE_ACTIVE, GUI_MAIN, GUI_STATE_MOBILE, GUI_STATE_FULLSCREEN, GUI_STATE_PIP,
} from '../theme';
import { ControlsView } from './ControlsView';

const Main = React.memo(() => {
  const info = React.useContext(StateContext);

  if (!info) {
    return null;
  }

  const {
    data: {
      visibleControls, isMobile, pip, isFullscreen, view,
    },
  } = info;

  return (
    <div
      className={cx(GUI_MAIN, {
        [GUI_STATE_ACTIVE]: visibleControls,
        [GUI_STATE_MOBILE]: isMobile,
        [GUI_STATE_PIP]: pip,
        [GUI_STATE_FULLSCREEN]: isFullscreen,
      })}
    >
      {view === ViewTypes.ERROR && <ErrorView />}
      {view === ViewTypes.LOADING && <LoadingView />}
      {view === ViewTypes.START && <StartView />}
      {view === ViewTypes.CONTROLS && <ControlsView />}
    </div>
  );
});

export default Main;
