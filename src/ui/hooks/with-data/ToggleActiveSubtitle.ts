import createModel from '@lxsmnsyc/react-scoped-model';
import React from 'react';
import SelectSubtitle from './SelectSubtitle';
import { StateStoreProps } from '../types';

export interface ToggleActiveSubtitleState {
  toggleActiveSubtitle: () => void;
}

const ToggleActiveSubtitle = createModel<ToggleActiveSubtitleState, StateStoreProps>((
  { instance, player },
) => {
  const [lastActiveSubtitle, selectSubtitle] = SelectSubtitle.useSelectors((state) => [
    state.lastActiveSubtitle,
    state.selectSubtitle,
  ]);

  const toggleActiveSubtitle = React.useCallback(() => {
    let last = lastActiveSubtitle;
    if (!last) {
      [last] = instance.config.subtitles;
    }

    if (!player.subtitle) {
      selectSubtitle(last);
    }
  }, [instance.config.subtitles, lastActiveSubtitle, player.subtitle, selectSubtitle]);

  return {
    toggleActiveSubtitle,
  };
});

export default ToggleActiveSubtitle;
