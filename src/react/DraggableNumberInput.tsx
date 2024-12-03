import type { DraggableNumberInputProps } from "./draggable-number-input.types";
import React, { useCallback, useEffect, useRef, useState } from "react";

export function DraggableNumberInput({
  value,
  onChange = () => {},
  className = "",
  disablePointerLock = false,
  ...props
}: DraggableNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    // format displayed value to avoid issues with floating point decimal calculation:
    // ie: .1 + .2 = .30000000000000004
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 6,
      useGrouping: false,
    }).format(value);
    setLocalValue(String(formatted));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    // Reset to last valid value if input is invalid
    if (isNaN(parseFloat(localValue))) {
      setLocalValue(String(value));
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!inputRef.current) return;

      setIsDragging(true);
      setStartX(e.clientX);
      setStartValue(value);

      if (!disablePointerLock) {
        inputRef.current.requestPointerLock();
      }
    },
    [value, disablePointerLock]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const movementX = disablePointerLock ? e.clientX - startX : e.movementX;
      const shiftMultiplier = e.shiftKey ? 10 : 1;
      const pixelDivisor = e.shiftKey ? 2 : 1;
      const delta = Math.floor(movementX / pixelDivisor) * shiftMultiplier;

      if (disablePointerLock) {
        onChange(startValue + delta);
      } else {
        onChange(value + Math.sign(movementX) * (e.shiftKey ? 10 : 1));
      }
    },
    [isDragging, startX, startValue, value, disablePointerLock, onChange]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    if (!disablePointerLock && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [isDragging, disablePointerLock]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const increment = e.shiftKey ? 10 : 1;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        onChange(value + increment);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onChange(value - increment);
      }
    },
    [value, onChange]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="-?[0-9]*\.?[0-9]*"
      value={localValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      className={`draggable-number-input ${className}`}
      style={{
        cursor: isDragging ? "ew-resize" : "ew-resize",
        userSelect: "none",
      }}
      {...props}
    />
  );
}
