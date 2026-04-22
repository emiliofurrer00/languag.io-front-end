'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type SliderProps = Omit<
  React.ComponentPropsWithRef<'input'>,
  'value' | 'defaultValue' | 'type' | 'onChange'
> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
};

function clampSliderValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ref,
  ...props
}: SliderProps) {
  const minValue = Number(min);
  const maxValue = Number(max);
  const currentValue = clampSliderValue(value?.[0] ?? defaultValue?.[0] ?? minValue, minValue, maxValue);

  return (
    <div className={cn('flex w-full items-center', className)}>
      <input
        ref={ref}
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={currentValue}
        onChange={(event) => onValueChange?.([Number(event.target.value)])}
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full border-2 border-foreground bg-secondary accent-primary',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        {...props}
      />
    </div>
  );
}

export { Slider };
