import React, { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
      });

      // const res = {
      //   json: async () => ({
      //     score: 84,
      //     missingKeywords: ["Docker", "Kubernetes", "CI/CD"],
      //     suggestions: [
      //       "Include more cloud-related experience.",
      //       "Highlight agile methodologies.",
      //       "Mention containerization tools."
      //     ],
      //   })
      // };

      const data = await res.json();

      const formatted = `
      ✅ Match Score: ${data.score}%
      🔍 Missing Keywords: ${data.missingKeywords.map((kw) => `- ${kw}`).join("\n")}
      💡 Suggestions: ${data.suggestions.map((s) => `- ${s}`).join("\n")}
      `;

      setOutput(formatted || "No result returned");
    } catch (err) {
      console.error(err);
      setOutput("Error connecting to backend.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>🧠 JobMatchAI</h1>

      <label>📄 Paste Resume</label>
      <textarea
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        rows="8"
        style={{ width: "100%", marginBottom: "1rem" }}
        placeholder="Paste your resume here..."
      />

      <label>📝 Paste Job Description</label>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows="8"
        style={{ width: "100%", marginBottom: "1rem" }}
        placeholder="Paste job description here..."
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "0.6rem 1.2rem",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        {loading ? "Analyzing..." : "Match Now 🚀"}
      </button>

      {output && (
        <div
          style={{
            marginTop: "2rem",
            whiteSpace: "pre-wrap",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "5px",
          }}
        >
          <h3>🧾 Match Result</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}

export default App;
