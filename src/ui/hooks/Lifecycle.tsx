import { createSelector, createSelectors, createValue } from 'react-scoped-model';
import React, { ReactNode } from 'react';
import StateProps from './StateProps';
import useIsomorphicEffect from './useIsomorphicEffect';
import VisibleControls from './actions/VisibleControls';
import SettingsTab from './actions/SettingsTab';
import TriggerNod from './actions/TriggerNod';
import ToggleActiveSubtitle from './actions/ToggleActiveSubtitle';
import TogglePip from './actions/TogglePip';
import { KeyboardNavigationPurpose, Events } from '../../types';
import useOnUpdate from './useOnUpdate';
import triggerEvent from '../utils/triggerEvent';
import Data, { DataState } from './Data';
import tuple from '../utils/tuple';

interface LifecycleProps {
  children?: ReactNode;
}

const useStateProps = createSelector(StateProps, (state) => state.instance);
const useVisibleControls = createSelectors(VisibleControls, (state) => tuple(
  state.showControls,
  state.hideControls,
));
const useSettingsTab = createSelector(SettingsTab, (state) => state.closeSettings);
const useTriggerNod = createSelector(TriggerNod, (state) => state.triggerNod);
const useToggleActiveSubtitle = createSelector(
  ToggleActiveSubtitle,
  (state) => state.toggleActiveSubtitle,
);
const useTogglePip = createSelector(TogglePip, (state) => state.togglePip);
const useData = createValue(Data);

export default function Lifecycle({ children }: LifecycleProps): JSX.Element {
  const instance = useStateProps();
  const [showControls, hideControls] = useVisibleControls();

  const closeSettings = useSettingsTab();
  const triggerNod = useTriggerNod();
  const toggleActiveSubtitle = useToggleActiveSubtitle();
  const togglePip = useTogglePip();

  useIsomorphicEffect(() => {
    instance.container.addEventListener('mouseenter', showControls);
    instance.container.addEventListener('mousemove', showControls);
    instance.container.addEventListener('mousedown', showControls);
    instance.container.addEventListener('mouseleave', hideControls);
    window.addEventListener('mousedown', closeSettings);

    const eventCallback = (data: any): void => {
      showControls();
      triggerNod(data.purpose);

      if (data.purpose === KeyboardNavigationPurpose.REQUEST_TOGGLE_SUBTITLES) {
        toggleActiveSubtitle();
      }
      if (
        data.purpose === KeyboardNavigationPurpose.REQUEST_TOGGLE_MINIPLAYER
      ) {
        togglePip();
      }
    };

    instance.on(Events.KEYBOARDNAVIGATION_KEYDOWN, eventCallback);

    return (): void => {
      instance.container.removeEventListener('mouseenter', showControls);
      instance.container.removeEventListener('mousemove', showControls);
      instance.container.removeEventListener('mousedown', showControls);
      instance.container.removeEventListener('mouseleave', hideControls);
      window.removeEventListener('mousedown', closeSettings);
      instance.off(Events.KEYBOARDNAVIGATION_KEYDOWN, eventCallback);
    };
  }, [instance]);

  const data = useData();
  const prevData = React.useRef<DataState | undefined>();

  useOnUpdate(() => {
    triggerEvent(instance, data, prevData.current);
    prevData.current = data;
  }, [data]);

  return (
    <>
      { children }
    </>
  );
}
