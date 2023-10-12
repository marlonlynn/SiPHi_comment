async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const responseElement = document.getElementById("response");

    const payload = {
        "messages": [{"role": "user", "content": userInput}]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        responseElement.innerHTML = data.choices[0].message.content;
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
    }
}
