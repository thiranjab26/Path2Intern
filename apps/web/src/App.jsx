import { useEffect, useState } from "react";
import { api } from "./services/api";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    api.get("/health")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch(() => {
        setMessage("Backend not reachable");
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Path2Intern</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;