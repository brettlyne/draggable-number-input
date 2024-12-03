import { useState } from 'react';
import './App.css'
import Sidebar from './components/Sidebar'
import CodePreview from './components/CodePreview'


function App() {

  const [codeMode, setCodeMode] = useState<'react' | 'svelte'>('react');
  const mode = { codeMode, setCodeMode };

  return (
    <>
      <Sidebar />
      <div className="content large">
        <h1>Draggable Number Input</h1>
        <p>
          A <a href="https://react.dev">React</a> and <a href="https://svelte.dev">Svelte</a> component intended to replicate the draggable number input behavior we see in applications like Blender, Figma, and After Effects.
        </p>
        <p>
          Behaviors:
          <ul>
            <li>drag left or right on an input (or <a href="#draggable-number-input-label">label</a>) to set the value</li>
            <li>use up and down arrow keys to increment and decrement</li>
            <li>allow modifier keys to multiply the increment </li>
            <li>provide optional sensitivity setting per modifier key to more easily target  values (ex: in Figma while holding shift you move by 10 and sensitivity is .5)</li>
          </ul>
        </p>

        <h2 id="draggable-number-input">Draggable Number Input</h2>
        <h3 id="input-examples">Example: Default Settings</h3>
        <div className="example">
          <label>
            Barrels of fish:&nbsp;
            <input type="number" />
          </label>
        </div>
        <CodePreview mode={mode} react={`
float size = 1.0; //best 1.0
float offsetIntensity = 5.0; //best 5.0
float rotation = 360.0; //best 360.0
vec2 scale = vec2(1.0, 1.0); // scale x,y independently

float random(in vec2 p)
{ 
      return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}`} svelte={`
float random(in vec2 p)
  float rotation = 360.0; //best 360.0
  float size = 1.0; //best 1.0
  float offsetIntensity = 5.0; //best 5.0
  return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}`} />
      </div>

    </>
  )
}

export default App
