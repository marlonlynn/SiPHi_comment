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

        // Check if the response was successful.
        if (response.ok) {
            if (data && data.message) {
                responseElement.value = data.message;
            } else {
                // Case: Successful response but unexpected format.
                responseElement.value = "Received an unexpected response format.";
            }
        } else {
            // Case: Server returned an error.
            let errorMessage = "An error occurred while processing your request.";
            if (data && data.error) {
                errorMessage += " " + data.error;
            }
            responseElement.value = errorMessage;
        }

    } catch (error) {
        // Case: Network or other errors.
        responseElement.value = "Error communicating with the server: " + error.message;
        console.error("Error communicating with the function:", error);
    }
}

function copyToClipboard() {
    const responseElement = document.getElementById("response");
    responseElement.select();
    document.execCommand('copy');
}