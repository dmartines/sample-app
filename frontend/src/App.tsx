import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const callApi = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/api/hello');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error calling API');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>API Test Page</h1>
      
      <div className="card">
        <button
          onClick={callApi}
          disabled={isLoading}
          className="button"
        >
          {isLoading ? 'Loading...' : 'Call API'}
        </button>

        {message && (
          <div className="message-box">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
