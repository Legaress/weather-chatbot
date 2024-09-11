<template>
  <v-app>
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-container class="container-app">
          <!-- Header section -->
          <v-toolbar dense rounded app color="primary" >
            <v-toolbar-title class="white--text">Weather Bot</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="clearHistory" :disabled="store.turnToTalk === 'bot'">
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Chat messages section -->
          <v-container class="container-list">
            <v-list-item v-for="(message, index) in store.messages" :key="index">
              <v-row align="center" class="spacer" no-gutters>
                <v-col cols="2" lg="1">
                  <v-avatar>
                    <v-img class="avatar-image" :src="message.from === 'user' ? '/brain.svg' : '/robot.svg'"
                      alt="Avatar"></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="10" lg="9">
                  <div style="display: flex;">
                    <v-card style="display: flex; flex-direction: column;" justify="start" variant="tonal"
                      :color="message.from === 'user' ? 'primary-darken-1' : 'primary'">
                      <v-card-text>{{ message.content }}</v-card-text>
                      <v-card-subtitle style="font-size: 0.7em; align-self: flex-end;">{{ message.time
                        }}</v-card-subtitle>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </v-list-item>
            <span id="bottom"></span>
          </v-container>

          <!-- Input message section -->
          <ChatFooter @send-message="addUserMessage" />
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup>
import { useGoTo } from 'vuetify';
import ChatFooter from './components/ChatFooter.vue';
import { useStore } from '@/stores/store';
import { onMounted } from 'vue';

const store = useStore();
const myUseGoTo = useGoTo();

onMounted(() => {
  const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  store.addMessage('bot', 'Hello! How can I assist you today with weather-related inquiries?', now);
})

const updateScroll = () => {
  const element = document.querySelector('#bottom');
  myUseGoTo(element, { container: '.container-list' });
}

const addUserMessage = (newMessage) => {
  store.toggleTurnToTalk();
  const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  store.addMessage('user', newMessage, now);
  setTimeout(updateScroll, 1);

  callBotResponse(newMessage);
}

const callBotResponse = async (newMessage) => {

  store.sendMessage({ 'question': newMessage }).
    then((response) => {
      store.lastBotMessage = response['text'];
      store.toggleTurnToTalk();
    }).catch((error) => {
      store.toggleTurnToTalk();
      store.lastBotMessage = "Sorry, I can't responde, please check your connection";
      console.error("Error al hacer la peticion del mesnaje", error);
    });


  await simulatedBotTyping();

  const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  store.setLastMessage(store.lastBotMessage, now);
  setTimeout(updateScroll, 1);
}

const simulatedBotTyping = async () => {

  await new Promise(resolve => setTimeout(resolve, 500));

  store.addMessage('bot', 'typing...');

  setTimeout(updateScroll, 1);

  let typingMessage = "typing";

  while (store.turnToTalk === 'bot') {
    await new Promise(resolve => setTimeout(resolve, 300));
    typingMessage += " >";
    store.setLastMessage(typingMessage, "");
    if (typingMessage.length > 15) typingMessage = "typing";
  }
}

const clearHistory = () => {
  store.clearMessages()
    .then(() => {
      const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
      store.addMessage('bot', 'You have just deleted the conversation history, do you want to ask more weather related questions? ', now);
    })
    .catch((error) => {
      const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
      store.addMessage('bot', 'An error occurred while clearing the message history', now);
      console.error("Error al limpiar el historial: ", error);
    });
}
</script>

<style scoped>
.container-app {
  display: grid;
  height: 100dvh;
  grid-template-rows: 1fr 10fr 1fr;
  align-content: stretch;
  padding: 0.5%;
  gap: 0.5%;
}

.container-list {
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  justify-content: flex-start;
  background-color: rgba(130, 119, 228, 0.075);
  border-radius: 1%;
}
</style>
