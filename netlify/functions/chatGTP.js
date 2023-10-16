import fetch from "node-fetch";

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { userInput } = JSON.parse(event.body);

    const prompt = "Process the following home inspector's comment and provide a clear, concise explanation of the concern, showcasing the inspector's expertise. Ensure that the explanation includes why the subject in the comment is important to a home buyer, all in a way that an average 10th grader without construction knowledge can easily understand:\n\n[Inspector's Comment]: " + userInput;

    const payload = {
        "messages": [{"role": "system", "content": prompt}]
    };

    let response;
    try {
        response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: data.choices[0].message.content })
        };
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        console.log("Incoming event:", event);
        if (response) {
            console.log("OpenAI response:", response);
        }

        return {
            statusCode: 500,
            body: `Internal Server Error: ${error.message}`
        };
    }
};
