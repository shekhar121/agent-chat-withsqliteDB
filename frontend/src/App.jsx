import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatWindow from './components/ChatWindow'
import ResultsPanel from './components/ResultsPanel'
import Header from './components/Header'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [currentResult, setCurrentResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [schema, setSchema] = useState(null)

  useEffect(() => {
    // Fetch database schema on load
    fetchSchema()
  }, [])

  const fetchSchema = async () => {
    try {
      const response = await fetch('http://localhost:8000/schema')
      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
      }
    } catch (error) {
      console.error('Failed to fetch schema:', error)
    }
  }

  const sendMessage = async (question) => {
    if (!question.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      })

      const data = await response.json()

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.answer,
        sqlQuery: data.sql_query,
        rawResult: data.raw_result,
        success: data.success,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
      setCurrentResult(data)

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Failed to connect to the server. Please ensure the backend is running on port 8000.\n\nError: ${error.message}`,
        success: false,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setCurrentResult(null)
  }

  return (
    <div className="app">
      <div className="app-background">
        <div className="bg-gradient" />
        <div className="bg-grid" />
      </div>

      <Header onClear={clearChat} messageCount={messages.length} />

      <main className="main-content">
        <motion.div
          className="chat-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          className="results-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ResultsPanel
            result={currentResult}
            schema={schema}
          />
        </motion.div>
      </main>
    </div>
  )
}

export default App

