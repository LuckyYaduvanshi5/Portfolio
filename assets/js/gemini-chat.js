// Initialize Gemini API
const GEMINI_API_KEY = 'AIzaSyA_6HVoLel-jHWaY6vvjkigQpfiMuru-wo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Initialize the chat model
async function initChat() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "You are a helpful AI assistant on Lucky's portfolio website. Keep responses concise and friendly.",
                },
                {
                    role: "model",
                    parts: "I'll be happy to help visitors to Lucky's portfolio website. I'll keep my responses friendly and concise.",
                },
            ],
        });
        return chat;
    } catch (error) {
        console.error('Error initializing chat:', error);
        return null;
    }
}

// Handle sending messages
async function sendMessage(userInput) {
    try {
        if (!userInput.trim()) return; // Don't send empty messages
        
        const chatContainer = document.getElementById('chat-messages');
        
        // Clear input
        document.getElementById('user-input').value = '';

        // Add user message to chat
        appendMessage('user', userInput);

        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.textContent = 'AI is thinking...';
        chatContainer.appendChild(loadingDiv);

        // Prepare the request
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userInput
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();

        // Remove loading indicator
        loadingDiv.remove();

        // Check for errors
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to get response');
        }

        // Get the response text
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Add AI response to chat
        appendMessage('ai', aiResponse);

    } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('system', 'Sorry, there was an error processing your request.');
    }
}

// Append message to chat container
function appendMessage(role, content) {
    const chatContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.innerHTML = role === 'user' ? '<i class="icon ion-person"></i>' : '<i class="icon ion-android-bulb"></i>';
    
    const contentP = document.createElement('p');
    contentP.textContent = content;
    
    messageDiv.appendChild(iconSpan);
    messageDiv.appendChild(contentP);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Add notification effect if chat is minimized and message is from AI
    if (role === 'ai' && document.querySelector('.chat-body').style.display === 'none') {
        document.querySelector('.chat-header').classList.add('new-message');
    }
}

// Toggle chat widget
function toggleChat() {
    const chatWidget = document.querySelector('.chat-widget');
    const isVisible = chatWidget.style.display !== 'none';
    
    if (isVisible) {
        chatWidget.style.display = 'none';
        chatWidget.classList.remove('active');
    } else {
        chatWidget.style.display = 'block';
        setTimeout(() => chatWidget.classList.add('active'), 10);
    }
}

// Clear input after sending
function clearInput() {
    document.getElementById('user-input').value = '';
}

// Add click outside listener
document.addEventListener('click', function(event) {
    const chatWidget = document.querySelector('.chat-widget');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    
    if (!chatWidget.contains(event.target) && 
        !chatToggleBtn.contains(event.target) && 
        chatWidget.style.display !== 'none') {
        toggleChat();
    }
});

// Initialize chat on load
document.addEventListener('DOMContentLoaded', () => {
    // Add welcome message
    appendMessage('ai', 'Hi! I\'m your AI assistant. How can I help you today?');
    
    // Add enter key listener
    const input = document.getElementById('user-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const userInput = input.value;
            if (userInput.trim()) {
                sendMessage(userInput);
            }
        }
    });
}); 