# Draggable Number Input

![Draggable Number Input Preview](draggable-input-preview.gif)

## [Interactive Docs & Examples](https://brettlyne.github.io/draggable-number-input/) 👈 👈 👈

A [React](https://react.dev) component intended to replicate the draggable number input behavior
we see in applications like Blender, Figma, and After Effects.

## Installation

```bash
npm install draggable-number-input
```

## Usage

```jsx
import {
  DraggableNumberInput,
  DraggableLabelNumberInput,
} from "draggable-number-input";

// Basic usage with input
function MyComponent() {
  const [value, setValue] = useState(0);
  return <DraggableNumberInput value={value} onChange={setValue} />;
}

// Usage with label
function MyLabelComponent() {
  const [value, setValue] = useState(0);
  return (
    <DraggableLabelNumberInput value={value} onChange={setValue}>
      <strong>Drag me:</strong>
    </DraggableLabelNumberInput>
  );
}
```

## Features

- drag left or right on an input (or label) to set the value
- use up and down arrow keys to increment and decrement
- allow modifier keys to multiply the increment
- provide optional sensitivity setting per modifier key to more easily target values (ex: in Figma while holding shift you move by 10 and sensitivity is .5)

### Docs: https://brettlyne.github.io/draggable-number-input/
