import React from "react";

interface DragCursorProps {
  cursorPosition: { x: number; y: number };
}

export const DragCursor: React.FC<DragCursorProps> = ({ cursorPosition }) => (
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
      <path
        fill="#000"
        stroke="#fff"
        strokeLinejoin="round"
        d="M6.5 9a.5.5 0 0 0-.8-.4l-4 3a.5.5 0 0 0 0 .8l4 3a.5.5 0 0 0 .8-.4v-1.5h11V15a.5.5 0 0 0 .8.4l4-3a.5.5 0 0 0 0-.8l-4-3a.5.5 0 0 0-.8.4v1.5h-11V9Z"
        style={{
          filter: "drop-shadow( 0px 2px 1px rgba(0, 0, 0, .35))",
        }}
      />
    </svg>
  </div>
);
