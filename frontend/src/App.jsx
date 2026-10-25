
import { useState } from 'react'
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

  async function handleSend() {
    const question = input.trim()

    if (!question || isThinking) {
      return
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage
    ])

    setInput('')
    setError('')
    setIsThinking(true)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'The request could not be completed.'
        )
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage
      ])
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Could not reach the backend. Check that the server is running.'
          : err.message || 'Something went wrong.'
      )
    } finally {
      setIsThinking(false)
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
            Backend connected
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
            <p className="error-message" role="alert">
              {error}
            </p>
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
