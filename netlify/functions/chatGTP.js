const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { text } = JSON.parse(event.body);

    const prePrompt = "Please rephrase the text below, assuming the role of an experienced home inspector addressing a client with a high school education and limited construction knowledge. Your explanation should not only highlight the concern identified during the home inspection but also serve as an educational insight into why the particular deficiency is a matter of concern. In instances where the concern is urgent, advise the client to consult a licensed professional for further examination and remediation. Please avoid beginning the explanation with 'during the inspection', and aim to enhance the client's understanding of the situation.";
    const fullPrompt = `${prePrompt}\n\n${text}`;

    const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SIPHI_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        max_tokens: 960
      })
    });

    if (!response.ok) {
      const errorResponse = await response.text();  // Get more error details
      throw new Error(`Failed to fetch from OpenAI: ${response.statusText}. Details: ${errorResponse}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ text: data.choices[0].text.trim() })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
