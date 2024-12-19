const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <ul className="sidebar">
        <li>
          <a href="#intro">
            <strong>Introduction</strong>
          </a>
        </li>
        <li>
          <a href="#installation">
            <strong>Installation</strong>
          </a>
        </li>
        <li>
          <a href="#draggable-number-input">
            <strong>Draggable Number Input</strong>
          </a>
          <ul>
            <li>
              <a href="#draggable-number-input">Examples</a>
              <ul className="example-list">
                <li>
                  <a href="#draggable-ex-basic">Basic example</a>
                </li>
                <li>
                  <a href="#draggable-ex-no-pointer-lock">No pointer lock</a>
                </li>
                <li>
                  <a href="#draggable-ex-custom-modifier-keys">
                    Custom modifier keys
                  </a>
                </li>
                <li>
                  <a href="#draggable-ex-drag-events">
                    Drag start and end events
                  </a>
                </li>
                <li>
                  <a href="#draggable-ex-custom-styles">
                    Custom styles on drag
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#input-api">API</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#draggable-label-number-input">
            <strong>Draggable Label Number Input</strong>
          </a>
          <ul>
            <li>
              <a href="#draggable-label-number-input">Examples</a>
              <ul className="example-list">
                <li>
                  <a href="#label-ex-basic">Basic example</a>
                </li>
                <li>
                  <a href="#label-ex-no-pointer-lock">No pointer lock</a>
                </li>
                <li>
                  <a href="#label-ex-custom-modifier-keys">
                    Custom modifier keys
                  </a>
                </li>
                <li>
                  <a href="#label-ex-drag-events">Drag start and end events</a>
                </li>
                <li>
                  <a href="#label-ex-no-input">Label with no input</a>
                </li>
                <li>
                  <a href="#label-ex-custom-styles">Custom styles on drag</a>
                </li>
                <li>
                  <a href="#label-ex-custom-input-styles">
                    Custom input styles
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#label-api">API</a>
            </li>
          </ul>
        </li>
        <li>
          <a
            href="https://github.com/brettlyne/draggable-number-input"
            target="_blank"
            rel="noreferrer"
          >
            <strong>GitHub Repo</strong>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
