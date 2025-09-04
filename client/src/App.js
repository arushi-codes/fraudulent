import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const labelToText = {
    safe: "✅ Safe Message",
    scam: "🚨 Scam Detected",
    spam: "🚨 Spam Message",
    fraud: "🚨 Fraudulent Message",
  };

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/messages/analyze", {
        message,
      });

      console.log("🧪 Raw model response:", response.data);

      const { labels, scores } = response.data;

      if (!labels || !scores || labels.length !== scores.length) {
        throw new Error("Invalid API response format");
      }

      const maxIndex = scores.indexOf(Math.max(...scores));
      const topLabel = labels[maxIndex];
      const topScore = (scores[maxIndex] * 100).toFixed(2);

      setResult({
        label: topLabel,
        confidence: topScore,
      });
      setError("");
    } catch (err) {
      console.error("⚠️ Frontend Error:", err);
      setError("⚠️ Error analyzing the message. Please try again.");
      setResult(null);
    }
  };

  return (
    <div className="App">
      <h1>🛡️ Fraudulent</h1>
      <textarea
        placeholder="Paste a message (SMS, Email, WhatsApp, etc.)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
      />
      <br />
      <button onClick={analyzeMessage}>Analyze</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="results">
          <h2>🧠 Analysis Result:</h2>
          <p>
            <strong>{labelToText[result.label] || result.label}</strong>
          </p>
          <p>
            Label: <code>{result.label}</code>
          </p>
          <p>
            Confidence: <strong>{result.confidence}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
