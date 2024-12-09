const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <ul className="sidebar">
        <li>
          <a href="#intro">Introduction</a>
        </li>
        <li>
          <a href="#draggable-number-input">
            <strong>Draggable Number Input</strong>
          </a>
          <ul>
            <li>
              <a href="#draggable-number-input">Examples</a>
            </li>
            <li>
              <a href="#input-installation">Installation</a>
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
              <a href="#label-examples">Examples</a>
            </li>
            <li>
              <a href="#label-installation">Installation</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="https://github.com/yourusername/yourrepo">GitHub Repo</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
