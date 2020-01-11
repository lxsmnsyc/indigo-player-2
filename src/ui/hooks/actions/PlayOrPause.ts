import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import { KeyboardNavigationPurpose } from '../../..';
import TriggerNod from '../with-data/TriggerNod';
import StateProps from '../StateProps';

export interface PlayOrPauseState {
  playOrPause: (origin?: string) => void;
}

const PlayOrPause = createModel<PlayOrPauseState>(() => {
  const [instance, player] = StateProps.useSelectors((state) => [
    state.instance,
    state.player,
  ]);

  const triggerNod = TriggerNod.useSelector((state) => state.triggerNod);

  const playOrPause = React.useCallback((origin) => {
    if (!player.playRequested) {
      instance.play();
      if (origin === 'center') {
        triggerNod(KeyboardNavigationPurpose.PLAY);
      }
    } else {
      instance.pause();
      if (origin === 'center') {
        triggerNod(KeyboardNavigationPurpose.PAUSE);
      }
    }
  }, [player.playRequested, instance, triggerNod]);

  return {
    playOrPause,
  };
});

export default PlayOrPause;
