FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt from the current folder (backend/)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend source files from current folder
COPY . /app/

# Expose the backend port
EXPOSE 8000

# Environment variable
ENV ENV_FILE=/app/.env

# Command to run the backend
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
