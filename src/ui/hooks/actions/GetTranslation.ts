import createModel from '@lxsmnsyc/react-scoped-model';
import { useCallback } from 'react';
import { getTranslation as translate } from '../../i18n';
import StateProps from '../StateProps';

export interface GetTranslationState {
  getTranslation: (text: string) => string;
}

const GetTranslation = createModel<GetTranslationState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const getTranslation = useCallback((text: string): string => (
    translate(instance.config.ui.locale)(text)
  ), [instance]);

  return {
    getTranslation,
  };
});

export default GetTranslation;
