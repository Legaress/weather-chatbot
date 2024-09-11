<template>
  <v-container class="footer">
    <v-text-field
      v-model="message"
      :prepend-inner-icon="icon"
      :disabled="store.turnToTalk === 'bot'"
      color="primary"
      clearable
      placeholder="Message"
      type="text"
      variant="outlined"
      rounded
      density="compact"
      @click:prepend-inner="changeIcon"
      @click:clear="clearMessage"
      @keyup.enter="sendMessage"
    ></v-text-field>
    <v-btn
      :disabled="store.turnToTalk === 'bot' || !message.trim()"
      @click.prevent="sendMessage"
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '@/stores/store';

const emit = defineEmits(['sendMessage']);
const store = useStore();

const message = ref('');
const iconIndex = ref(0);
const icons = [
  'mdi-emoticon',
  'mdi-emoticon-cool',
  'mdi-emoticon-dead',
  'mdi-emoticon-excited',
  'mdi-emoticon-happy',
  'mdi-emoticon-neutral',
  'mdi-emoticon-sad',
  'mdi-emoticon-tongue'
];

const icon = computed(() => icons[iconIndex.value]);

const sendMessage = () => {
  const trimmedMessage = message.value.trim();
  if (trimmedMessage) { 
    changeIcon();
    emit("sendMessage", trimmedMessage);
    clearMessage();
  }
};

const clearMessage = () => {
  message.value = '';
};

const changeIcon = () => {
  iconIndex.value = (iconIndex.value + 1) % icons.length;
};
</script>

<style scoped>
 .footer {
  display: flex;
  border-radius: 1%;
  justify-content: center;
  gap:1%;
 }
</style>
