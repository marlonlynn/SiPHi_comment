async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const responseElement = document.getElementById("response");

    // Construct the detailed prompt with the user's input embedded
    const prompt = "Process the following home inspector's comment and provide a clear, concise explanation of the concern, showcasing the inspector's expertise. Ensure that the explanation includes why the subject in the comment is important to a home buyer, all in a way that an average 10th grader without construction knowledge can easily understand:\n\n[Inspector's Comment]: " + userInput;

    const payload = {
        "messages": [{"role": "system", "content": prompt}]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        responseElement.value = data.choices[0].message.content; // Set the response in the textarea
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
    }
}

function copyToClipboard() {
    const responseElement = document.getElementById("response");
    responseElement.select();
    document.execCommand('copy');
}
