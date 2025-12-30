"""
SQL Agent for querying SQLite database using OpenAI
"""

import os
import re
import sqlite3
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage


class SQLAgent:
    def __init__(self, db_path: str):
        """Initialize the SQL Agent with the database path"""
        self.db_path = db_path

        # Initialize OpenAI LLM
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )

    def get_schema(self) -> str:
        """Get the database schema information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        schema_info = []
        for table in tables:
            table_name = table[0]
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()

            col_info = []
            for col in columns:
                col_info.append(f"  {col[1]} ({col[2]})")

            schema_info.append(f"Table: {table_name}\n" + "\n".join(col_info))

        conn.close()
        return "\n\n".join(schema_info)

    def _get_tables(self) -> list:
        """Get list of table names"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [t[0] for t in cursor.fetchall()]
        conn.close()
        return tables

    def _execute_sql(self, sql_query: str) -> str:
        """Execute SQL query and return results as string"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        try:
            cursor.execute(sql_query)
            results = cursor.fetchall()

            if not results:
                return "No results found."

            # Get column names
            columns = [description[0] for description in cursor.description]

            # Format results
            output = []
            output.append(" | ".join(columns))
            output.append("-" * len(output[0]))

            for row in results[:50]:  # Limit to 50 rows for display
                output.append(" | ".join(str(val) for val in row))

            if len(results) > 50:
                output.append(f"... and {len(results) - 50} more rows")

            return "\n".join(output)

        finally:
            conn.close()

    def _fix_quotes(self, sql: str) -> str:
        """Fix smart quotes and other quote issues in SQL"""
        sql = sql.replace(''', "'").replace(''', "'")
        sql = sql.replace('"', '"').replace('"', '"')
        sql = sql.replace('`', "'")
        return sql

    def _is_schema_question(self, question: str) -> bool:
        """Check if the question is about database schema/structure"""
        q = question.lower()
        keywords = ['table', 'schema', 'structure', 'database', 'columns', 'fields', 'describe']
        action_words = ['what', 'list', 'show', 'get', 'display', 'tell', 'give']

        has_keyword = any(k in q for k in keywords)
        has_action = any(a in q for a in action_words)

        return has_keyword and has_action and 'from' not in q

    def query(self, question: str) -> dict:
        """
        Query the database using natural language
        Returns the answer, SQL query used, and raw results
        """
        try:
            tables = self._get_tables()
            schema = self.get_schema()

            # Handle schema/table questions directly
            if self._is_schema_question(question):
                sql_query = "SELECT name FROM sqlite_master WHERE type='table'"
                raw_result = self._execute_sql(sql_query)

                answer = f"The database contains {len(tables)} tables:\n\n"
                for t in tables:
                    answer += f"• {t}\n"
                answer += f"\nYou can ask about any of these tables, like 'Show me 5 rows from {tables[0]}'"

                return {
                    "answer": answer,
                    "sql_query": sql_query,
                    "raw_result": raw_result
                }

            # Generate SQL using LLM
            system_msg = f"""You are a SQLite query generator. Output ONLY a valid SQL query.

Tables: {', '.join(tables)}

Schema:
{schema}

Rules:
- Output only the SQL query, nothing else
- Use SELECT * or list specific columns
- Use single quotes for strings
- Limit to 10 rows unless asked otherwise"""

            messages = [
                SystemMessage(content=system_msg),
                HumanMessage(content=question)
            ]

            sql_response = self.llm.invoke(messages)
            sql_query = sql_response.content.strip()

            # Clean up the query
            sql_query = re.sub(r'^```sql\s*', '', sql_query, flags=re.IGNORECASE)
            sql_query = re.sub(r'^```\s*', '', sql_query)
            sql_query = re.sub(r'\s*```$', '', sql_query)
            sql_query = sql_query.strip().strip('"').strip("'")
            sql_query = self._fix_quotes(sql_query)

            # Validate it looks like SQL
            if not sql_query.upper().startswith('SELECT'):
                # If LLM didn't generate valid SQL, try a simple query
                if tables:
                    sql_query = f"SELECT * FROM {tables[0]} LIMIT 5"

            # Execute the query
            try:
                raw_result = self._execute_sql(sql_query)
                success = True
            except Exception as exec_error:
                raw_result = f"Error: {str(exec_error)}"
                success = False

            # Generate natural language answer
            answer_system = "Summarize the database results in 1-2 sentences. Be concise."
            answer_human = f"Question: {question}\nResults:\n{raw_result}"

            answer_response = self.llm.invoke([
                SystemMessage(content=answer_system),
                HumanMessage(content=answer_human)
            ])

            return {
                "answer": answer_response.content,
                "sql_query": sql_query,
                "raw_result": raw_result
            }

        except Exception as e:
            raise Exception(f"Error querying database: {str(e)}")


if __name__ == "__main__":
    import sys

    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "data.sqlite")

    if not os.path.exists(db_path):
        print(f"Database not found at: {db_path}")
        sys.exit(1)

    agent = SQLAgent(db_path)
    print("Database Schema:")
    print(agent.get_schema())
    print("\n" + "="*50 + "\n")

    test_question = "What tables are in this database?"
    print(f"Question: {test_question}")
    result = agent.query(test_question)
    print(f"SQL: {result['sql_query']}")
    print(f"Answer: {result['answer']}")
