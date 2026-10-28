
function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation
}) {
  return (
    <aside className="sidebar">
      <h2 className="brand">AlgoMind</h2>

      <button
        className="new-chat-button"
        onClick={onNewChat}
      >
        + New Chat
      </button>

      <div className="sidebar-section">
        <p className="sidebar-label">YOUR CONVERSATIONS</p>

        <div className="conversation-list">
          {conversations
            .slice()
            .reverse()
            .map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`sidebar-link ${
                  conversation.id === activeConversationId
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  onSelectConversation(conversation.id)
                }
                title={conversation.title}
              >
                {conversation.title}
              </button>
            ))}
        </div>
      </div>

      <div className="sidebar-footer">
        Your AI DSA companion
      </div>
    </aside>
  )
}

export default Sidebar
