"""
FastAPI Backend for SQLite Chat Agent
Uses LangChain with OpenAI to query SQLite database via natural language
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="SQLite Chat Agent API")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development #allow_origins=["http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy initialization of SQL Agent
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "data.sqlite")
sql_agent = None


def get_agent():
    """Lazy load the SQL agent"""
    global sql_agent
    if sql_agent is None:
        from agent import SQLAgent
        sql_agent = SQLAgent(DB_PATH)
    return sql_agent


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    sql_query: Optional[str] = None
    raw_result: Optional[str] = None
    success: bool


@app.get("/")
async def root():
    return {"message": "SQLite Chat Agent API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/schema")
async def get_schema():
    """Get the database schema"""
    try:
        agent = get_agent()
        schema = agent.get_schema()
        return {"schema": schema, "success": True}
    except Exception as e:
        return {"schema": f"Error loading schema: {str(e)}", "success": False}


@app.post("/query", response_model=QueryResponse)
async def query_database(request: QueryRequest):
    """Query the database using natural language"""
    try:
        agent = get_agent()
        result = agent.query(request.question)
        return QueryResponse(
            answer=result["answer"],
            sql_query=result.get("sql_query"),
            raw_result=result.get("raw_result"),
            success=True
        )
    except Exception as e:
        return QueryResponse(
            answer=f"Error processing query: {str(e)}",
            success=False
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
