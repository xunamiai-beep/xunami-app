exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    const history = body.history || [];

    // 1. Check if the lockbox is empty
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
       return { statusCode: 200, body: JSON.stringify({ reply: "Diagnostic: I cannot find the GEMINI_API_KEY in the Netlify variables." }) };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    const contents = [...history, { role: "user", parts: [{ text: userMessage }] }];

    // 2. Call Gemini
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "You are the Lead Creative Copywriter for Xunami. Ask 3 questions: 1. Target buyer? 2. Brand tone? 3. Best feature? Then write a 15-second vertical script." }] },
        contents: contents
      })
    });

    const data = await response.json();

    // 3. Did Gemini reject the key?
    if (data.error) {
       return { statusCode: 200, body: JSON.stringify({ reply: `Diagnostic Gemini Error: ${data.error.message}` }) };
    }

    // 4. Success!
    const botReply = data.candidates[0].content.parts[0].text;
    return { statusCode: 200, body: JSON.stringify({ reply: botReply }) };

  } catch (error) {
    // 5. Did the server crash?
    return { statusCode: 200, body: JSON.stringify({ reply: `Diagnostic Server Crash: ${error.message}` }) };
  }
};
