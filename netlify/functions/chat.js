exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    const history = body.history || [];

    // 1. Check for the API Key
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
       return { statusCode: 200, body: JSON.stringify({ reply: "Diagnostic: I cannot find the GEMINI_API_KEY." }) };
    }

    // 2. The EXACT endpoint for the 1.5 Flash model
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    // 3. Package the conversation
    const contents = [...history, { role: "user", parts: [{ text: userMessage }] }];

    // 4. Send to Gemini
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { 
          parts: [{ text: "You are an expert, friendly co-producer for Xunami Campaign Builder helping real estate agents write 15-second video scripts. Be conversational, collaborative, and compliment their good ideas. However, you are the expert: gently guide them away from bad ideas and do not just be a 'yes man'. Ask these 3 questions one at a time naturally: 1. Who is the target buyer? 2. What is the brand tone? 3. What is the best feature of the house? When generating the script or giving advice, use short, easy-to-understand sentences and bullet points. Absolutely DO NOT use markdown formatting like asterisks or bold text. Be ready to revise the script if the client asks for changes." }] 
        },
        contents: contents
      })
    });

    const data = await response.json();

    // 5. Catch any Google errors
    if (data.error) {
       return { statusCode: 200, body: JSON.stringify({ reply: `Diagnostic Gemini Error: ${data.error.message}` }) };
    }

    // 6. Success! Return the AI's answer
    const botReply = data.candidates[0].content.parts[0].text;
    return { statusCode: 200, body: JSON.stringify({ reply: botReply }) };

  } catch (error) {
    return { statusCode: 200, body: JSON.stringify({ reply: `Diagnostic Server Crash: ${error.message}` }) };
  }
};
