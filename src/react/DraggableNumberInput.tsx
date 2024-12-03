import type { DraggableNumberInputProps } from './draggable-number-input.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export function DraggableNumberInput({
  value,
  onChange,
  className = '',
  disablePointerLock = false,
  ...props
}: DraggableNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);

  const updateValue = useCallback((newValue: number) => {
    onChange?.(newValue);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!inputRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setStartValue(value);

    if (!disablePointerLock) {
      inputRef.current.requestPointerLock();
    }
  }, [value, disablePointerLock]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const movementX = disablePointerLock ? e.clientX - startX : e.movementX;
    const shiftMultiplier = e.shiftKey ? 10 : 1;
    const pixelDivisor = e.shiftKey ? 2 : 1;
    const delta = Math.floor(movementX / pixelDivisor) * shiftMultiplier;

    if (disablePointerLock) {
      updateValue(startValue + delta);
    } else {
      updateValue(value + Math.sign(movementX) * (e.shiftKey ? 10 : 1));
    }
  }, [isDragging, startX, startValue, value, disablePointerLock, updateValue]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    if (!disablePointerLock && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [isDragging, disablePointerLock]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const increment = e.shiftKey ? 10 : 1;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateValue(value + increment);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateValue(value - increment);
    }
  }, [value, updateValue]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={(e) => updateValue(Number(e.target.value))}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      className={`draggable-number-input ${className}`}
      style={{
        cursor: isDragging ? 'ew-resize' : 'ew-resize',
        userSelect: 'none',
      }}
      {...props}
    />
  );
}