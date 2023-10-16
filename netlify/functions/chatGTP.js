const fetch = require('node-fetch');

const API_KEY = 'YOUR_OPENAI_API_KEY';
const URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
const PROMPT_TEXT = "Please rewrite the following text as a qualified home inspector describing a concern during a home inspection to a client with a 10th grade education that does not know anything about construction. You should also describe why this deficiency should be a concern to the client:";

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const requestBody = JSON.parse(event.body);
    const textToAnalyze = `${PROMPT_TEXT} ${requestBody.userInput}`;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + API_KEY,
                'OpenAI-Organization': 'org-syQpbq1CgeDtHJWdRpujl1gf',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: textToAnalyze,
                max_tokens: 1800
            })
        });

        const data = await response.json();

        if (response.ok) {
            const completion = data.choices[0].text;
            return {
                statusCode: 200,
                body: JSON.stringify({ text: completion })
            };
        } else {
            return {
                statusCode: response.status,
                body: JSON.stringify(data)
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error: ' + error.toString()
        };
    }
};
