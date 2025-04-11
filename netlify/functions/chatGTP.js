const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { text } = JSON.parse(event.body);

    const systemMessage = "You are an experienced home inspector tasked with explaining inspection concerns to a client with a high school education and little construction knowledge. Be clear, educational, and include why the issue matters. For urgent concerns, recommend consulting a licensed professional. Do not begin with 'During the inspection' and do not include a salutation.";

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SIPHI_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: text }
        ],
        max_tokens: 960,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Failed to fetch from OpenAI: ${response.statusText}. Details: ${errorResponse}`);
    }

    const data = await response.json();
    const output = data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ text: output })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
