import { useState } from "react"
import Customer from "./components/Customer.jsx"
import Agent from "./components/Agent.jsx"

function App() {
  const [role, setRole] = useState("")

  if (role === "customer") return <Customer />
  if (role === "agent") return <Agent />

  return (
    <div className="chat-wrapper">
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Chat Support</h1>
          <p style={{ opacity: 0.4, margin: "8px 0 0" }}>Choose your role ...</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "1em 2em" }} onClick={() => setRole("customer")}>
            Customer
          </button>
          <button style={{ padding: "1em 2em" }} onClick={() => setRole("agent")}>
            Agent
          </button>
        </div>
      </div>
    </div>
  )
}

export default App