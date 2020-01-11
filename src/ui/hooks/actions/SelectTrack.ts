import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import { TrackInterface } from '../../..';
import StateProps from '../StateProps';


interface SelectTrackState {
  selectTrack: (track: TrackInterface) => void;
}

const SelectTrack = createModel<SelectTrackState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const selectTrack = React.useCallback((track) => {
    instance.selectTrack(track);
  }, [instance]);

  return {
    selectTrack,
  };
});

export default SelectTrack;
