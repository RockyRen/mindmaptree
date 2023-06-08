import { h, MElement } from '../m-element';

export const createToolbarItem = ({
  iconName,
  tipLabel,
  isDisabled = true,
}: {
  iconName: string;
  tipLabel: string;
  isDisabled?: boolean
}): {
  el: MElement;
  btnEl: MElement;
} => {
  const btnEl = h('div', `toolbar-btn${isDisabled ? ' disabled' : ''}`).setChild(
    h('div', `toolbar-icon ${iconName}-icon`)
  );
  const el = h('div', 'toolbar-item').setChildren(
    btnEl,
    h('div', 'toolbar-tip').setChild(tipLabel),
  );

  return {
    el,
    btnEl,
  };
};
