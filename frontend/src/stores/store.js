import { defineStore } from 'pinia';


export const useStore = defineStore({
    id: 'store',
    state: () => ({
        messages: [],
        turnToTalk: 'user',
        lastBotMessage: '',
    }),

    actions: {
        async clearMessages() {
            this.messages = [];
            this.turnToTalk = 'user';
            this.lastBotMessage = '';

            const url = import.meta.env.VITE_FLOWISE_API + import.meta.env.VITE_FLOWISE_ENDPOINT_CHATMESSAGE +import.meta.env.VITE_CHATFLOW_ID;
            const token = import.meta.env.VITE_FLOWISE_TOKEN;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                  "Authorization": token
                },
            });
            const data = await response.json();
            return data;
        },
        addMessage(from, content, time) {
            this.messages.push({
                from,
                content,
                time,
            });
        },

        async sendMessage(data) {
            const url = `${import.meta.env.VITE_FLOWISE_API}${import.meta.env.VITE_FLOWISE_ENDPOINT_PREDICTION}${import.meta.env.VITE_CHATFLOW_ID}`;
            const token = import.meta.env.VITE_FLOWISE_TOKEN;
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        },

        toggleTurnToTalk() {
            this.turnToTalk = this.turnToTalk === 'user' ? 'bot' : 'user';
        },

        setLastMessage(newMessage, now) {
            const lastMessage = this.messages.at(-1);
            if (lastMessage) {
                lastMessage.content = newMessage;
                lastMessage.time = now;
            }
        },
    },

    getters: {
        lastMessage: (state) => state.messages.at(-1) || null,
        messageCount: (state) => state.messages.length,
    },
});