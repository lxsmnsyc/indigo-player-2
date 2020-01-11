import createModel from '@lxsmnsyc/react-scoped-model';
import { useCallback } from 'react';
import FullscreenExtension from '../../../extensions/FullscreenExtension/FullscreenExtension';
import StateProps from '../StateProps';

export interface ToggleFullscreenState {
  toggleFullscreen: () => void;
}

const ToggleFullscreen = createModel<ToggleFullscreenState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const toggleFullscreen = useCallback(() => {
    (instance.getModule('FullscreenExtension') as FullscreenExtension).toggleFullscreen();
  }, [instance]);

  return {
    toggleFullscreen,
  };
});

export default ToggleFullscreen;
