
import { useRef, useState } from 'react'
import './App.css'

import Sidebar from './components/Sidebar'
import MessageBubble from './components/MessageBubble'
import ChatInput from './components/ChatInput'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState('')
  const [failedQuestion, setFailedQuestion] = useState('')

  // Prevent overlapping requests.
  const requestInProgress = useRef(false)

  async function sendQuestion(question, isRetry = false) {
    const cleanedQuestion = question.trim()

    if (!cleanedQuestion || requestInProgress.current) {
      return
    }

    requestInProgress.current = true
    setIsThinking(true)
    setError('')

    if (!isRetry) {
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: cleanedQuestion
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        userMessage
      ])

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

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage
      ])

      setFailedQuestion('')
    } catch (err) {
      const errorMessage =
        err instanceof TypeError
          ? 'Could not reach the backend. Check that the server is running.'
          : err.message || 'Something went wrong.'

      setError(errorMessage)
      setFailedQuestion(cleanedQuestion)
    } finally {
      requestInProgress.current = false
      setIsThinking(false)
    }
  }

  function handleSend() {
    sendQuestion(input)
  }

  function handleRetry() {
    if (failedQuestion) {
      sendQuestion(failedQuestion, true)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

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
                  onClick={() =>
                    setInput('Explain binary search in Java')
                  }
                >
                  Explain binary search in Java
                </button>

                <button
                  onClick={() =>
                    setInput(
                      'What is the time complexity of merge sort?'
                    )
                  }
                >
                  Time complexity of merge sort
                </button>

                <button
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

              {isThinking && (
                <p className="thinking-indicator">
                  AlgoMind is waiting for the backend...
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="error-panel" role="alert">
              <p>{error}</p>

              {failedQuestion && (
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
