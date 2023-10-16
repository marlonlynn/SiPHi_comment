const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { text } = JSON.parse(event.body);

  const prePrompt = "Please rewrite the following text as a qualified home inspector describing a concern during a home inspection to a client with a 10th grade education that does not know anything about construction. You should also describe why this deficiency should be a concern to the client.";
  const fullPrompt = `${prePrompt}\n\n${text}`;

  const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.YOUR_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-davinci-003',  // Specify the model to be used here
      prompt: fullPrompt,
      max_tokens: 1200
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify({ text: data.choices[0].text.trim() })
  };
};
