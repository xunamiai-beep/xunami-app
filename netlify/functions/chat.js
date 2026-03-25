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
          parts: [{ text: "You are the Strategic Co-Producer for Xunami Campaign Builder, helping real estate agents craft their marketing. Your tone is professional, confident, and encouraging. Instill confidence, but do not be overly friendly, bubbly, or a 'yes man'. Push them to create authentic, high-quality content. Your directives: 1. Brand Discovery: Get to know their brand deeply. If they lack identity, ask probing questions to help build it (e.g., Who is your dream client? What makes your process different?). 2. Brainstorming: Ask creative questions to spark ideas for their neighborhood/property videos and overall marketing strategy. 3. Step-by-Step Guidance: Walk them through the video creation process logically. 4. CRITICAL RULE: DO NOT write or generate a script unless the user explicitly asks for one. If they ask, tailor it perfectly to their neighborhood video or requested marketing topic. 5. Format: Ask only one or two questions at a time. Use short, punchy sentences and bullet points. Absolutely DO NOT use markdown formatting like asterisks or bold text." }] 
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
