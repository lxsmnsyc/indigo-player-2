import createModel from '@lxsmnsyc/react-scoped-model';
import * as React from 'react';
import { Optional } from '../../types';
import { KeyboardNavigationPurpose } from '../../../types';
import useOnUnmount from '../useOnUnmount';

export interface TriggerNodState {
  triggerNod: (purpose: KeyboardNavigationPurpose) => void;
  nodPurpose: Optional<KeyboardNavigationPurpose>;
}

const TriggerNod = createModel<TriggerNodState>(() => {
  const nodTimer = React.useRef<number | null>(null);
  const [nodPurpose, setNodPurpose] = React.useState();

  const triggerNod = React.useCallback((purpose) => {
    if (nodTimer.current) {
      window.clearTimeout(nodTimer.current);
      nodTimer.current = null;
    }

    setNodPurpose(purpose);

    nodTimer.current = window.setTimeout(() => {
      setNodPurpose(null);
      nodTimer.current = null;
    }, 500);
  }, []);

  useOnUnmount(() => {
    if (nodTimer.current) {
      window.clearTimeout(nodTimer.current);
      nodTimer.current = null;
    }
  });

  return {
    nodPurpose,
    triggerNod,
  };
});

export default TriggerNod;
