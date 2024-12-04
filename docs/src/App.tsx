import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import CodePreview from "./components/CodePreview";
import { DraggableNumberInput } from "../../src/react/DraggableNumberInput";

function App() {
  const [codeMode, setCodeMode] = useState<"react" | "svelte">("react");
  const mode = { codeMode, setCodeMode };
  const [value, setValue] = useState(0);

  return (
    <>
      <Sidebar />
      <div className="content large">
        <h1>Draggable Number Input</h1>
        <p>
          A <a href="https://react.dev">React</a> and{" "}
          <a href="https://svelte.dev">Svelte</a> component intended to
          replicate the draggable number input behavior we see in applications
          like Blender, Figma, and After Effects.
        </p>
        <p>Behaviors:</p>

        <ul>
          <li>
            drag left or right on an input (or{" "}
            <a href="#draggable-number-input-label">label</a>) to set the value
          </li>
          <li>use up and down arrow keys to increment and decrement</li>
          <li>allow modifier keys to multiply the increment </li>
          <li>
            provide optional sensitivity setting per modifier key to more easily
            target values (ex: in Figma while holding shift you move by 10 and
            sensitivity is .5)
          </li>
        </ul>

        <h2 id="draggable-number-input">Draggable Number Input</h2>
        <h3 id="input-examples">Examples: Default, Disable Pointer Lock</h3>
        <div className="example">
          <label>
            Barrels of fish:&nbsp;
            <DraggableNumberInput value={value} onChange={setValue} />
          </label>
          <br />
          <br />
          <label>
            No pointer lock:&nbsp;
            <DraggableNumberInput
              value={value}
              onChange={setValue}
              disablePointerLock
            />
          </label>
          <br />
          <br />
          <label>
            Custom Modifier Keys:&nbsp;
            <DraggableNumberInput
              value={value}
              onChange={setValue}
              modifierKeys={{
                default: {
                  multiplier: 2,
                  sensitivity: 0.5,
                },
                ctrlKey: {
                  multiplier: 0.1,
                  sensitivity: 1,
                },
                shiftKey: {
                  multiplier: 10,
                  sensitivity: 0.25,
                },
                metaKey: {
                  multiplier: 100,
                  sensitivity: 0.125,
                },
              }}
            />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<label>
  Barrels of fish:&nbsp;
  <DraggableNumberInput value={value} onChange={setValue} />
</label>

<label>
  No pointer lock:&nbsp;
  <DraggableNumberInput
    value={value}
    onChange={setValue}
    disablePointerLock
  />
</label>`}
          svelte={`
float random(in vec2 p) {
float rotation = 360.0; //best 360.0
  float size = 1.0; //best 1.0 {
      float offsetIntensity = 5.0; //best 5.0
  }
return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}`}
        />
      </div>
    </>
  );
}

export default App;
