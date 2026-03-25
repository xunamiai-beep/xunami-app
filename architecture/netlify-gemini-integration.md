# SOP: Netlify Serverless Functions + Gemini API Integration

## Goal
Securely embed the "AI Co-Producer" chatbot across all web pages without exposing the Google Gemini API key to the client-side browser, utilizing Netlify's serverless ecosystem.

## Architecture Model
- **Frontend Layer:** Vanilla HTML, CSS, JavaScript (The UI Chat Component).
- **Backend/Middleware:** Netlify Serverless Functions (`netlify/functions/`).
- **Security:** API Keys strictly configured within the Netlify Dashboard Environment Variables.

## Deterministic Data Flow
1. **User Interaction:** The client types into the frontend Chat UI and clicks send.
2. **Intercept:** Local `/assets/` or inline javascript intercepts the client side prompt text.
3. **Internal Routing:** JavaScript calls `fetch('/.netlify/functions/gemini-chat', { method: "POST", body: text })`. 
4. **Serverless Proxy Integration:** The function executing on Netlify servers authenticates via 
   `process.env.GEMINI_API_KEY` and passes the user's prompt directly to Google's generative language endpoints (e.g. `gemini-1.5-pro` or `gemini-2.0-flash`).
5. **Response Delivery:** Gemini returns the data payload to your Netlify function, which then sends `{ reply: "response text" }` back to the browser.
6. **UI Rendering:** The original JavaScript parses the successful fetch data and injects the text into the chat container with a typing animation overlay.

## Error Handling Limits
- If rate limits hit -> Returns `{ error: "Service currently busy. Try again soon." }`
- If API key invalid -> Function logs error locally but returns generic message to client to prevent token exposure.
