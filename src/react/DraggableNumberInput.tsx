import type { DraggableNumberInputProps } from "./draggable-number-input.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultModifiers,
  formatNumber,
  getDecimalPlaces,
} from "./defaults-and-utils";
import { DragCursor } from "./DragCursor";

export function DraggableNumberInput({
  value,
  onChange = () => {},
  className = "",
  disablePointerLock = false,
  modifierKeys,
  onDragStart = () => {},
  onDragEnd = () => {},
  ...props
}: DraggableNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [totalMovement, setTotalMovement] = useState(0);
  const [localValue, setLocalValue] = useState(String(value));
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const currentMultiplier = useRef(1);

  useEffect(() => {
    const decimals = getDecimalPlaces(currentMultiplier.current);
    setLocalValue(formatNumber(value, decimals));
  }, [value, currentMultiplier]);

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

      setIsMouseDown(true);
      setStartX(e.clientX);
      setStartValue(value);
      setTotalMovement(0);
      setCursorPosition({ x: e.clientX, y: e.clientY });

      if (!disablePointerLock) {
        inputRef.current.requestPointerLock();
      }
    },
    [value, disablePointerLock]
  );

  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown) return;

    if (!disablePointerLock && document.pointerLockElement) {
      setCursorPosition((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const x = (prev.x + e.movementX + width) % width;
        const y = (prev.y + e.movementY + height) % height;
        return { x, y };
      });
    }

    const newMovement = disablePointerLock
      ? e.clientX - startX
      : totalMovement + e.movementX;
    if (!isDragging && newMovement !== 0) {
      setIsDragging(true);
      onDragStart();
    }
    setTotalMovement(newMovement);

    applyMovement(newMovement, e);
  };

  const updateDelta = (e: React.KeyboardEvent) => {
    if (!isMouseDown) return;
    applyMovement(totalMovement, e);
  };

  const getModifiers = (e: React.KeyboardEvent | MouseEvent) => {
    const mods = { ...defaultModifiers, ...modifierKeys };

    for (const key in mods) {
      if (key !== "default" && e[key as keyof typeof e]) {
        currentMultiplier.current = mods[key as keyof typeof mods].multiplier;
        return mods[key as keyof typeof mods];
      }
    }
    currentMultiplier.current = mods.default.multiplier;
    return mods.default;
  };

  const applyMovement = (
    newMovement: number,
    e: React.KeyboardEvent | MouseEvent
  ) => {
    const { sensitivity, multiplier } = getModifiers(e);
    const delta = newMovement * sensitivity * multiplier;
    let newValue = startValue + delta;
    newValue = Math.round(newValue / multiplier) * multiplier;
    newValue = Object.is(newValue, -0) ? 0 : newValue; // avoid -0
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTotalMovement(0);
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
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
    } else if (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Meta" ||
      e.key === "Alt"
    ) {
      updateDelta(e);
    }
  };

  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <>
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
          caretColor: isDragging ? "transparent" : "initial",
        }}
        {...props}
      />
      {isMouseDown && !disablePointerLock && (
        <DragCursor cursorPosition={cursorPosition} />
      )}
    </>
  );
}
