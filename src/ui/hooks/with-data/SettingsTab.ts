import createModel from '@lxsmnsyc/react-scoped-model';
import useConstantCallback from "../useConstantCallback";
import { Optional, SettingsTabs } from '../../types';
import React from 'react';
import { GUI_SETTINGS, GUI_BUTTON_SETTINGS } from '../../theme';
import StateProps from '../StateProps';

interface SettingsTabState {
  settingsTab: Optional<SettingsTabs>;
  setSettingsTab: (settingsTab: Optional<SettingsTabs>) => void;
  toggleSettings: () => void;
  closeSettings: (event: MouseEvent) => void;
}

const SettingsTab = createModel<SettingsTabState>(() => {
  const instance = StateProps.useSelector((state) => state.instance);

  const [settingsTab, setSettingsTab] = React.useState<Optional<SettingsTabs>>(null);

  const toggleSettings = useConstantCallback(() => {
    setSettingsTab((prev) => (
      prev
        ? SettingsTabs.NONE
        : SettingsTabs.OPTIONS
    ))
  });

  const closeSettings = React.useCallback((event: MouseEvent): void => {
    const isOver = (className: string): boolean => {
      const { target } = event;
      const container = instance.container.querySelector(className);
      return (
        !!container && (container === target || container.contains(target as Node))
      );
    };

    if (isOver(GUI_SETTINGS) || isOver(GUI_BUTTON_SETTINGS)) {
      return;
    }

    setSettingsTab(SettingsTabs.NONE);
  }, [instance]);
  
  return {
    settingsTab,
    setSettingsTab,
    toggleSettings,
    closeSettings,
  };

});

export default SettingsTab;
