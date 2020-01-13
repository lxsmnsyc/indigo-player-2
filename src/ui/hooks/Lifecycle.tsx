import React from 'react';
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

interface LifecycleProps {
  children?: React.ReactNode;
}

export default function Lifecycle({ children }: LifecycleProps): JSX.Element {
  const instance = StateProps.useSelector((state) => state.instance);

  const [showControls, hideControls] = VisibleControls.useSelectors((state) => [
    state.showControls,
    state.hideControls,
  ]);

  const closeSettings = SettingsTab.useSelector((state) => state.closeSettings);
  const triggerNod = TriggerNod.useSelector((state) => state.triggerNod);
  const toggleActiveSubtitle = ToggleActiveSubtitle.useSelector(
    (state) => state.toggleActiveSubtitle,
  );
  const togglePip = TogglePip.useSelector((state) => state.togglePip);

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

  const data = Data.useSelector((state) => state);
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
