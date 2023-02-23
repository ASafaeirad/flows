import { usePress } from '@react-aria/interactions';
import cls from 'classnames';
import { createElement } from 'react';

type ButtonAttrs = Omit<JSX.IntrinsicElements['button'], 'onClick'>;

interface Props extends ButtonAttrs {
  isMuted?: boolean;
  isActive?: boolean;
  isToday?: boolean;
  isLabel?: boolean;
  isSelected?: boolean;
  onPress?: (e: any) => void;
}

export const DateItem = ({
  className,
  isMuted,
  isActive,
  isToday,
  isSelected,
  isLabel,
  onPress,
  ...props
}: Props): JSX.Element => {
  const Component = isLabel ? 'div' : 'button';
  const { pressProps } = usePress({ onPress });

  return createElement(Component, {
    className: cls(
      className,
      {
        'text-placeholder': isMuted,
        'text-accent-0': isActive,
        'border border-border': isToday,
        'bg-accent-0 text-dark-0': isSelected,
        'text-xs': isLabel,
      },
      'flex h-8 w-8 items-center justify-center rounded text-sm',
    ),
    ...pressProps,
    ...props,
  });
};
