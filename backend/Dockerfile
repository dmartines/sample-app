FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the application with uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5001"] 