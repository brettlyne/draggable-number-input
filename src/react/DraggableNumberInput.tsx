import type { DraggableNumberInputProps } from "./draggable-number-input.types";
import React, { useCallback, useEffect, useRef, useState } from "react";

const defaultModifier = { multiplier: 1, sensitivity: 1 };
const defaultModifiers = {
  default: defaultModifier,
  ctrlKey: defaultModifier,
  shiftKey: {
    multiplier: 10,
    sensitivity: 0.5,
  },
  metaKey: defaultModifier,
  altKey: defaultModifier,
};

export function DraggableNumberInput({
  value,
  onChange = () => {},
  className = "",
  disablePointerLock = false,
  modifierKeys,
  ...props
}: DraggableNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [totalMovement, setTotalMovement] = useState(0);
  const [localValue, setLocalValue] = useState(String(value));
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
      setCursorPosition({ x: e.clientX, y: e.clientY });

      if (!disablePointerLock) {
        inputRef.current.requestPointerLock();
      }
    },
    [value, disablePointerLock]
  );

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

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
    setTotalMovement(newMovement);

    applyMovement(newMovement, e);
  };

  // update value when shift key is pressed / released
  const updateDelta = (e: React.KeyboardEvent) => {
    if (!isDragging) return;
    applyMovement(totalMovement, e);
  };

  const getModifiers = (e: React.KeyboardEvent | MouseEvent) => {
    const mods = { ...defaultModifiers, ...modifierKeys };

    for (const key in mods) {
      if (key !== "default" && e[key as keyof typeof e]) {
        return mods[key as keyof typeof mods];
      }
    }

    return mods.default;
  };

  const applyMovement = (
    newMovement: number,
    e: React.KeyboardEvent | MouseEvent
  ) => {
    const { sensitivity, multiplier } = getModifiers(e);
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
        }}
        {...props}
        // />
      />
      {isDragging && !disablePointerLock && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            {/* resize-ew icon on drag  */}
            <path
              fill="#000"
              stroke="#fff"
              stroke-linejoin="round"
              d="M6.5 9a.5.5 0 0 0-.8-.4l-4 3a.5.5 0 0 0 0 .8l4 3a.5.5 0 0 0 .8-.4v-1.5h11V15a.5.5 0 0 0 .8.4l4-3a.5.5 0 0 0 0-.8l-4-3a.5.5 0 0 0-.8.4v1.5h-11V9Z"
              style={{
                filter: "drop-shadow( 0px 2px 1px rgba(0, 0, 0, .35))",
              }}
            />
          </svg>
        </div>
      )}
    </>
  );
}
