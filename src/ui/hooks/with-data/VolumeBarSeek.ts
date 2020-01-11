import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import { SliderCallback } from '../../utils/useSlider';
import StateProps from '../StateProps';

export interface VolumeBarState {
  isVolumeBarSeeking: boolean;
  setVolumeBarState: SliderCallback;
}

const VolumeBarSeek = createModel(() => {
  const [instance, emitter] = StateProps.useSelectors((state) => [
    state.instance,
    state.emitter,
  ]);

  const [isVolumeBarSeeking, setIsVolumeBarSeeking] = React.useState(false);

  const setVolumeBarState = React.useCallback((state, prevState) => {
    setIsVolumeBarSeeking(state.seeking);

    if (!state.seeking && prevState.seeking) {
      emitter.emit('show', null);
    }

    if (state.seeking) {
      const volume = state.percentage;
      instance.setVolume(volume);
    }
  }, [emitter, instance]);

  return {
    isVolumeBarSeeking,
    setVolumeBarState,
  };
});

export default VolumeBarSeek;
