/* ============================= */
/* STATE */
/* ============================= */

let chats = JSON.parse(localStorage.getItem("quoteGenieChats")) || [];
let currentChatId = null;

const chatBox = document.getElementById("chat-box");
const chatList = document.getElementById("chat-list");
const input = document.getElementById("user-input");
const deleteBtn = document.querySelector('[title="Delete Chat"]');

/* ============================= */
/* STORAGE */
/* ============================= */

function saveChats() {
    localStorage.setItem("quoteGenieChats", JSON.stringify(chats));
}

/* ============================= */
/* CHAT CREATION */
/* ============================= */

function createNewChat() {
    const newChat = {
        id: Date.now().toString(),
        messages: []
    };

    chats.unshift(newChat); // new chat at top
    currentChatId = newChat.id;

    saveChats();
    renderChats();
    renderMessages();
    updateDeleteVisibility();
}

/* ============================= */
/* SIDEBAR RENDER */
/* ============================= */

function renderChats() {
    chatList.innerHTML = "";

    chats.forEach(chat => {
        const div = document.createElement("div");
        div.classList.add("chat-item");

        if (chat.id === currentChatId) {
            div.classList.add("active");
        }

        div.innerText =
            chat.messages[0]?.text?.slice(0, 25) || "New Chat";

        div.onclick = () => {
            currentChatId = chat.id;
            renderChats();
            renderMessages();
            updateDeleteVisibility();
        };

        chatList.appendChild(div);
    });
}

/* ============================= */
/* MESSAGE RENDER */
/* ============================= */

function renderMessages() {
    chatBox.innerHTML = "";

    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    chat.messages.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("message", msg.sender);
        div.innerText = msg.text;
        chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ============================= */
/* DELETE VISIBILITY */
/* ============================= */

function updateDeleteVisibility() {
    if (!deleteBtn) return;

    deleteBtn.style.display = currentChatId ? "inline-block" : "none";
}

/* ============================= */
/* ADD MESSAGE */
/* ============================= */

function addMessage(text, sender) {
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    chat.messages.push({ text, sender });

    saveChats();
    renderChats(); // update sidebar preview
    renderMessages();
}

/* ============================= */
/* BOT TYPING INDICATOR */
/* ============================= */

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot");
    typingDiv.id = "typing-indicator";
    typingDiv.innerText = "Typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
}

/* ============================= */
/* SEND MESSAGE */
/* ============================= */

function sendMessage() {
    const message = input.value.trim();
    if (!message || !currentChatId) return;

    addMessage(message, "user");
    input.value = "";

    showTyping();

    fetch("https://web-production-a3fed.up.railway.app/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sender: currentChatId,
            message: message
        })
    })
        .then(res => res.json())
        .then(data => {
            removeTyping();

            if (!data.length) {
                addMessage("I didn't understand that. Try asking differently 😊", "bot");
                return;
            }

            data.forEach(botReply => {
                if (botReply.text) {
                    addMessage(botReply.text, "bot");
                }
            });
        })
        .catch(() => {
            removeTyping();
            addMessage("Server error. Please check if Rasa is running.", "bot");
        });
}

/* ============================= */
/* ENTER KEY SUPPORT */
/* ============================= */

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

/* ============================= */
/* DELETE CHAT */
/* ============================= */

function deleteCurrentChat() {
    if (!currentChatId) return;

    const confirmDelete = confirm("Delete this chat permanently?");
    if (!confirmDelete) return;

    chats = chats.filter(chat => chat.id !== currentChatId);

    if (chats.length === 0) {
        createNewChat();
    } else {
        currentChatId = chats[0].id;
    }

    saveChats();
    renderChats();
    renderMessages();
    updateDeleteVisibility();
}

/* ============================= */
/* DARK MODE */
/* ============================= */

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "quoteGenieDark",
        document.body.classList.contains("dark")
    );
}

/* ============================= */
/* INITIALIZATION */
/* ============================= */

function init() {
    // Dark mode restore
    if (localStorage.getItem("quoteGenieDark") === "true") {
        document.body.classList.add("dark");
    }

    if (chats.length === 0) {
        createNewChat();
    } else {
        currentChatId = chats[0].id;
        renderChats();
        renderMessages();
    }

    updateDeleteVisibility();
}

init();