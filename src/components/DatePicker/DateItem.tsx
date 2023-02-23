import cls from 'classnames';
import { createElement } from 'react';

type ButtonAttrs = JSX.IntrinsicElements['button'];

interface Props extends ButtonAttrs {
  isMuted?: boolean;
  isActive?: boolean;
  isToday?: boolean;
  isLabel?: boolean;
  isSelected?: boolean;
}

export const DateItem = ({
  className,
  isMuted,
  isActive,
  isToday,
  isSelected,
  isLabel,
  ...props
}: Props): JSX.Element => {
  const Component = isLabel ? 'div' : 'button';

  return createElement(Component, {
    className: cls(
      className,
      {
        'text-light-muted': isMuted,
        'text-accent-0': isActive,
        'border border-border': isToday,
        'bg-accent-0 text-dark-0': isSelected,
      },
      'flex h-8 w-8 items-center justify-center rounded text-sm',
    ),
    ...props,
  });
};
