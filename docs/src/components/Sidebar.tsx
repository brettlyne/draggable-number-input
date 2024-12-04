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
              <a href="#input-examples">Examples</a>
            </li>
            <li>
              <a href="#input-installation">Installation</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#draggable-number-input-label">
            <strong>Draggable Number Input Label</strong>
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
