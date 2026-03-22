import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setResult({
        isSpam: data.prediction === 1,
        confidence: data.confidence * 100,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setEmail("");
    setResult(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Result: ${result.isSpam ? 'Spam' : 'Safe'} (${result.confidence.toFixed(1)}% confidence)`);
    alert("Copied to clipboard!");
  };

  // Helper to determine color based on confidence and type
  const getProgressColor = () => {
    if (result.isSpam) return result.confidence > 80 ? "#f43f5e" : "#fbbf24";
    return "#10b981";
  };

  return (
    <div className="d-flex justify-content-center align-items-center px-3"
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        backgroundImage: `radial-gradient(circle at 50% -20%, #1e1b4b 0%, #020617 80%)`,
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 p-4 p-md-5 shadow-lg"
        style={{ width: "100%", maxWidth: "500px", borderRadius: "28px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}
      >
        <div className="text-center mb-4">
          <div className="mb-3 d-inline-flex align-items-center justify-content-center"
            style={{ width: "64px", height: "64px", backgroundColor: "rgba(99, 102, 241, 0.1)", borderRadius: "20px", border: "1px solid rgba(99, 102, 241, 0.2)" }}
          >
            <span style={{ fontSize: "1.8rem" }}>⚡</span>
          </div>
          <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-1px" }}>AI Email Filter</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Enterprise-grade threat detection</p>
        </div>

        <div className="mb-4 position-relative">
          <textarea
            className="form-control border-0 text-white p-3"
            rows="5"
            placeholder="Paste raw email content here..."
            style={{ backgroundColor: "#1e293b", borderRadius: "18px", resize: "none", fontSize: "0.9rem", border: "1px solid #334155" }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          {email && (
            <button 
              onClick={handleClear}
              className="btn btn-sm position-absolute"
              style={{ top: "10px", right: "10px", color: "#94a3b8", background: "#334155", borderRadius: "8px" }}
            >
              Clear
            </button>
          )}
        </div>

        <button
          className="btn w-100 py-3 fw-bold text-white mb-2"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", borderRadius: "16px", border: "none" }}
          onClick={handleSubmit}
          disabled={isLoading || !email}
        >
          {isLoading ? <div className="spinner-border spinner-border-sm" /> : "Analyze Now"}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-4"
              style={{
                backgroundColor: result.isSpam ? "rgba(244, 63, 94, 0.05)" : "rgba(16, 185, 129, 0.05)",
                border: `1px solid ${result.isSpam ? "#f43f5e33" : "#10b98133"}`,
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <span className="me-2 fs-4">{result.isSpam ? "⚠️" : "🛡️"}</span>
                  <h6 className={`mb-0 fw-bold ${result.isSpam ? "text-danger" : "text-success"}`}>
                    {result.isSpam ? "Spam Detected" : "Verified Safe"}
                  </h6>
                </div>
                <button onClick={copyToClipboard} className="btn btn-sm text-muted p-0 border-0">📋 Copy</button>
              </div>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small text-muted">AI Confidence</span>
                  <span className="small fw-bold text-white">{result.confidence.toFixed(1)}%</span>
                </div>
                <div className="progress" style={{ height: "6px", backgroundColor: "#1e293b", borderRadius: "10px" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    className="progress-bar"
                    style={{ backgroundColor: getProgressColor(), borderRadius: "10px" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default EmailForm;