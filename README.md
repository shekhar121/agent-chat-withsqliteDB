# SQLite Chat Agent

A beautiful AI-powered chat interface to query your SQLite database using natural language. Built with React frontend and Python LangChain/OpenAI backend.

![SQLite Chat Agent](https://via.placeholder.com/800x400/0a0e14/58a6ff?text=SQLite+Chat+Agent)

## Demo Video

Watch how to use the SQLite Chat Agent:

https://github.com/user-attachments/assets/72aa1c89-ff62-4c1f-8f27-e2259e2f8517

## Features

- 💬 **Natural Language Queries**: Ask questions about your database in plain English
- 🤖 **AI-Powered SQL Generation**: Uses OpenAI GPT to understand and generate SQL queries
- 📊 **Schema Viewer**: View your database structure at a glance
- 🎨 **Modern Dark UI**: Beautiful terminal-inspired interface with smooth animations
- ⚡ **Real-time Results**: See generated SQL queries and raw data output

## Database Schema

![Database Schema](schema.png)

## Project Structure

```
agent-chat-with-sqliteDB/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── agent.py         # LangChain SQL agent
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main application
│   │   └── index.css    # Global styles
│   ├── package.json     # Node dependencies
│   └── vite.config.js   # Vite configuration
├── db/
│   └── data.sqlite      # Your SQLite database
├── schema.png           # Database schema diagram
├── howto.mp4            # Tutorial video
└── README.md
```

## Prerequisites

- Python 3.14+ (or Python 3.11-3.13 with compatible NumPy versions)
- Node.js 18+
- OpenAI API key

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Upgrade pip, setuptools, and wheel
pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt

# Edit .env file with your OpenAI API key
# The .env file template is already created - just edit it:
# Replace 'your-openai-api-key-here' with your actual OpenAI API key
# Get your API key from: https://platform.openai.com/api-keys
```

**Important:** Always activate the virtual environment before running the backend. You'll know it's activated when you see `(venv)` in your terminal prompt.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Running the Application

**Start the Backend (Terminal 1):**
```bash
cd backend

# IMPORTANT: Activate virtual environment first!
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# You should see (venv) in your terminal prompt
# Run the server
python main.py
# or: python3 main.py
```
The backend will start at http://localhost:8000

**Note:** If you get `ModuleNotFoundError`, make sure the virtual environment is activated. The `(venv)` prefix should appear in your terminal prompt.

**Start the Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
The frontend will start at http://localhost:5173

### 4. Open the Application

Visit **http://localhost:5173** in your browser.

## Usage

1. **Ask Questions**: Type natural language questions about your database in the chat
2. **View Results**: See the AI-generated answer on the left, with SQL query and raw data on the right
3. **Explore Schema**: Click the "Schema" tab to view your database structure

### Example Questions

- "What tables are in this database?"
- "Show me all records from the users table"
- "How many rows are in each table?"
- "What are the column names in the orders table?"
- "Find all users who signed up in the last month"

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | API health status |
| GET | `/schema` | Get database schema |
| POST | `/query` | Query database with natural language |

## Configuration

### Environment Variables

A `.env` file template has been created in the `backend/` directory. **You must edit it** with your actual OpenAI API key:

1. Open `backend/.env` in a text editor
2. Replace `your-openai-api-key-here` with your actual OpenAI API key
3. Save the file

The `.env` file should look like:

```env
OPENAI_API_KEY=sk-proj-abc123xyz...your-actual-key-here
```

**Get your API key from:** https://platform.openai.com/api-keys

**Important:** The `.env` file is already in `.gitignore` so it won't be committed to version control.

### Changing the Database

Replace `db/data.sqlite` with your own SQLite database file. The agent will automatically detect the schema.

## Tech Stack

**Frontend:**
- React 18
- Vite
- Framer Motion
- Axios

**Backend:**
- FastAPI 0.109.0
- LangChain 1.2.4+ (updated for Python 3.14 compatibility)
- OpenAI API (GPT-4)
- SQLAlchemy 2.0+
- Python-dotenv
- NumPy 2.4+ (for Python 3.14)

## Troubleshooting

### Backend won't start
- **ModuleNotFoundError**: Make sure you've activated the virtual environment with `source venv/bin/activate` (macOS/Linux) or `venv\Scripts\activate` (Windows). You should see `(venv)` in your terminal prompt.
- Ensure Python 3.14+ is installed (or Python 3.11-3.13 with compatible packages)
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify your OpenAI API key is valid in the `.env` file

### API Key Error
- **"The api_key client option must be set"**: 
  - Make sure you've edited the `backend/.env` file and replaced `your-openai-api-key-here` with your actual OpenAI API key
  - The API key should start with `sk-` (for OpenAI API keys)
  - Verify the `.env` file is in the `backend/` directory
  - Restart the backend server after updating the `.env` file
  - Get your API key from: https://platform.openai.com/api-keys

### NumPy Build Errors
- If you get NumPy build errors, ensure you're using Python 3.14+ or install NumPy 2.x separately first

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings if using a different port
- Verify no firewall blocking the connection

### No results returned
- Check that your SQLite database exists at `db/data.sqlite`
- Verify the database has tables with data
- Check the console for error messages

## License

MIT License - feel free to use this project for your own purposes.
