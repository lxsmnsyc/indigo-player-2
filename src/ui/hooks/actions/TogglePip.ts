import createModel from '@lxsmnsyc/react-scoped-model';
import { useCallback } from 'react';
import PipExtension from '../../../extensions/PipExtension/PipExtension';
import StateProps from '../StateProps';

export interface TogglePipState {
  togglePip: () => void;
}

const TogglePip = createModel<TogglePipState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const togglePip = useCallback(() => {
    (instance.getModule('PipExtension') as PipExtension).togglePip();
  }, [instance]);

  return {
    togglePip,
  };
});

export default TogglePip;
