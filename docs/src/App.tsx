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
        <h1>Draggable Number Input 🚧🚧🚧</h1>
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
            Lucky number:&nbsp;
            <DraggableNumberInput value={value} onChange={setValue} />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<label>
  Lucky number:&nbsp;
  <DraggableNumberInput value={value} onChange={setValue} />
</label>
`}
          svelte={`
`}
        />

        <h3 id="input-examples">No pointer lock</h3>
        <div className="example">
          <label>
            Lucky number:&nbsp;
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
  Lucky number:&nbsp;
  <DraggableNumberInput value={value} onChange={setValue} disablePointerLock  />
</label>
`}
          svelte={`
`}
        />

        <h3 id="input-examples">Custom Modifier Keys</h3>
        <div className="example">
          <label>
            Lucky number:&nbsp;
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
  Lucky number:&nbsp;
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

        <h3 id="input-examples">
          OnDragStart and OnDragEnd events (see console)
        </h3>
        <div className="example">
          <label>
            Lucky number:&nbsp;
            <DraggableNumberInput
              value={value}
              onChange={setValue}
              onDragStart={() => {
                console.log("onDragStart");
              }}
              onDragEnd={() => {
                console.log("onDragEnd");
              }}
            />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<label>
  Lucky number:&nbsp;
  <DraggableNumberInput
    value={value}
    onChange={setValue}
    onDragStart={() => { console.log("onDragStart"); }}
    onDragEnd={() => { console.log("onDragEnd"); }}
  />
</label>
`}
          svelte={`
`}
        />

        <h3 id="input-examples">Custom styles while dragging</h3>
        <div className="example">
          <style>
            {`
            .yellow-on-drag.dragging {
              background: yellow;
            }
            `}
          </style>
          <label>
            Lucky number:&nbsp;
            <DraggableNumberInput
              value={value}
              onChange={setValue}
              className="yellow-on-drag"
            />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<style>
  .yellow-on-drag.dragging {
    background: yellow;
  }
</style>
...
<label>
  Lucky number:&nbsp;
  <DraggableNumberInput
    value={value}
    onChange={setValue}
    className="yellow-on-drag"
  />
</label>
`}
          svelte={`
`}
        />

        <div className="api-section">
          <h2 id="input-api">Draggable Number Input API</h2>
          <p>The DraggableNumberInput component accepts the following props:</p>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>{`value`}</code>
                </td>
                <td>
                  <code>{`number`}</code>
                </td>
                <td>Required</td>
                <td>The current value of the input</td>
              </tr>
              <tr>
                <td>
                  <code>{`onChange`}</code>
                </td>
                <td>
                  <code>{`function`}</code>
                </td>
                <td>
                  <code>{`() => {}`}</code>
                </td>
                <td>Callback function called when the value changes</td>
              </tr>
              <tr>
                <td>
                  <code>{`onDragStart`}</code>
                </td>
                <td>
                  <code>{`function`}</code>
                </td>
                <td>
                  <code>{`() => {}`}</code>
                </td>
                <td>Callback function called when dragging begins</td>
              </tr>
              <tr>
                <td>
                  <code>{`onDragEnd`}</code>
                </td>
                <td>
                  <code>{`function`}</code>
                </td>
                <td>
                  <code>{`() => {}`}</code>
                </td>
                <td>Callback function called when dragging ends</td>
              </tr>
              <tr>
                <td>
                  <code>{`disablePointerLock`}</code>
                </td>
                <td>
                  <code>{`boolean`}</code>
                </td>
                <td>
                  <code>{`false`}</code>
                </td>
                <td>When true, disables pointer lock during drag</td>
              </tr>
              <tr>
                <td>
                  <code>{`modifierKeys`}</code>
                </td>
                <td>
                  <code>{`object`}</code>
                </td>
                <td>See description</td>
                <td>
                  Configuration for modifier key behavior. Can include{" "}
                  <code>default</code>, <code>shiftKey</code>,{" "}
                  <code>ctrlKey</code>, <code>altKey</code>, and{" "}
                  <code>metaKey</code> settings, each with{" "}
                  <code>multiplier</code> and <code>sensitivity</code> values
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
