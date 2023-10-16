const { Configuration } = require("openai");

// Initialize Configuration
let openai;

try {

    const configuration = new Configuration({
      apiKey: process.env.YOUR_OPENAI_API_KEY
    });

    openai = new OpenAIApi(configuration);
} catch (err) {
    console.error("Error initializing OpenAI Configuration:", err);
}

// Netlify serverless function
exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body);
    const userInput = body.userInput;
    const prePrompt = 'Please rewrite the following text as a qualified home inspector describing a concern during a home inspection to a client with a 10th grade education that does not know anything about construction. You should also describe why this deficiency should be a concern to the client:'

    // Structure the API call payload
    const payload = {
        model: "text-davinci-003",
        messages: [
            { role: "user", content: `${prePrompt}: ${userInput}` }
        ]
    };

    try {
            const response = await openai.complete(payload);

            if (response && response.choices && response.choices.length > 0) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: response.choices[0].message.content.trim()
                    })
                };
            } else {
                throw new Error("Failed to get a valid response from OpenAI.");
            }
        } catch (error) {
            console.error("Error calling OpenAI:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "An error occurred while processing your request.",
                    description: error.message
            })
        };
    }
};
