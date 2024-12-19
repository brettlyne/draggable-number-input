import React from "react";
import { DraggableLabelNumberInputProps } from "./draggable-label-number-input.types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultModifiers,
  formatNumber,
  getDecimalPlaces,
  handleArrow,
} from "./defaults-and-utils";
import { DragCursor } from "./DragCursor";

const noop = () => {};

export function DraggableLabelNumberInput({
  value,
  className = "",
  inputClassName = "",
  inputStyle,
  children,
  noInput = false,
  disablePointerLock = false,
  modifierKeys,
  onChange = noop,
  onDragStart = noop,
  onDragEnd = noop,
  style,
  inputProps,
  ...restProps
}: DraggableLabelNumberInputProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(String(value));
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const totalMovement = useRef(0);
  const startValue = useRef(0);
  const startX = useRef(0);
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
    (e: React.MouseEvent | React.TouchEvent) => {
      // prevent drag initiation if clicking on the input itself
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      let x = 0,
        y = 0;
      if ("clientX" in e && "clientY" in e) {
        [x, y] = [e.clientX, e.clientY];
      }
      if ("touches" in e) {
        [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
      }

      setIsMouseDown(true);
      startX.current = x;
      startValue.current = value;
      totalMovement.current = 0;
      setCursorPosition({ x, y });

      if (!disablePointerLock && !(e instanceof TouchEvent)) {
        labelRef.current?.requestPointerLock?.();
      }
    },
    [value, disablePointerLock]
  );

  const updateDelta = useCallback(
    (e: KeyboardEvent) => {
      if (!isMouseDown) return;
      applyMovement(totalMovement.current, e);
    },
    [isMouseDown]
  );

  const getModifiers = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent | MouseEvent | TouchEvent) => {
      const mods = { ...defaultModifiers, ...modifierKeys };

      for (const key in mods) {
        if (key !== "default" && e[key as keyof typeof e]) {
          currentMultiplier.current = mods[key as keyof typeof mods].multiplier;
          return mods[key as keyof typeof mods];
        }
      }
      currentMultiplier.current = mods.default.multiplier;
      return mods.default;
    },
    [modifierKeys]
  );

  const applyMovement = useCallback(
    (newMovement: number, e: KeyboardEvent | MouseEvent | TouchEvent) => {
      const { sensitivity, multiplier } = getModifiers(e);
      const delta = newMovement * sensitivity * multiplier;
      let newValue = startValue.current + delta;
      newValue = Math.round(newValue / multiplier) * multiplier;
      newValue = Object.is(newValue, -0) ? 0 : newValue; // avoid -0
      onChange(newValue);
    },
    [onChange, getModifiers]
  );

  const handleArrowKeyDown = (event: React.KeyboardEvent) => {
    const { multiplier } = getModifiers(event);
    handleArrow(event, multiplier, value, onChange);
  };

  const handleModifierKeyDuringDrag = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Meta" ||
        e.key === "Alt"
      ) {
        updateDelta(e);
      }
    },
    [updateDelta]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return;

      if (e instanceof TouchEvent) {
        e.preventDefault();
      }

      if (
        !disablePointerLock &&
        document.pointerLockElement &&
        e instanceof MouseEvent
      ) {
        setCursorPosition((prev) => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const x = (prev.x + e.movementX + width) % width;
          const y = (prev.y + e.movementY + height) % height;
          return { x, y };
        });
      }

      const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const newMovement =
        disablePointerLock || e instanceof TouchEvent
          ? x - startX.current
          : totalMovement.current + e.movementX;
      if (!isDragging && newMovement !== 0) {
        setIsDragging(true);
        document.addEventListener("keydown", handleModifierKeyDuringDrag);
        document.addEventListener("keyup", handleModifierKeyDuringDrag);
        onDragStart();
      }
      totalMovement.current = newMovement;

      applyMovement(newMovement, e);
    },
    [
      isMouseDown,
      disablePointerLock,
      isDragging,
      handleModifierKeyDuringDrag,
      onDragStart,
      applyMovement,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.removeEventListener("keydown", handleModifierKeyDuringDrag);
      document.removeEventListener("keyup", handleModifierKeyDuringDrag);
      onDragEnd();
    }
    if (isMouseDown && !isDragging) {
      // if we didn't move the mouse, trigger a click so input is focused
      labelRef.current?.click();
    }
    if (!disablePointerLock && document.pointerLockElement) {
      document.exitPointerLock();
    }
    setIsMouseDown(false);
    totalMovement.current = 0;
  }, [isDragging, handleModifierKeyDuringDrag, onDragEnd, disablePointerLock]);

  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleMouseMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <label
      ref={labelRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      className={`draggable-number-label ${className} ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        ...{
          cursor: "ew-resize",
          userSelect: "none",
        },
        ...style,
      }}
      aria-valuenow={value}
      aria-label={
        typeof children === "string" ? children : "Draggable number input"
      }
      {...restProps}
    >
      {children}
      {!noInput && (
        <input
          type="text"
          inputMode="numeric"
          pattern="-?[0-9]*\.?[0-9]*"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleArrowKeyDown}
          className={`${inputClassName} ${isDragging ? "dragging" : ""}`}
          style={inputStyle}
          aria-label={`Enter value for ${typeof children === "string" ? children : "number input"}`}
          {...inputProps}
        />
      )}
      {isMouseDown && !disablePointerLock && (
        <DragCursor cursorPosition={cursorPosition} />
      )}
    </label>
  );
}
