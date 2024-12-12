import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import CodePreview from "./components/CodePreview";
import { DraggableNumberInput } from "../../src/react/DraggableNumberInput";
import { DraggableLabelNumberInput } from "../../src/react/DraggableLabelNumberInput";

function App() {
  const [codeMode, setCodeMode] = useState<"react" | "svelte">("react");
  const mode = { codeMode, setCodeMode };
  const [value, setValue] = useState(0);

  return (
    <>
      <Sidebar />
      <div className="content large">
        <h1>Draggable Number Inputs</h1>
        <p>
          <a href="https://react.dev">React</a>{" "}
          {/* and <a href="https://svelte.dev">Svelte</a>  */}
          components intended to replicate the draggable number input behavior
          we see in applications like Blender, Figma, After Effects, and others.
        </p>
        <p>
          Drag left or right on the{" "}
          <a href="#draggable-number-input">
            <strong>input</strong>
          </a>{" "}
          or{" "}
          <a href="#draggable-label-number-input">
            <strong>label</strong>
          </a>{" "}
          to set the value.
        </p>
        <p>Behaviors:</p>

        <ul>
          <li>
            use{" "}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API">
              pointer lock API
            </a>{" "}
            to make it possible to drag past the edge of the screen and so your
            cursor is back on the input when you release the mouse.
          </li>
          <li>
            use up and down arrow keys while input is focused to increment and
            decrement
          </li>
          <li>
            allow modifier keys to multiply the increment (modifier keys also
            apply to arrow keys)
          </li>
          <li>
            provide optional sensitivity setting per modifier key to more easily
            target values (ex: in Figma while holding shift you move by 10s and
            sensitivity is .5)
          </li>
          <li>
            multipliers serve as a "snapping" value while dragging, ie: if
            you're holding shift you'll move by 10 and snap to the nearest 10
          </li>
        </ul>

        <h2 id="draggable-number-input">&lt;DraggableNumberInput&gt;</h2>

        <h3 id="input-examples">Default behavior</h3>
        <div className="example">
          <label>
            Lucky number:
            <DraggableNumberInput value={value} onChange={setValue} />
          </label>
        </div>
        <CodePreview
          mode={mode}
          react={`
<label>
  Lucky number:
  <DraggableNumberInput value={value} onChange={setValue} />
</label>
`}
          svelte={`
`}
        />

        <h3 id="input-examples">No pointer lock</h3>
        <p>
          By default{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API">
            pointer lock
          </a>{" "}
          is enabled, and we can drag indefinitely until we reach the desired
          number. Additional drags are also made easier since the cursor snaps
          back to the input when you release the mouse.
        </p>
        <p>
          In this <code>disablePointerLock</code> version, you can only drag to
          the edge of the screen.
        </p>
        <div className="example">
          <label>
            Lucky number:
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
  Lucky number:
  <DraggableNumberInput value={value} onChange={setValue} disablePointerLock  />
</label>
`}
          svelte={`
`}
        />

        <h3 id="input-examples">Custom Modifier Keys</h3>
        <div className="example">
          <label>
            Lucky number:
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
  Lucky number:
  <DraggableNumberInput
    value={value}
    onChange={setValue}
    modifierKeys={{
      default:  { multiplier: 2,    sensitivity: 0.5 },
      ctrlKey:  { multiplier: 0.1,  sensitivity: 0.5 },
      altKey:   { multiplier: 0.01, sensitivity: 0.2 },
      shiftKey: { multiplier: 10,   sensitivity: 0.25 },
      metaKey:  { multiplier: 100,  sensitivity: 0.125 },
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
            Lucky number:
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
  Lucky number:
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
            Lucky number:
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
  Lucky number:
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

        <h1>Draggable Label Number Input</h1>
        <p>
          Drag the label instead of the input. We can still use up/down arrow
          keys in the input with modifier keys.
        </p>

        <h2 id="draggable-label-number-input">
          &lt;DraggableLabelNumberInput&gt;
        </h2>

        <h3 id="draggable-label">Default behavior</h3>
        <div className="example">
          <DraggableLabelNumberInput value={value} onChange={setValue}>
            Draggable label:
          </DraggableLabelNumberInput>
        </div>
        <CodePreview
          mode={mode}
          react={`
<DraggableLabelNumberInput
  value={value}
  onChange={setValue}
>
  Draggable label:
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <h3 id="draggable-label-no-pointer-lock">Without pointer lock</h3>
        <div className="example">
          <DraggableLabelNumberInput
            value={value}
            onChange={setValue}
            disablePointerLock
          >
            Draggable label (no pointer lock):
          </DraggableLabelNumberInput>
        </div>
        <CodePreview
          mode={mode}
          react={`
<DraggableLabelNumberInput
  value={value}
  onChange={setValue}
  disablePointerLock
>
  Draggable label (no pointer lock):
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <h3 id="draggable-label-modifiers">With modifier keys</h3>
        <div className="example">
          <DraggableLabelNumberInput
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
          >
            Draggable label:
          </DraggableLabelNumberInput>
        </div>
        <CodePreview
          mode={mode}
          react={`
<DraggableLabelNumberInput
  value={value}
  onChange={setValue}
  modifierKeys={{
    default:  { multiplier: 2,    sensitivity: 0.5 },
    ctrlKey:  { multiplier: 0.1,  sensitivity: 0.5 },
    altKey:   { multiplier: 0.01, sensitivity: 0.2 },
    shiftKey: { multiplier: 10,   sensitivity: 0.25 },
    metaKey:  { multiplier: 100,  sensitivity: 0.125 },
  }}
>
  Draggable label:
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <h3 id="draggable-label-events">
          OnDragStart and OnDragEnd events (see console)
        </h3>
        <div className="example">
          <DraggableLabelNumberInput
            value={value}
            onChange={setValue}
            onDragStart={() => {
              console.log("onDragStart");
            }}
            onDragEnd={() => {
              console.log("onDragEnd");
            }}
          >
            Draggable label:
          </DraggableLabelNumberInput>
        </div>
        <CodePreview
          mode={mode}
          react={`
<DraggableLabelNumberInput
  value={value}
  onChange={setValue}
  onDragStart={() => { console.log("onDragStart"); }}
  onDragEnd={() => { console.log("onDragEnd"); }}
>
  Draggable label:
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <h3 id="draggable-label-styles">Custom styles while dragging</h3>
        <div className="example">
          <style>
            {`
            .yellow-on-drag.dragging {
              background: yellow;
            }
            `}
          </style>
          <DraggableLabelNumberInput
            value={value}
            onChange={setValue}
            className="yellow-on-drag"
          >
            Draggable label:
          </DraggableLabelNumberInput>
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
<DraggableLabelNumberInput
  value={value}
  onChange={setValue}
  className="yellow-on-drag"
>
  Draggable label:
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <h3 id="draggable-label-styles">Label with no &lt;input&gt;</h3>
        <div className="example">
          <DraggableLabelNumberInput value={value} onChange={setValue} noInput>
            Draggable label: <strong>{value}</strong>
          </DraggableLabelNumberInput>
        </div>
        <CodePreview
          mode={mode}
          react={`
<DraggableLabelNumberInput 
  value={value} 
  onChange={setValue} 
  noInput
>
  Draggable label: <strong>{value}</strong>
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <h3 id="draggable-label-input-styles">Custom input styles</h3>
        <div className="example">
          <style>
            {`
            .custom-input {
              color: blue;
            }
            .custom-input.dragging {
              background: yellow;
            }  
            `}
          </style>
          <DraggableLabelNumberInput
            value={value}
            onChange={setValue}
            inputClassName="custom-input"
            inputStyle={{
              fontWeight: "bold",
              padding: "4px 12px",
              borderRadius: "24px",
            }}
          >
            Draggable label:
          </DraggableLabelNumberInput>
        </div>
        <CodePreview
          mode={mode}
          react={`
<style>
  .custom-input { color: blue; }
  .custom-input.dragging { background: yellow; }  
</style>
...
<DraggableLabelNumberInput
  value={value}
  onChange={setValue}
  inputClassName="custom-input"
  inputStyle={{
    fontWeight: "bold",
    padding: "4px 12px",
    borderRadius: "24px",
  }}
>
  Draggable label:
</DraggableLabelNumberInput>
`}
          svelte={`
`}
        />

        <div className="api-section">
          <h2 id="label-input-api">Draggable Label Number Input API</h2>
          <p>
            The DraggableLabelNumberInput component accepts the following props:
          </p>
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
                  <code>value</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>Required</td>
                <td>The current value of the input</td>
              </tr>
              <tr>
                <td>
                  <code>onChange</code>
                </td>
                <td>
                  <code>function</code>
                </td>
                <td>
                  <code>{`() => {}`}</code>
                </td>
                <td>Callback function called when the value changes</td>
              </tr>
              <tr>
                <td>
                  <code>onDragStart</code>
                </td>
                <td>
                  <code>function</code>
                </td>
                <td>
                  <code>{`() => {}`}</code>
                </td>
                <td>Callback function called when dragging begins</td>
              </tr>
              <tr>
                <td>
                  <code>onDragEnd</code>
                </td>
                <td>
                  <code>function</code>
                </td>
                <td>
                  <code>{`() => {}`}</code>
                </td>
                <td>Callback function called when dragging ends</td>
              </tr>
              <tr>
                <td>
                  <code>disablePointerLock</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>When true, disables pointer lock during drag</td>
              </tr>
              <tr>
                <td>
                  <code>modifierKeys</code>
                </td>
                <td>
                  <code>object</code>
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
              <tr>
                <td>
                  <code>children</code>
                </td>
                <td>
                  <code>React.ReactNode</code>
                </td>
                <td>Optional</td>
                <td>The label content to be displayed</td>
              </tr>
              <tr>
                <td>
                  <code>noInput</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>When true, hides the input field</td>
              </tr>
              <tr>
                <td>
                  <code>inputClassName</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>""</code>
                </td>
                <td>Additional CSS class for the input element</td>
              </tr>
              <tr>
                <td>
                  <code>inputStyle</code>
                </td>
                <td>
                  <code>React.CSSProperties</code>
                </td>
                <td>
                  <code>{}</code>
                </td>
                <td>Additional inline styles for the input element</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
