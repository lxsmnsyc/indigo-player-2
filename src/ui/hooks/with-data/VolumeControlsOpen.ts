import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import StateProps from '../StateProps';

export interface VolumeControlsOpenState {
  isVolumeControlsOpen: boolean;
  setVolumeControlsOpen: (open: boolean) => void;
}

const VolumeControlsOpen = createModel<VolumeControlsOpenState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const [isVolumeControlsOpen, setIsVolumeControlsOpen] = React.useState(false);

  const setVolumeControlsOpen = React.useCallback((open) => {
    if (!instance.env?.isMobile) {
      setIsVolumeControlsOpen(open);
    }
  }, [instance]);

  return {
    isVolumeControlsOpen,
    setVolumeControlsOpen,
  };
});

export default VolumeControlsOpen;
