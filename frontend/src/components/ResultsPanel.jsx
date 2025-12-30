import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ResultsPanel.css'

function ResultsPanel({ result, schema }) {
  const [activeTab, setActiveTab] = useState('result')

  return (
    <div className="results-panel">
      <div className="panel-header">
        <div className="panel-tabs">
          <button
            className={`tab ${activeTab === 'result' ? 'active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
            Result
          </button>
          <button
            className={`tab ${activeTab === 'schema' ? 'active' : ''}`}
            onClick={() => setActiveTab('schema')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            Schema
          </button>
        </div>
      </div>

      <div className="panel-content">
        <AnimatePresence mode="wait">
          {activeTab === 'result' ? (
            <motion.div
              key="result"
              className="tab-content"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {result ? (
                <div className="result-display">
                  {result.sql_query && (
                    <div className="result-section">
                      <div className="section-header">
                        <span className="section-icon sql">SQL</span>
                        <span className="section-title">Generated Query</span>
                      </div>
                      <div className="code-block">
                        <pre><code>{result.sql_query}</code></pre>
                      </div>
                    </div>
                  )}

                  {result.raw_result && (
                    <div className="result-section">
                      <div className="section-header">
                        <span className="section-icon data">DATA</span>
                        <span className="section-title">Raw Output</span>
                      </div>
                      <div className="code-block data">
                        <pre><code>{result.raw_result}</code></pre>
                      </div>
                    </div>
                  )}

                  <div className="result-section">
                    <div className="section-header">
                      <span className={`section-icon ${result.success ? 'success' : 'error'}`}>
                        {result.success ? '✓' : '✗'}
                      </span>
                      <span className="section-title">Answer</span>
                    </div>
                    <div className={`answer-block ${!result.success ? 'error' : ''}`}>
                      {result.answer}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <h3>No Results Yet</h3>
                  <p>Ask a question to see the database query results here</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="schema"
              className="tab-content"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {schema ? (
                <div className="schema-display">
                  <div className="section-header">
                    <span className="section-icon schema">DB</span>
                    <span className="section-title">Database Schema</span>
                  </div>
                  <div className="code-block schema">
                    <pre><code>{schema}</code></pre>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon loading">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <h3>Loading Schema...</h3>
                  <p>Fetching database structure from the server</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResultsPanel

