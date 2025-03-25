<template>
  <div>
    <div v-auto-animate>
      <!-- Отображение истории чата с поддержкой Markdown -->
      <div v-for="(message, index) in chatHistory" :key="index" class="message" v-auto-animate>
        <strong v-auto-animate>{{ message.role }}:</strong>
        <div class="message-content" v-auto-animate>{{ message.content }}</div>
      </div>
    </div>
    <c-input v-model="text" placeholder="Введите сообщение" />
    <c-btn @click="sendMessage">Отправить</c-btn>
  </div>
</template>

<script>
import OpenAI from "openai";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: "api_key"
});

export default {
  name: "TestPage",
  data() {
    return {
      text: "", // Ввод пользователя
      chatHistory: [], // История сообщений
      threadId: null, // Идентификатор потока сообщений
      assistantId: "assistant_id", // Идентификатор ассистента (если нужен)
      newMessage: "",
    };
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  methods: {
    async getMessages() {
      const messages = await openai.beta.threads.messages.list(this.threadId);
      messages.data.forEach((message) => {
        this.chatHistory.push({ role: message.role, content: message.content[0].text.value });
      });
      console.log(messages, "messages");
      
    },  
    // Функция для создания потока сообщений
    async createThread() {
      try {
        const emptyThread = await openai.beta.threads.create();
        const runs = await openai.beta.threads.runs.create(emptyThread.id, {
          assistant_id: this.assistantId,
          additional_instructions: null,
          tool_choice: null,
        });
        console.log(runs);

        this.threadId = emptyThread.id;
        localStorage.setItem("threadId", this.threadId);
        console.log("Thread created:", emptyThread);
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    },

    // Отправка сообщения от пользователя
    async sendMessage() {
      if (!this.text.trim()) return; // Игнорируем пустые сообщения

      if (!this.threadId) {
        this.threadId = localStorage.getItem("threadId");
        if (!this.threadId) {
          await this.createThread();
        }
      }

      // Добавляем сообщение пользователя в историю чата
      this.chatHistory.push({ role: "user", content: this.text });

      try {
        // Отправляем сообщение в поток
        await this.sendMessageStream(this.text);
        this.text = ""; // Очищаем поле ввода
      } catch (error) {
        console.error("Error sending message:", error);
        this.chatHistory.push({
          role: "assistant",
          content: "Произошла ошибка при отправке сообщения.",
        });
      }
    },

    // Отправка сообщения в поток
    async sendMessageStream(userMessage) {
      try {
        const message = await openai.beta.threads.messages.create(
          this.threadId,
          {
            role: "user",
            content: userMessage,
          }
        );
        console.log("Message sent:", message);
        this.listenToStream();
      } catch (error) {
        console.error("Error during stream:", error);
      }
    },

    // Прослушивание событий потока
    listenToStream() {
      openai.beta.threads.runs
        .stream(this.threadId, {
          assistant_id: this.assistantId,
          additional_instructions: null,
          tool_choice: null,
        })
        .on("textCreated", (text) => {
          // Добавляем сообщение от ассистента в chatHistory
          this.chatHistory.push({ role: "assistant", content: ''});
          console.log(text, "textCreated");
        })
        .on("textDelta", (textDelta) => {
          // Добавляем изменения к последнему сообщению ассистента
          const lastMessage = this.chatHistory[this.chatHistory.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            lastMessage.content += textDelta.value;
          } else {
            // В случае если это первое сообщение ассистента
            this.chatHistory.push({
              role: "assistant",
              content: textDelta.value,
            });
          }
          console.log(textDelta, "textDelta");
        })
        .on("toolCallCreated", (toolCall) => {
          // Добавляем информацию о вызове инструмента в историю
          this.chatHistory.push({
            role: "assistant",
            content: `Tool Call: ${toolCall.type}`,
          });
          console.log(toolCall, "toolCallCreated");
        })
        .on("toolCallDelta", (toolCallDelta) => {
          if (toolCallDelta.type === "code_interpreter") {
            if (toolCallDelta.code_interpreter.input) {
              this.chatHistory.push({
                role: "assistant",
                content: toolCallDelta.code_interpreter.input,
              });
              console.log(
                toolCallDelta.code_interpreter.input,
                "toolCallDelta.code_interpreter.input"
              );
            }
            if (toolCallDelta.code_interpreter.outputs) {
              toolCallDelta.code_interpreter.outputs.forEach((output) => {
                if (output.type === "logs") {
                  this.chatHistory.push({
                    role: "assistant",
                    content: output.logs,
                  });
                  console.log(output.logs, "output.logs");
                }
              });
            }
          }
        })
        .on("toolCallCompleted", (toolCall) => {
          console.log(toolCall, "toolCallCompleted");
        })
        .on("error", (error) => {
          console.error("Error in stream:", error);
        });
    },
  },

  mounted() {
    // При монтировании проверяем наличие threadId в localStorage
    const storedThreadId = localStorage.getItem("threadId");
    if (storedThreadId) {
      this.threadId = storedThreadId;
    } else {
      this.createThread();
    }
    this.getMessages();
  },
};
</script>

<style>
/* Стили для Markdown */
.message-content code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.message-content pre {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
}

.message-content a {
  color: #007bff;
  text-decoration: none;
}

.message-content a:hover {
  text-decoration: underline;
}

.message-content table {
  border-collapse: collapse;
  width: 100%;
}

.message-content table th,
.message-content table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.message-content table th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>
