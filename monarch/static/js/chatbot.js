class MonasteryChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = this.getMonasteryResponses();
        this.init();
    }

    init() {
        this.bindEvents();
        this.hideBadgeAfterDelay();
    }

    bindEvents() {
        // Toggle chatbot
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        toggle?.addEventListener('click', () => this.toggleChatbot());
        close?.addEventListener('click', () => this.closeChatbot());
        sendBtn?.addEventListener('click', () => this.sendMessage());
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Auto-resize input
        input?.addEventListener('input', (e) => {
            this.updateSendButtonState();
        });

        this.updateSendButtonState();
    }

    toggleChatbot() {
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        const badge = document.getElementById('chatbot-badge');

        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.isOpen = true;
            toggle.classList.add('active');
            window.classList.add('active');
            badge.style.display = 'none';
            
            // Focus input after opening
            setTimeout(() => {
                document.getElementById('chatbot-input')?.focus();
            }, 300);
        }
    }

    closeChatbot() {
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');

        this.isOpen = false;
        toggle.classList.remove('active');
        window.classList.remove('active');
    }

    hideBadgeAfterDelay() {
        setTimeout(() => {
            const badge = document.getElementById('chatbot-badge');
            if (badge && !this.isOpen) {
                badge.style.display = 'none';
            }
        }, 5000);
    }

    updateSendButtonState() {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        
        if (input && sendBtn) {
            sendBtn.disabled = !input.value.trim();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input?.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        this.updateSendButtonState();

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate delay for more natural conversation
        await this.delay(1000 + Math.random() * 1000);

        // Hide typing indicator and show response
        this.hideTypingIndicator();
        const response = this.getResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message message-enter`;

        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-avatar">U</div>
                <div class="message-content">
                    <p>${this.escapeHtml(content)}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="/static/images/logo.jpeg" alt="Bot">
                </div>
                <div class="message-content">
                    <p>${content}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Remove animation class after animation completes
        setTimeout(() => {
            messageDiv.classList.remove('message-enter');
        }, 300);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="/static/images/logo.jpeg" alt="Bot">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific keywords and return appropriate response
        for (const [keywords, response] of Object.entries(this.responses)) {
            const keywordList = keywords.split(',');
            if (keywordList.some(keyword => lowerMessage.includes(keyword.trim()))) {
                return Array.isArray(response) ? response[Math.floor(Math.random() * response.length)] : response;
            }
        }

        // Default responses for unmatched queries
        const defaultResponses = [
            "🙏 Thank you for your question! For specific information, I recommend contacting our monastery guides directly or exploring our virtual tours.",
            "That's an interesting question! You can find more detailed information in our digital archives or by booking a guided tour.",
            "I'd be happy to help you explore more about Sikkim's monasteries. Try asking about specific monasteries, festivals, or visiting hours!",
            "For the most accurate information about that topic, please visit our interactive map or contact the monastery directly."
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    getMonasteryResponses() {
        return {
            // Greetings
            'hello,hi,namaste,good morning,good afternoon': [
                "🙏 Namaste! Welcome to Monastery360. I'm here to help you explore Sikkim's sacred monasteries. What would you like to know?",
                "Hello! I'm your monastery guide. Ask me about Rumtek, Pemayangtse, Tashiding, or any other aspects of your visit!",
                "🏯 Greetings! Ready to discover the spiritual heritage of Sikkim? How can I assist your journey?"
            ],

            // Rumtek Monastery
            'rumtek,rumtek monastery': [
                "🏛️ <strong>Rumtek Monastery</strong> is one of the most significant Buddhist monasteries in Sikkim. Built in the 1960s, it's the seat of the Karmapa. <br><br>📍 <strong>Location:</strong> 24 km from Gangtok<br>🕐 <strong>Timings:</strong> 6:00 AM - 6:00 PM<br>🎯 <strong>Highlights:</strong> Golden Stupa, Shrine Hall, Traditional Architecture<br><br>Would you like to book a virtual tour or get directions?",
                "Rumtek Monastery, also known as the 'Dharmachakra Centre', houses precious artifacts and Buddhist scriptures. The monastery hosts important Buddhist festivals and offers meditation sessions. Best visited early morning for peaceful experience."
            ],

            // Pemayangtse Monastery
            'pemayangtse,pemayangtse monastery': [
                "🌸 <strong>Pemayangtse Monastery</strong> means 'Perfect Sublime Lotus' - one of Sikkim's oldest monasteries (1705). <br><br>📍 <strong>Location:</strong> Pelling, West Sikkim<br>🕐 <strong>Timings:</strong> 7:00 AM - 5:00 PM<br>🎯 <strong>Highlights:</strong> 7-tiered wooden sculpture, ancient murals, panoramic Himalayan views<br><br>The monastery offers stunning views of Kanchenjunga!"
            ],

            // Tashiding Monastery
            'tashiding,tashiding monastery': [
                "⛰️ <strong>Tashiding Monastery</strong> - 'The Devoted Central Glory' sits atop a hill between two rivers. <br><br>📍 <strong>Location:</strong> Tashiding, West Sikkim<br>🕐 <strong>Timings:</strong> 6:00 AM - 6:00 PM<br>🎯 <strong>Highlights:</strong> Sacred Bumchu ceremony, holy chortens, spiritual significance<br><br>Legend says even seeing this monastery purifies sins!"
            ],

            // Virtual Tours
            'virtual tour,360,virtual reality,online tour': [
                "🌐 Our <strong>Virtual Tours</strong> offer immersive 360° experiences! <br><br>✨ Available Tours:<br>• Rumtek Monastery (15 min)<br>• Pemayangtse Monastery (12 min)<br>• Tashiding Monastery (18 min)<br><br>🎧 Features: Interactive hotspots, audio narration, historical insights<br><br><a href='/virtual/' style='color: #1e3c72;'>Start Virtual Tour →</a>"
            ],

            // Booking
            'book,booking,visit,reservation': [
                "📅 <strong>Booking Your Visit:</strong><br><br>🎟️ <strong>Available Options:</strong><br>• Virtual Tours (Free)<br>• Guided Tours (₹500-1000)<br>• Meditation Sessions<br>• Festival Participation<br>• Accommodation<br><br>📱 <strong>How to book:</strong> Use our booking form on the homepage or contact monasteries directly.<br><br>Would you like help with a specific type of booking?"
            ],

            // Timings & Hours
            'timing,hours,time,open,close': [
                "🕐 <strong>Monastery Timings:</strong><br><br>🏛️ <strong>Rumtek:</strong> 6:00 AM - 6:00 PM<br>🌸 <strong>Pemayangtse:</strong> 7:00 AM - 5:00 PM<br>⛰️ <strong>Tashiding:</strong> 6:00 AM - 6:00 PM<br><br>📝 <strong>Note:</strong> Prayer timings may vary. Best to visit during morning prayers (6-8 AM) for authentic experience!"
            ],

            // Festivals
            'festival,celebration,event,losar,buddha jayanti': [
                "🎉 <strong>Major Monastery Festivals:</strong><br><br>🌙 <strong>Losar</strong> (Feb/Mar) - Tibetan New Year<br>🙏 <strong>Buddha Jayanti</strong> (May) - Buddha's Birthday<br>🎭 <strong>Hemis Festival</strong> (June/July)<br>🌾 <strong>Drupka Teshi</strong> (August)<br>💧 <strong>Bumchu Festival</strong> - Tashiding (Feb/Mar)<br><br><a href='/calendar/' style='color: #1e3c72;'>View Festival Calendar →</a>"
            ],

            // Directions & Transportation
            'direction,how to reach,transport,bus,taxi': [
                "🚌 <strong>How to Reach Monasteries:</strong><br><br>🏛️ <strong>Rumtek:</strong> 24km from Gangtok, shared taxis available<br>🌸 <strong>Pemayangtse:</strong> 2km from Pelling, walkable or local taxi<br>⛰️ <strong>Tashiding:</strong> 40km from Pelling, bus + 30min walk<br><br>🚕 <strong>Transport Options:</strong><br>• Shared taxis (₹30-50)<br>• Private taxi (₹800-1500)<br>• Local buses<br><br><a href='/map/' style='color: #1e3c72;'>View Interactive Map →</a>"
            ],

            // Photography
            'photo,camera,photography,picture': [
                "📸 <strong>Photography Guidelines:</strong><br><br>✅ <strong>Allowed:</strong> Exterior architecture, landscapes, courtyards<br>❌ <strong>Not Allowed:</strong> Inside prayer halls, religious artifacts, monks during prayers<br><br>📱 <strong>Tips:</strong><br>• Ask permission before photographing people<br>• Respect 'No Photography' signs<br>• Best light: Early morning or late afternoon<br>• Silent mode during prayers<br><br>Remember: Monasteries are sacred spaces! 🙏"
            ],

            // Dress Code & Rules
            'dress code,rules,behavior,etiquette': [
                "👔 <strong>Monastery Etiquette:</strong><br><br>👕 <strong>Dress Code:</strong><br>• Modest clothing (cover shoulders & legs)<br>• Remove shoes before entering halls<br>• Avoid revealing or tight clothing<br><br>🤫 <strong>Behavior:</strong><br>• Maintain silence in prayer areas<br>• Walk clockwise around stupas<br>• Don't touch religious artifacts<br>• Turn off mobile phones<br><br>Respect creates positive karma! 🙏"
            ],

            // History
            'history,ancient,old,heritage': [
                "📜 <strong>Monastery History:</strong><br><br>🏛️ <strong>Rumtek</strong> (1960s) - Rebuilt as Karmapa's seat<br>🌸 <strong>Pemayangtse</strong> (1705) - One of Sikkim's oldest<br>⛰️ <strong>Tashiding</strong> (1641) - Built by Ngadak Sempa Chembo<br><br>These monasteries preserve centuries of Buddhist wisdom, art, and culture. Each has unique stories of spiritual masters and miraculous events!<br><br><a href='/archive/' style='color: #1e3c72;'>Explore Digital Archives →</a>"
            ],

            // Accommodation
            'stay,hotel,accommodation,lodge': [
                "🏨 <strong>Accommodation Near Monasteries:</strong><br><br>🏛️ <strong>Near Rumtek:</strong> Gangtok hotels (5-star to budget)<br>🌸 <strong>Near Pemayangtse:</strong> Pelling resorts with mountain views<br>⛰️ <strong>Near Tashiding:</strong> Homestays and guesthouses<br><br>💡 <strong>Recommendations:</strong><br>• Book early during festival seasons<br>• Try authentic Sikkimese homestays<br>• Mountain view rooms cost extra but worth it!<br><br>Would you like specific hotel recommendations?"
            ],

            // Food
            'food,restaurant,meal,eat': [
                "🍜 <strong>Local Cuisine Near Monasteries:</strong><br><br>🥟 <strong>Must Try:</strong><br>• Momos (Tibetan dumplings)<br>• Thukpa (noodle soup)<br>• Gundruk (fermented leafy greens)<br>• Sinki (fermented radish)<br>• Sel Roti (traditional bread)<br><br>🍵 Don't miss butter tea (Po Cha) and Chang (millet beer)!<br><br>Many monasteries serve simple vegetarian meals to visitors during festivals."
            ],

            // Weather
            'weather,climate,temperature,best time': [
                "🌤️ <strong>Best Time to Visit:</strong><br><br>🌸 <strong>March-May:</strong> Pleasant weather, rhododendrons bloom<br>🌞 <strong>June-September:</strong> Monsoon, fewer crowds but scenic<br>🍂 <strong>October-November:</strong> Clear mountain views, festivals<br>🌨️ <strong>December-February:</strong> Cold but spiritual atmosphere<br><br>📌 <strong>Tip:</strong> Carry warm clothes even in summer - mountain weather changes quickly!"
            ],

            // Thank you / Goodbye
            'thank,thanks,bye,goodbye': [
                "🙏 You're most welcome! May your monastery journey bring peace and spiritual insights. Feel free to ask anytime you need guidance!",
                "Thank you for visiting Monastery360! Wishing you a blessed and enlightening experience. Tashi Delek! 🙏",
                "Goodbye and safe travels! Remember, the monasteries of Sikkim welcome you with open hearts. Until next time! 🏔️"
            ],

            // Help
            'help,what can you do,features': [
                "🤖 <strong>I can help you with:</strong><br><br>🏛️ Monastery information (Rumtek, Pemayangtse, Tashiding)<br>🌐 Virtual tour guidance<br>📅 Festival calendar & events<br>🎯 Booking assistance<br>🗺️ Directions & transportation<br>📸 Photography guidelines<br>👔 Etiquette & dress codes<br>🏨 Accommodation recommendations<br>🍜 Local cuisine suggestions<br>🌤️ Weather & best visiting times<br><br>Just ask me anything about your monastery visit! 🙏"
            ]
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Quick message function for buttons
function sendQuickMessage(message) {
    const input = document.getElementById('chatbot-input');
    if (input) {
        input.value = message;
        if (window.chatbot) {
            window.chatbot.sendMessage();
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('chatbot-container')) {
        window.chatbot = new MonasteryChatbot();
    }
});