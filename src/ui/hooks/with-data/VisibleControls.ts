import createModel from '@lxsmnsyc/react-scoped-model';

interface VisibleControlsState {
  visibleControls: boolean;
}

const VisibleControls = createModel<VisibleControlsState>(() => {
  const [visibleControls, setVisibleControls] = React.useState(false);

  const isSeekbarSeeking = Seekbar

  // Do we need to show the controls?
  let { visibleControls } = this.state;
  if (
    isSeekbarSeeking
    || isVolumebarSeeking
    || !!settingsTab
    || instance.config.ui.lockControlsVisibility
  ) {
    // If we're seeking, either by video position or volume, keep the controls visible.
    visibleControls = true;
  }

  return {
    visibleControls: 
  };
});