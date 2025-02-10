const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;

const url = 'https://chatgpt-42.p.rapidapi.com/o3mini';

const options = {
    method: 'POST',
    headers: {
        'x-rapidapi-key': 'da9fc39da6msh1319fe9023ecc72p1ff77ajsnaaaba4e44abf', 
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = `<p>${message}</p>`;
    return chatLi;
};

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    const mentalHealthPrompt = "You are a kind and supportive AI chatbot specializing in mental health support. Respond with empathy, encouragement, and self-care advice. Do not diagnose. User input: ";

    const requestBody = {
        messages: [
            {
                role: 'user',
                content: mentalHealthPrompt + userMessage
            }
        ],
        web_access: false
    };

    options.body = JSON.stringify(requestBody);

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        console.log("API Response:", data);

        if (response.ok) {
            messageElement.textContent = data.result || "I'm here to listen. How are you feeling right now?";
        
        } else {
            messageElement.textContent = "Something went wrong. Please try again!";
            retryRequest(incomingChatLi); 
        }
    } catch (error) {
        messageElement.textContent = "Oops! Something went wrong. Please try again!";
        console.error(error);
        retryRequest(incomingChatLi); 
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatInput.value = ''; 
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleChat();
    }
});


function retryRequest(incomingChatLi) {
    setTimeout(() => {
        generateResponse(incomingChatLi);
    }, 5000); 
}


function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display !== 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}
