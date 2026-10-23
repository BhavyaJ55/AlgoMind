function ChatInput({
  input,
  setInput,
  onSend,
  disabled
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSend()
  }

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Ask a DSA question..."
        aria-label="Ask a DSA question"
        disabled={disabled}
      />

      <button
        type="submit"
        disabled={disabled || !input.trim()}
      >
        Send
      </button>
    </form>
  )
}
 
export default ChatInput