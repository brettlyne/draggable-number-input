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

        <h2 id="draggable-number-input">Draggable Number Input Examples</h2>

        <h3 id="input-examples">Default behavior</h3>
        <div className="example">
          <label>
            Barrels of fish:&nbsp;
            <DraggableNumberInput value={value} onChange={setValue} />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<label>
  Barrels of fish:&nbsp;
  <DraggableNumberInput value={value} onChange={setValue} />
</label>
`}
          svelte={`
`}
        />

        {/* <br />
          <br />
          <label>
            No pointer lock:&nbsp;

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
                  sensitivity: 0.5,
                },
                altKey: {
                  multiplier: 0.01,
                  sensitivity: 0.2,
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
          </label> */}

        <h3 id="input-examples">No pointer lock</h3>
        <div className="example">
          <label>
            Barrels of fish:&nbsp;
            <DraggableNumberInput
              value={value}
              onChange={setValue}
              disablePointerLock
            />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<label>
  Barrels of fish:&nbsp;
  <DraggableNumberInput value={value} onChange={setValue} disablePointerLock  />
</label>
`}
          svelte={`
`}
        />

        <h3 id="input-examples">Custom Modifier Keys</h3>
        <div className="example">
          <label>
            Barrels of fish:&nbsp;
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
                  sensitivity: 0.5,
                },
                altKey: {
                  multiplier: 0.01,
                  sensitivity: 0.2,
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
        sensitivity: 0.5,
      },
      altKey: {
        multiplier: 0.01,
        sensitivity: 0.2,
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
`}
          svelte={`
`}
        />
      </div>
    </>
  );
}

export default App;
