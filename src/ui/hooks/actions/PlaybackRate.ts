import createModel from '@lxsmnsyc/react-scoped-model';
import { useCallback } from 'react';
import StateProps from '../StateProps';

export interface SetPlaybackRateState {
  setPlaybackRate: (playbackRate: number) => void;
}

const PlaybackRate = createModel<SetPlaybackRateState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const setPlaybackRate = useCallback((playbackRate: number) => {
    instance.setPlaybackRate(playbackRate);
  }, [instance]);

  return {
    setPlaybackRate,
  };
});

export default PlaybackRate;
