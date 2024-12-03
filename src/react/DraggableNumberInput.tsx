import { Key } from "readline";
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
  const [totalMovement, setTotalMovement] = useState(0);
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
    setLocalValue(String(value));
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!inputRef.current) return;

      setIsDragging(true);
      setStartX(e.clientX);
      setStartValue(value);
      setTotalMovement(0);

      if (!disablePointerLock) {
        inputRef.current.requestPointerLock();
      }
    },
    [value, disablePointerLock]
  );

  // update delta when shift key is pressed
  const updateDelta = (e: React.KeyboardEvent) => {
    if (!isDragging) return;
    const shiftMultiplier = e.shiftKey ? 10 : 1;
    const pixelDivisor = e.shiftKey ? 2 : 1;
    const delta = Math.floor(totalMovement / pixelDivisor) * shiftMultiplier;
    onChange(startValue + delta);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newMovement = disablePointerLock
        ? e.clientX - startX
        : totalMovement + e.movementX;
      setTotalMovement(newMovement);

      const shiftMultiplier = e.shiftKey ? 10 : 1;
      const pixelDivisor = e.shiftKey ? 2 : 1;
      const delta = Math.floor(newMovement / pixelDivisor) * shiftMultiplier;

      onChange(startValue + delta);
    },
    [
      isDragging,
      startX,
      startValue,
      disablePointerLock,
      onChange,
      totalMovement,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setTotalMovement(0);
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
      // if key is shift, trigger update
      else if (e.key === "Shift") {
        updateDelta(e);
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
      onKeyUp={updateDelta}
      className={`draggable-number-input ${className}`}
      style={{
        cursor: isDragging ? "ew-resize" : "ew-resize",
        userSelect: "none",
      }}
      {...props}
    />
  );
}
