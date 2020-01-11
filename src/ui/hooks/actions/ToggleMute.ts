import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import StateProps from '../StateProps';

export interface ToggleMuteState {
  toggleMute: () => void;
}

const ToggleMute = createModel<ToggleMuteState>(() => {
  const [instance, player] = StateProps.useSelectors((state) => [
    state.instance,
    state.player,
  ]);

  const toggleMute = React.useCallback(() => {
    if (player.volume) {
      instance.setVolume(0);
    } else {
      instance.setVolume(1);
    }
  }, [player, instance]);

  return {
    toggleMute,
  };
});

export default ToggleMute;
