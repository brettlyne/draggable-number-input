import { DraggableLabelNumberInputProps } from "./draggable-label-number-input.types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultModifiers,
  formatNumber,
  getDecimalPlaces,
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
  ...props
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
    (e: React.MouseEvent) => {
      // Prevent drag initiation if clicking on the input itself
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      setIsMouseDown(true);
      startX.current = e.clientX;
      startValue.current = value;
      totalMovement.current = 0;
      setCursorPosition({ x: e.clientX, y: e.clientY });

      if (!disablePointerLock) {
        labelRef.current?.requestPointerLock();
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
    (e: React.KeyboardEvent | KeyboardEvent | MouseEvent) => {
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
    (newMovement: number, e: KeyboardEvent | MouseEvent) => {
      const { sensitivity, multiplier } = getModifiers(e);
      const delta = newMovement * sensitivity * multiplier;
      let newValue = startValue.current + delta;
      newValue = Math.round(newValue / multiplier) * multiplier;
      newValue = Object.is(newValue, -0) ? 0 : newValue; // avoid -0
      onChange(newValue);
    },
    [onChange, getModifiers]
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { multiplier } = getModifiers(event);
    const increment = multiplier;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      onChange(value + increment);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      onChange(value - increment);
    }
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
    (e: MouseEvent) => {
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
        ? e.clientX - startX.current
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
      className={`draggable-number-label ${className} ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        cursor: "ew-resize",
        userSelect: "none",
      }}
      {...props}
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
          onKeyDown={handleKeyDown}
          className={`${inputClassName} ${isDragging ? "dragging" : ""}`}
          style={inputStyle}
        />
      )}
      {isMouseDown && !disablePointerLock && (
        <DragCursor cursorPosition={cursorPosition} />
      )}
    </label>
  );
}
