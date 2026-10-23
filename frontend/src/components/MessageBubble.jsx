function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-row ${message.role}`}>
      <div className="message-avatar">
        {isUser ? 'You' : 'AI'}
      </div>

      <div className="message-content">
        <p className="message-sender">
          {isUser ? 'You' : 'AlgoMind'}
        </p>

        <div className="message-text">
          {message.content}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble