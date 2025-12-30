import { motion } from 'framer-motion'
import './Header.css'

function Header({ onClear, messageCount }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <motion.div
            className="logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <div className="logo-text">
              <h1>SQLite Chat</h1>
              <span className="logo-subtitle">AI-Powered Database Query Agent</span>
            </div>
          </motion.div>
        </div>

        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot" />
            <span>Connected</span>
          </div>

          {messageCount > 0 && (
            <motion.button
              className="clear-btn"
              onClick={onClear}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
              </svg>
              Clear Chat
            </motion.button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

