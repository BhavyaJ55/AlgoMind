
import { useRef, useState } from 'react'
import './App.css'

import Sidebar from './components/sidebar'
import MessageBubble from './components/MessageBubble'
import ChatInput from './components/ChatInput'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Creates a new conversation with a unique ID.
function createConversation() {
  return {
    id: crypto.randomUUID(),
    title: 'New Chat',
    messages: []
  }
}

function App() {
  // Create the initial conversation only once.
  const [initialConversation] = useState(() =>
    createConversation()
  )

  const [conversations, setConversations] = useState(() => [
    initialConversation
  ])

  // The initial conversation is active immediately.
  const [activeConversationId, setActiveConversationId] =
    useState(initialConversation.id)

  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [pendingConversationId, setPendingConversationId] =
    useState(null)

  const [error, setError] = useState(null)
  const [failedQuestion, setFailedQuestion] = useState(null)

  // Prevents multiple simultaneous requests.
  const requestInProgress = useRef(false)

  // Find the conversation currently selected in the sidebar.
  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id === activeConversationId
    ) || conversations[0]

  // Display only the active conversation's messages.
  const messages = activeConversation?.messages || []

  // Start a new conversation, or reuse an empty one.
  function handleNewChat() {
    if (activeConversation?.messages.length === 0) {
      setInput('')
      setError(null)
      setFailedQuestion(null)
      return
    }

    const newConversation = createConversation()

    setConversations((previous) => [
      ...previous,
      newConversation
    ])

    setActiveConversationId(newConversation.id)
    setInput('')
    setError(null)
    setFailedQuestion(null)
  }

  // Switch to a conversation selected from the sidebar.
  function handleSelectConversation(conversationId) {
    setActiveConversationId(conversationId)
    setInput('')
    setError(null)
    setFailedQuestion(null)
  }

  // Send a question to the backend.
  // isRetry prevents adding the same user message twice.
  async function sendQuestion(
    question,
    isRetry = false,
    conversationId = activeConversationId
  ) {
    const cleanedQuestion = question.trim()

    if (!cleanedQuestion || requestInProgress.current) {
      return
    }

    requestInProgress.current = true
    setIsThinking(true)
    setPendingConversationId(conversationId)
    setError(null)

    if (!isRetry) {
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: cleanedQuestion
      }

      setConversations((previous) =>
        previous.map((conversation) => {
          if (conversation.id !== conversationId) {
            return conversation
          }

          const isFirstMessage =
            conversation.messages.length === 0

          return {
            ...conversation,
            title: isFirstMessage
              ? cleanedQuestion.slice(0, 32)
              : conversation.title,
            messages: [
              ...conversation.messages,
              userMessage
            ]
          }
        })
      )

      setInput('')
    }

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: cleanedQuestion
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'The request could not be completed.'
        )
      }

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer
      }

      // Add the answer to the conversation that sent the request,
      // even if the user switches conversations before it returns.
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  assistantMessage
                ]
              }
            : conversation
        )
      )

      setFailedQuestion((previous) =>
        previous?.conversationId === conversationId
          ? null
          : previous
      )

      setError((previous) =>
        previous?.conversationId === conversationId
          ? null
          : previous
      )
    } catch (err) {
      const errorMessage =
        err instanceof TypeError
          ? 'Could not reach the backend. Check that the server is running.'
          : err.message || 'Something went wrong.'

      setError({
        conversationId,
        message: errorMessage
      })

      setFailedQuestion({
        conversationId,
        question: cleanedQuestion
      })
    } finally {
      requestInProgress.current = false
      setIsThinking(false)
      setPendingConversationId(null)
    }
  }

  // Called when the user submits the chat input.
  function handleSend() {
    sendQuestion(input)
  }

  // Retry the failed question in its original conversation.
  function handleRetry() {
    if (
      failedQuestion &&
      failedQuestion.conversationId === activeConversationId
    ) {
      sendQuestion(
        failedQuestion.question,
        true,
        failedQuestion.conversationId
      )
    }
  }

  // Show an error only in the conversation where it occurred.
  const visibleError =
    error?.conversationId === activeConversationId
      ? error.message
      : ''

  const canRetry =
    failedQuestion?.conversationId === activeConversationId

  return (
    <div className="app-layout">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1>AlgoMind</h1>
            <p>Your AI-powered DSA learning companion</p>
          </div>

          <span className="status-indicator">
            API demo mode
          </span>
        </header>

        <section className="messages-area">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">A</div>

              <h2>Think better. Code smarter.</h2>

              <p>
                Ask AlgoMind about algorithms, data structures,
                complexity analysis, or coding problems.
              </p>

              <div className="suggestion-list">
                <button
                  type="button"
                  onClick={() =>
                    setInput('Explain binary search in Java')
                  }
                >
                  Explain binary search in Java
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      'What is the time complexity of merge sort?'
                    )
                  }
                >
                  Time complexity of merge sort
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInput('Give me a hint for Two Sum')
                  }
                >
                  Give me a hint for Two Sum
                </button>
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))}

              {isThinking &&
                pendingConversationId ===
                  activeConversationId && (
                  <p className="thinking-indicator">
                    AlgoMind is waiting for the backend...
                  </p>
                )}
            </div>
          )}

          {visibleError && (
            <div className="error-panel" role="alert">
              <p>{visibleError}</p>

              {canRetry && (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isThinking}
                  className="retry-button"
                >
                  {isThinking ? 'Retrying...' : 'Retry'}
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="chat-footer">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            disabled={isThinking}
          />

          <p className="footer-note">
            Responses currently come from the demo backend,
            not an AI model.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
