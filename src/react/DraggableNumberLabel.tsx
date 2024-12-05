import type { DraggableNumberInputProps } from "./draggable-number-input.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultModifiers,
  formatNumber,
  getDecimalPlaces,
} from "./defaults-and-utils";
import { DragCursor } from "./DragCursor";

interface DraggableNumberLabelProps
  extends Omit<DraggableNumberInputProps, "className"> {
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function DraggableNumberLabel({
  value,
  onChange = () => {},
  children,
  className = "",
  labelClassName = "",
  disablePointerLock = false,
  modifierKeys,
  onDragStart = () => {},
  onDragEnd = () => {},
  ...props
}: DraggableNumberLabelProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [totalMovement, setTotalMovement] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const currentMultiplier = useRef(1);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Prevent drag initiation if clicking on the input itself
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      setIsMouseDown(true);
      setStartX(e.clientX);
      setStartValue(value);
      setTotalMovement(0);
      setCursorPosition({ x: e.clientX, y: e.clientY });

      if (!disablePointerLock) {
        labelRef.current?.requestPointerLock();
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

  const getModifiers = (e: MouseEvent) => {
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

  const applyMovement = (newMovement: number, e: MouseEvent) => {
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
    <label
      ref={labelRef}
      onMouseDown={handleMouseDown}
      className={`draggable-number-label ${labelClassName} ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        cursor: "ew-resize",
        userSelect: "none",
      }}
    >
      {children}
      {isMouseDown && !disablePointerLock && (
        <DragCursor cursorPosition={cursorPosition} />
      )}
    </label>
  );
}
