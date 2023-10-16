async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const responseElement = document.getElementById("response");

    const payload = {
        userInput: userInput
    };

    try {
        const response = await fetch("/.netlify/functions/chatGTP", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if(data && data.message) {
            responseElement.value = data.message;
        } else if (data && data.error) {  // Check for an error field in the response.
            responseElement.value = "Error: " + data.error;
        } else {
            console.error("Unexpected response format:", JSON.stringify(data, null, 2));
            responseElement.value = "An unexpected error occurred.";
        }

    } catch (error) {
        console.error("Error communicating with the function:", error);
        responseElement.value = "Communication error: " + error.message;
    }
}

function copyToClipboard() {
    const responseElement = document.getElementById("response");
    responseElement.select();
    document.execCommand('copy');
}