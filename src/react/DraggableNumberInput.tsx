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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newMovement = disablePointerLock
      ? e.clientX - startX
      : totalMovement + e.movementX;
    setTotalMovement(newMovement);

    applyMovement(newMovement, e);
  };

  // update value when shift key is pressed / released
  const updateDelta = (e: React.KeyboardEvent) => {
    if (!isDragging) return;
    applyMovement(totalMovement, e);
  };

  const applyMovement = (
    newMovement: number,
    e: React.KeyboardEvent | MouseEvent
  ) => {
    const multiplier = e.shiftKey ? 10 : 1;
    const sensitivity = e.shiftKey ? 0.5 : 1;
    const delta = newMovement * sensitivity * multiplier;
    let newValue = startValue + delta;
    if (newMovement > 0) {
      newValue = Math.ceil(newValue / multiplier) * multiplier;
    } else {
      newValue = Math.floor(newValue / multiplier) * multiplier;
    }
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTotalMovement(0);
    if (!disablePointerLock && document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const increment = e.shiftKey ? 10 : 1;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      onChange(value + increment);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onChange(value - increment);
    } else if (e.key === "Shift") {
      updateDelta(e);
    }
  };

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
      className={`draggable-number-input ${className} ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        cursor: "ew-resize",
        userSelect: "none",
      }}
      {...props}
    />
  );
}
