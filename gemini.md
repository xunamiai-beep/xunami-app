# 🏛️ Project Constitution (The Law)

## 📌 Data Schema
- **Input Shape (Client Context):**
  - Prompt inputs for Gemini Chatbot (`string`).
  - Media/File references from Dropbox API (`list` of URLs/paths).
  - Video marketing product selections (metadata objects).
- **Processed Output Shape (Strategy Output):**
  - Generated Video Marketing Strategy JSON payload.
  - Video content/marketing assets to be displayed in the UI.

## 🤖 Behavioral Rules
1. **Aesthetics & Tone:** High-end, polished dark theme utilizing glass panels (glassmorphism) that feels technologically forward yet approachable to high-end clients.
2. **Functionality:** Gemini chatbot will act as a real-time strategy assistant living locally on the site to help clients work through their video marketing strategy.
3. **Delivery:** The source of truth remains on GitHub, with ongoing deployments (e.g., via Netlify) to a live web environment, ensuring clients have continuous, polished access.

## 🏗️ Architectural Invariants
1. **The "Frontend-First" Rule:** All core logic must be executed via client-side HTML, CSS, and Vanilla JS connecting directly to APIs (REST), bypassing Python or dedicated backend servers.
2. **Security Constraint:** API Keys must NOT be hardcoded into the structural HTML files tracked in GitHub, but rather injected securely or prompted during local test execution.
3. **Self-Annealing (Repair Loop):** Analyze -> Patch -> Test -> Update Architecture `.md`.

## 📓 Maintenance Log
*(To be finalized during Deployment Phase.)*
