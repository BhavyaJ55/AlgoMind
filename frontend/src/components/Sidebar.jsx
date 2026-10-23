function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="brand">AlgoMind</h2>

      <button className="new-chat-button">
        + New Chat
      </button>

      <div className="sidebar-section">
        <p className="sidebar-label">YOUR LEARNING</p>
        <button className="sidebar-link">DSA Practice</button>
        <button className="sidebar-link">Algorithms</button>
        <button className="sidebar-link">Data Structures</button>
      </div>

      <div className="sidebar-footer">
        Your AI DSA companion
      </div>
    </aside>
  )
}

export default Sidebar