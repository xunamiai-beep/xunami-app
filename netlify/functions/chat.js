exports.handler = async function(event, context) {
  // Only allow POST requests from your front-end
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    const history = body.history || []; // Grabs previous chat memory

    // Package the conversation for Gemini
    const contents = [...history, { role: "user", parts: [{ text: userMessage }] }];

    // Reach into the Netlify vault for your API key
    const API_KEY = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Send it to the AI Model
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are the Lead Creative Copywriter for Xunami Campaign Builder. Your job is to write short, punchy, high-converting social media scripts for real estate agents. Keep your answers brief. Ask the user 3 questions, one at a time: 1. Target buyer? 2. Brand tone? 3. Best feature of the house? Once they answer all three, write a 15-second vertical video script. Format it with visual cues in brackets, like [Point camera at kitchen island]. Keep the dialogue extremely natural." }]
        },
        contents: contents
      })
    });

    const data = await response.json();
    const botReply = data.candidates[0].content.parts[0].text;

    // Send the response back to your website
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply })
    };
    
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to connect to the AI." }) };
  }
};
