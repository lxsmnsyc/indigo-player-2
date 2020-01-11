import createModel from '@lxsmnsyc/react-scoped-model';
import React, { useCallback } from 'react';
import { Optional } from '../../types';
import { Subtitle } from '../../..';
import StateProps from '../StateProps';


interface SelectSubtitle {
  lastActiveSubtitle: Optional<Subtitle>;
  selectSubtitle: (subtitle: Optional<Subtitle>) => void;
}

const SelectSubtitle = createModel<SelectSubtitle>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const [lastActiveSubtitle, setLastActiveSubtitle] = React.useState<Optional<Subtitle>>();

  const selectSubtitle = useCallback((subtitle) => {
    if (subtitle) {
      setLastActiveSubtitle(subtitle);
    }

    (instance.getModule('SubtitlesExtension')).setSubtitle(
      subtitle ? subtitle.srclang : null,
    );
  }, [instance]);

  return {
    lastActiveSubtitle,
    selectSubtitle,
  };
});

export default SelectSubtitle;
