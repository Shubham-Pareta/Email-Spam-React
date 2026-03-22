import { useState } from "react";

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
        confidence: (data.confidence * 100).toFixed(1),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center px-3"
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        backgroundImage: `radial-gradient(circle at 50% -20%, #1e1b4b 0%, #020617 80%)`,
      }}
    >
      <div
        className="card border-0 p-4 p-md-5 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "28px",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
        }}
      >
        <div className="text-center mb-4">
          <div 
            className="mb-3 d-inline-flex align-items-center justify-content-center"
            style={{ 
              width: "64px", height: "64px", 
              backgroundColor: "rgba(99, 102, 241, 0.1)", 
              borderRadius: "20px",
              border: "1px solid rgba(99, 102, 241, 0.2)"
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>⚡</span>
          </div>
          <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-1px" }}>
            AI Email Filter
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Analyze threats in real-time</p>
        </div>

        <div className="mb-4">
          <textarea
            className="form-control border-0 text-white p-3"
            rows="5"
            placeholder="Paste raw email content..."
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "18px",
              resize: "none",
              fontSize: "0.9rem",
              boxShadow: "none",
              outline: "none",
              border: "1px solid #334155"
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn w-100 py-3 fw-bold text-white mb-2"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            borderRadius: "16px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
          }}
          onClick={handleSubmit}
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" />
          ) : (
            "Detect Spam"
          )}
        </button>

        {result && (
          <div
            className="mt-4 p-3 rounded-4"
            style={{
              backgroundColor: result.isSpam ? "rgba(244, 63, 94, 0.1)" : "rgba(16, 185, 129, 0.1)",
              border: `1px solid ${result.isSpam ? "#f43f5e" : "#10b981"}`,
              boxShadow: `0 0 20px ${result.isSpam ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)"}`
            }}
          >
            <div className="d-flex align-items-center">
              <div className="me-3 fs-3">
                {result.isSpam ? "⚠️" : "🛡️"}
              </div>
              <div>
                <h6 className={`mb-0 fw-bold ${result.isSpam ? "text-danger" : "text-success"}`}>
                  {result.isSpam ? "Suspicious Content" : "Verified Clean"}
                </h6>
                <div style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                  System Confidence: <strong>{result.confidence}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailForm;