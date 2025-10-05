<template>
  <div class="app-screen">
    <!-- 应用头部 -->
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">{{ contactName }}</div>
      <button class="app-action" @click="showMore">⋯</button>
    </div>

    <!-- 聊天内容 -->
    <div class="chat-content">
      <div v-if="messages.length > 0" class="message-list">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{ 'own-message': message.isOwn }"
        >
          <div v-if="!message.isOwn" class="message-avatar">
            <img
              v-if="getMessageAvatar(message).startsWith('http') || getMessageAvatar(message).startsWith('./')"
              :src="getMessageAvatar(message)"
              :alt="message.name || contactName"
              class="avatar-image"
            />
            <span v-else>{{ getMessageAvatar(message) }}</span>
          </div>
          <div v-else class="message-avatar">
            <img
              v-if="getMessageAvatar(message).startsWith('http') || getMessageAvatar(message).startsWith('./')"
              :src="getMessageAvatar(message)"
              :alt="message.name || '我'"
              class="avatar-image"
            />
            <span v-else>{{ getMessageAvatar(message) }}</span>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <div class="message-text">{{ message.text }}</div>
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-chat">
        <div class="empty-message">暂无聊天记录</div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="chat-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="输入消息..."
        class="message-input"
        @keyup.enter="sendMessage"
      />
      <button class="send-button" :disabled="!newMessage.trim()" @click="sendMessage">📤</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 从路由参数获取联系人信息
const route = router.currentRoute.value;
const contactName = ref((route.query.name as string) || '');
const contactAvatar = ref((route.query.avatar as string) || '👤');
const isGroup = ref(route.query.isGroup === 'true');
const userAvatarPath = ref((route.query.userAvatarPath as string) || '');
const groupAvatars = ref(JSON.parse((route.query.groupAvatars as string) || '{}'));

// 响应式数据
const messages = ref<any[]>([]);
const newMessage = ref('');

// 返回
function goBack() {
  router.push('/wechat');
}

// 显示更多选项
function showMore() {
  console.log('显示更多选项');
}

// 获取消息头像
function getMessageAvatar(message: any): string {
  // 检查是否是用户消息（{{user}}格式）
  if (message.name === '{{user}}') {
    console.log('用户头像路径:', userAvatarPath.value);
    return userAvatarPath.value || '👤';
  }

  if (isGroup.value) {
    // 群聊时，根据发送人名称获取头像
    console.log('群聊头像映射:', groupAvatars.value);
    console.log('发送人名称:', message.name);
    console.log('获取到的头像:', groupAvatars.value[message.name]);
    console.log('所有可用的发送人:', Object.keys(groupAvatars.value));
    return groupAvatars.value[message.name] || contactAvatar.value;
  } else {
    // 私聊时，使用联系人头像
    return contactAvatar.value;
  }
}

// 发送消息
async function sendMessage() {
  if (!newMessage.value.trim()) return;

  const messageText = newMessage.value;

  // 添加到本地消息列表（不显示时间）
  messages.value.push({
    id: Date.now(),
    text: messageText,
    time: '',
    isOwn: true,
  });

  // 使用setChatMessages更新PrivateChat标签
  try {
    const currentMessageId = getCurrentMessageId();
    const chatMessages = getChatMessages(currentMessageId);

    if (chatMessages && chatMessages.length > 0) {
      const currentMessage = chatMessages[0];
      const messageContent = currentMessage.message;

      // 查找现有的PrivateChat标签
      const privateChatRegex = new RegExp(`<PrivateChat char="${contactName.value}">([\\s\\S]*?)</PrivateChat>`, 'g');
      const match = privateChatRegex.exec(messageContent);

      let chatContent = '';
      if (match) {
        // 如果存在标签，获取现有内容
        chatContent = match[1];
      }

      // 添加新消息到聊天记录，格式为[{{user}}]发送内容
      const newChatLine = `[{{user}}]${messageText}`;
      const updatedChatContent = chatContent ? `${chatContent}\n${newChatLine}` : newChatLine;

      // 更新消息内容
      let updatedMessage;
      if (match) {
        updatedMessage = messageContent.replace(
          privateChatRegex,
          `<PrivateChat char="${contactName.value}">${updatedChatContent}</PrivateChat>`,
        );
      } else {
        // 如果没有找到标签，添加新的标签
        const newPrivateChat = `<PrivateChat char="${contactName.value}">${newChatLine}</PrivateChat>`;
        updatedMessage = messageContent + '\n' + newPrivateChat;
      }

      // 使用setChatMessages更新消息，设置refresh为none避免重新渲染
      await setChatMessages(
        [
          {
            message_id: currentMessageId,
            message: updatedMessage,
          },
        ],
        { refresh: 'none' },
      );
    }
  } catch (error) {
    console.error('发送消息失败:', error);
  }

  newMessage.value = '';
}

// 加载聊天记录
async function loadChatHistory() {
  try {
    // 获取当前消息楼层号
    const currentMessageId = getCurrentMessageId();
    console.log('当前消息楼层号:', currentMessageId);

    // 获取当前楼层的聊天消息
    const chatMessages = getChatMessages(currentMessageId);
    console.log('获取到的聊天消息数量:', chatMessages.length);

    if (!chatMessages || chatMessages.length === 0) {
      console.log('当前楼层没有聊天消息');
      return;
    }

    // 解析聊天记录
    const parsedMessages: any[] = [];

    // 获取第一个消息（根据示例代码的用法）
    const chatMessage = chatMessages[0];
    console.log('处理消息:', chatMessage);
    const messageText = chatMessage.message;

    // 查找PrivateChat标签
    const privateChatRegex = new RegExp(`<PrivateChat char="${contactName.value}">([\\s\\S]*?)</PrivateChat>`, 'g');
    const match = privateChatRegex.exec(messageText);

    if (match) {
      console.log('找到PrivateChat标签:', match[1]);
      const chatContent = match[1];
      const chatLines = chatContent.split('\n').filter(line => line.trim());

      for (const chatLine of chatLines) {
        // 解析格式：[姓名|时间]消息内容
        const messageMatch = chatLine.match(/\[([^|]+)\|([^\]]+)\](.+)/);
        if (messageMatch) {
          const [, name, time, text] = messageMatch;
          const trimmedName = name.trim();
          parsedMessages.push({
            id: Date.now() + Math.random(),
            text: text.trim(),
            time: time.trim(),
            isOwn: trimmedName === '{{user}}',
            name: trimmedName,
          });
        } else {
          // 解析格式：[{{user}}]消息内容（无时间格式）
          const userMessageMatch = chatLine.match(/^\[{{user}}\](.+)$/);
          if (userMessageMatch) {
            const [, text] = userMessageMatch;
            parsedMessages.push({
              id: Date.now() + Math.random(),
              text: text.trim(),
              time: '',
              isOwn: true,
              name: '{{user}}',
            });
          }
        }
      }
    } else {
      console.log('未找到PrivateChat标签，消息内容:', messageText);
    }

    messages.value = parsedMessages;
    console.log('成功加载聊天记录:', parsedMessages);
  } catch (error) {
    console.error('加载聊天记录失败:', error);
  }
}

onMounted(() => {
  // 组件挂载后加载聊天记录
  console.log('聊天界面参数:', {
    contactName: contactName.value,
    contactAvatar: contactAvatar.value,
    isGroup: isGroup.value,
    userAvatarPath: userAvatarPath.value,
    groupAvatars: groupAvatars.value,
  });
  loadChatHistory();
});
</script>

<style scoped>
.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 15px;
}

.message-item.own-message {
  flex-direction: row-reverse;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.message-item.own-message .message-content {
  align-items: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #07c160, #00d4aa);
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
}

.message-bubble {
  max-width: 110%;
  min-width: auto;
  width: fit-content;
  background: white;
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.own-message .message-bubble {
  background: #007aff;
  color: white;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
  color: #666;
  margin-top: 2px;
}

.own-message .message-time {
  color: #999;
}

.empty-chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-message {
  color: #999;
  font-size: 16px;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-top: 1px solid #e0e0e0;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
}

.message-input:focus {
  border-color: #007aff;
}

.send-button {
  padding: 8px 12px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.05);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>
