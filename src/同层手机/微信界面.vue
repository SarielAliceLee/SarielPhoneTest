<template>
  <div class="app-screen">
    <!-- 应用头部 -->
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">微信🔄</div>
      <button class="app-action" @click="addContact">+</button>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <!-- 聊天列表 -->
      <div v-if="currentTab === 'chat'" class="wechat-chat">
        <div v-if="chatList.length > 0" class="chat-list">
          <div v-for="chat in chatList" :key="chat.id" class="chat-item" @click="openChat(chat)">
            <div class="chat-avatar" :style="{ background: chat.avatarColor }">
              <img v-if="chat.avatar.startsWith('http')" :src="chat.avatar" :alt="chat.name" class="avatar-image" />
              <span v-else>{{ chat.avatar }}</span>
            </div>
            <div class="chat-info">
              <div class="chat-name">{{ chat.name }}</div>
              <div class="chat-message">{{ chat.lastMessage }}</div>
            </div>
            <div class="chat-right">
              <div v-if="chat.time" class="chat-time">{{ chat.time }}</div>
              <div v-if="chat.hasUnread" class="unread-dot"></div>
            </div>
          </div>
        </div>
        <div v-else class="empty-contacts">
          <div class="empty-message">请点击右上角+添加联系人~</div>
        </div>
      </div>

      <!-- 朋友圈 -->
      <div v-if="currentTab === 'moments'" class="wechat-moments">
        <!-- 朋友圈头部 -->
        <div class="moments-header">
          <div class="moments-cover">
            <div class="cover-image">
              <div class="cover-content">
                <div class="cover-text">记录美好生活</div>
              </div>
            </div>
          </div>
          <div class="moments-profile">
            <div class="profile-avatar">
              <img src="{{userAvatarPath}}" alt="我的头像" />
            </div>
            <div class="profile-name">朋友圈</div>
          </div>
        </div>

        <!-- 朋友圈内容 -->
        <div class="moments-content">
          <div v-for="moment in momentsList" :key="moment.id" class="moment-item">
            <div class="moment-user">
              <div class="moment-avatar">
                <img v-if="moment.avatar.startsWith('http')" :src="moment.avatar" :alt="moment.name" />
                <span v-else>{{ moment.avatar }}</span>
              </div>
              <div class="moment-info">
                <div class="moment-name">{{ moment.name }}</div>
                <div class="moment-time">{{ moment.time }}</div>
              </div>
            </div>

            <div v-if="moment.content" class="moment-text">{{ moment.content }}</div>

            <!-- 图片网格 -->
            <div
              v-if="moment.images && moment.images.length > 0"
              class="moment-images"
              :class="`grid-${Math.min(moment.images.length, 9)}`"
            >
              <div
                v-for="(image, index) in moment.images"
                :key="index"
                class="moment-image"
                @click="previewImage(image, moment.images)"
              >
                <img v-if="image.startsWith('http')" :src="image" :alt="`图片${index + 1}`" />
                <div v-else class="image-placeholder">{{ image }}</div>
              </div>
            </div>

            <!-- 位置信息 -->
            <div v-if="moment.location" class="moment-location">
              <span class="location-icon">📍</span>
              <span class="location-text">{{ moment.location }}</span>
            </div>

            <!-- 互动区域 -->
            <div v-if="moment.likes > 0 || (moment.comments && moment.comments.length > 0)" class="moment-interactions">
              <div v-if="moment.likes > 0" class="moment-likes">
                <span class="like-icon">❤️</span>
                <span class="like-text">{{
                  moment.likeNames ? moment.likeNames.join('、') : `${moment.likes}人赞了`
                }}</span>
              </div>
              <div v-if="moment.comments && moment.comments.length > 0" class="moment-comments">
                <div v-for="comment in moment.comments" :key="comment.id" class="comment-item">
                  <span class="comment-name">{{ comment.name }}：</span>
                  <span class="comment-text">{{ comment.text }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="moment-actions">
              <button class="action-btn like-btn" :class="{ liked: moment.isLiked }" @click="toggleLike(moment)">
                {{ moment.isLiked ? '❤️' : '🤍' }}
              </button>
              <button class="action-btn comment-btn" @click="showCommentInput(moment)">💬</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部标签栏 -->
    <div class="tab-bar">
      <button class="tab-item" :class="{ active: currentTab === 'chat' }" @click="switchTab('chat')">聊天</button>
      <button class="tab-item" :class="{ active: currentTab === 'moments' }" @click="switchTab('moments')">
        朋友圈
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const currentTab = ref('chat');

// 聊天列表数据
const chatList = ref<any[]>([]);

// 朋友圈数据
const momentsList = ref([
  {
    id: 1,
    name: '张小明',
    avatar: 'https://via.placeholder.com/40x40/07c160/ffffff?text=张',
    time: '2小时前',
    content: '今天天气真不错，和朋友们一起去公园散步，心情特别好！',
    images: ['https://picsum.photos/200/200?random=1', 'https://picsum.photos/200/200?random=2'],
    location: '中央公园',
    likes: 12,
    likeNames: ['李小红', '王老师', '陈同学'],
    comments: [
      { id: 1, name: '李小红', text: '我也想去！下次一起吧' },
      { id: 2, name: '王老师', text: '注意安全哦，玩得开心' },
    ],
    isLiked: false,
  },
  {
    id: 2,
    name: '李小红',
    avatar: 'https://via.placeholder.com/40x40/e91e63/ffffff?text=李',
    time: '5小时前',
    content: '今天尝试了新的菜谱，味道还不错！',
    images: [
      'https://picsum.photos/200/200?random=3',
      'https://picsum.photos/200/200?random=4',
      'https://picsum.photos/200/200?random=5',
    ],
    location: '家里',
    likes: 8,
    likeNames: ['张小明', '陈同学'],
    comments: [
      { id: 1, name: '张小明', text: '看起来好香！求教程' },
      { id: 2, name: '陈同学', text: '太厉害了，我也想学' },
    ],
    isLiked: true,
  },
  {
    id: 3,
    name: '王老师',
    avatar: 'https://via.placeholder.com/40x40/2196f3/ffffff?text=王',
    time: '1天前',
    content: '今天上课同学们表现都很棒！看到大家的进步，作为老师真的很欣慰。',
    images: ['https://picsum.photos/200/200?random=6'],
    likes: 15,
    likeNames: ['张小明', '李小红', '陈同学', '刘同学'],
    comments: [
      { id: 1, name: '张小明', text: '谢谢老师！我们会继续努力的' },
      { id: 2, name: '李小红', text: '老师辛苦了，感谢您的教导' },
      { id: 3, name: '陈同学', text: '老师您太棒了！' },
    ],
    isLiked: false,
  },
  {
    id: 4,
    name: '陈同学',
    avatar: 'https://via.placeholder.com/40x40/ff9800/ffffff?text=陈',
    time: '2天前',
    content: '周末去图书馆学习，环境很好，效率也很高。推荐给大家！',
    images: [
      'https://picsum.photos/200/200?random=7',
      'https://picsum.photos/200/200?random=8',
      'https://picsum.photos/200/200?random=9',
    ],
    location: '市图书馆',
    likes: 6,
    likeNames: ['张小明'],
    comments: [],
    isLiked: false,
  },
  {
    id: 5,
    name: '刘同学',
    avatar: 'https://via.placeholder.com/40x40/9c27b0/ffffff?text=刘',
    time: '3天前',
    content: '今天参加了志愿者活动，帮助老人过马路，感觉很有意义！',
    images: [
      'https://picsum.photos/200/200?random=10',
      'https://picsum.photos/200/200?random=11',
      'https://picsum.photos/200/200?random=12',
      'https://picsum.photos/200/200?random=13',
    ],
    location: '市中心',
    likes: 20,
    likeNames: ['张小明', '李小红', '王老师', '陈同学'],
    comments: [
      { id: 1, name: '王老师', text: '很棒！为社会做贡献' },
      { id: 2, name: '李小红', text: '向你学习！' },
    ],
    isLiked: true,
  },
]);

// 切换标签
function switchTab(tab: string) {
  currentTab.value = tab;
}

// 朋友圈交互功能
function toggleLike(moment: any) {
  moment.isLiked = !moment.isLiked;
  if (moment.isLiked) {
    moment.likes++;
    if (!moment.likeNames) moment.likeNames = [];
    moment.likeNames.push('我');
  } else {
    moment.likes--;
    if (moment.likeNames) {
      const index = moment.likeNames.indexOf('我');
      if (index > -1) moment.likeNames.splice(index, 1);
    }
  }
}

function showCommentInput(moment: any) {
  // 这里可以添加评论输入功能
  console.log('显示评论输入框:', moment);
}

// 图片预览功能
function previewImage(currentImage: string, allImages: string[]) {
  console.log('预览图片:', currentImage, '所有图片:', allImages);
  // 这里可以添加图片预览功能
}

// 打开聊天
function openChat(chat: any) {
  console.log('打开聊天:', chat.name);

  // 获取用户头像路径
  const userAvatarPath = substitudeMacros('{{userAvatarPath}}');

  // 如果是群聊，准备群成员头像
  const groupAvatars: Record<string, string> = {};
  if (chat.isGroup && chat.members) {
    chat.members.forEach((member: any) => {
      groupAvatars[member.name] = member.avatar;
    });
  }

  // 跳转到聊天界面，传递联系人信息
  console.log('传递的参数:', {
    name: chat.name,
    avatar: chat.avatar,
    isGroup: chat.isGroup || false,
    userAvatarPath: userAvatarPath,
    groupAvatars: groupAvatars,
  });

  router.push({
    path: '/chat',
    query: {
      name: chat.name,
      avatar: chat.avatar,
      isGroup: chat.isGroup || false,
      userAvatarPath: userAvatarPath,
      groupAvatars: JSON.stringify(groupAvatars),
    },
  });
}

// 返回
function goBack() {
  router.push('/');
}

// 添加联系人
function addContact() {
  router.push('/add-contact');
}

// 从本层消息中获取群聊的最新消息
async function getLatestMessageForGroup(_groupName: string) {
  try {
    // 获取当前消息楼层号
    const currentMessageId = getCurrentMessageId();

    // 获取当前楼层的聊天消息
    const chatMessages = getChatMessages(currentMessageId);

    if (!chatMessages || chatMessages.length === 0) {
      return { text: '', time: '', isFromContact: false };
    }

    // 获取第一个消息
    const chatMessage = chatMessages[0];
    const messageText = chatMessage.message;

    // 查找GroupChat标签
    const groupChatRegex = new RegExp(`<PrivateChat char="${_groupName}">([\\s\\S]*?)</PrivateChat>`, 'g');
    const match = groupChatRegex.exec(messageText);

    if (match) {
      const chatContent = match[1];
      const chatLines = chatContent.split('\n').filter(line => line.trim());

      if (chatLines.length === 0) {
        return { text: '', time: '', isFromContact: false };
      }

      // 获取最后一条消息
      const lastLine = chatLines[chatLines.length - 1];

      // 解析格式：[姓名|时间]消息内容
      const messageMatch = lastLine.match(/\[([^|]+)\|([^\]]+)\](.+)/);
      if (messageMatch) {
        const [, name, time, text] = messageMatch;
        const isFromContact = name.trim() !== '{{user}}';
        return {
          text: text.trim(),
          time: time.trim(),
          isFromContact: isFromContact,
        };
      } else {
        // 解析格式：[{{user}}]消息内容（无时间格式）
        const userMessageMatch = lastLine.match(/^\[{{user}}\](.+)$/);
        if (userMessageMatch) {
          const [, text] = userMessageMatch;
          return {
            text: text.trim(),
            time: '',
            isFromContact: false,
          };
        }
      }
    }

    return { text: '', time: '', isFromContact: false };
  } catch (error) {
    console.error('获取群聊最新消息失败:', error);
    return { text: '', time: '', isFromContact: false };
  }
}

// 从本层消息中获取指定联系人的最新消息
async function getLatestMessageForContact(contactName: string) {
  try {
    // 获取当前消息楼层号
    const currentMessageId = getCurrentMessageId();

    // 获取当前楼层的聊天消息
    const chatMessages = getChatMessages(currentMessageId);

    if (!chatMessages || chatMessages.length === 0) {
      return { text: '', time: '', isFromContact: false };
    }

    // 获取第一个消息
    const chatMessage = chatMessages[0];
    const messageText = chatMessage.message;

    // 查找PrivateChat标签
    const privateChatRegex = new RegExp(`<PrivateChat char="${contactName}">([\\s\\S]*?)</PrivateChat>`, 'g');
    const match = privateChatRegex.exec(messageText);

    if (match) {
      const chatContent = match[1];
      const chatLines = chatContent.split('\n').filter(line => line.trim());

      if (chatLines.length === 0) {
        return { text: '', time: '', isFromContact: false };
      }

      // 获取最后一条消息
      const lastLine = chatLines[chatLines.length - 1];

      // 解析格式：[姓名|时间]消息内容
      const messageMatch = lastLine.match(/\[([^|]+)\|([^\]]+)\](.+)/);
      if (messageMatch) {
        const [, name, time, text] = messageMatch;
        const isFromContact = name.trim() !== '{{user}}';
        return {
          text: text.trim(),
          time: time.trim(),
          isFromContact: isFromContact,
        };
      } else {
        // 解析格式：[{{user}}]消息内容（无时间格式）
        const userMessageMatch = lastLine.match(/^\[{{user}}\](.+)$/);
        if (userMessageMatch) {
          const [, text] = userMessageMatch;
          return {
            text: text.trim(),
            time: '',
            isFromContact: false,
          };
        }
      }
    }

    return { text: '', time: '', isFromContact: false };
  } catch (error) {
    console.error('获取联系人最新消息失败:', error);
    return { text: '', time: '', isFromContact: false };
  }
}

// 从世界书读取角色列表数据
async function loadContactsFromWorldbook() {
  try {
    // 获取当前角色绑定的世界书
    const charWorldbooks = getCharWorldbookNames('current');
    const primaryWorldbook = charWorldbooks.primary;

    if (!primaryWorldbook) {
      console.log('当前角色没有绑定主世界书');
      return;
    }

    // 获取世界书内容
    const worldbook = await getWorldbook(primaryWorldbook);

    // 查找名为"角色列表"的条目
    const characterListEntry = worldbook.find(entry => entry.name === '角色列表');

    if (!characterListEntry) {
      console.log('未找到"角色列表"条目');
      return;
    }

    // 解析角色列表内容
    const contacts: any[] = [];
    const lines = characterListEntry.content.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const parts = line.split('|');

      if (parts.length === 4) {
        // 私聊格式：姓名|头像地址|是否可攻略主要角色|和用户相遇时间
        const [name, avatarUrl, isMainCharacter, meetTime] = parts;
        const isMain = isMainCharacter === 'true';

        // 从本层消息中读取该联系人的最新消息
        const latestMessage = await getLatestMessageForContact(name);

        contacts.push({
          id: contacts.length + 1,
          name: name,
          avatar: avatarUrl,
          avatarColor: isMain
            ? 'linear-gradient(135deg, #ff6b6b, #ffa726)'
            : 'linear-gradient(135deg, #07c160, #00d4aa)',
          lastMessage: latestMessage.text,
          time: latestMessage.time,
          isMainCharacter: isMain,
          meetTime: meetTime,
          hasUnread: latestMessage.isFromContact, // 如果最后一条消息是角色发送的，显示红点
        });
      } else if (parts.length === 3) {
        // 群聊格式：群名|群成员|群头像
        const [groupName, members, groupAvatar] = parts;
        const memberList = members.split(',');

        // 为群成员添加头像信息，从已解析的私聊联系人中获取头像
        const membersWithAvatars = memberList.map((memberName: string) => {
          const trimmedName = memberName.trim();
          // 从已解析的私聊联系人中查找对应的头像
          const existingContact = contacts.find(contact => contact.name === trimmedName);
          return {
            name: trimmedName,
            avatar: existingContact ? existingContact.avatar : '👤', // 如果找到则使用原头像，否则使用默认头像
          };
        });

        // 从本层消息中读取该群聊的最新消息
        const latestGroupMessage = await getLatestMessageForGroup(groupName);

        console.log(`群聊 ${groupName} 的成员头像映射:`, membersWithAvatars);

        contacts.push({
          id: contacts.length + 1,
          name: groupName,
          avatar: groupAvatar,
          avatarColor: 'linear-gradient(135deg, #2196f3, #21cbf3)',
          lastMessage: latestGroupMessage.text,
          time: latestGroupMessage.time,
          isGroup: true,
          members: membersWithAvatars,
          hasUnread: latestGroupMessage.isFromContact, // 如果最后一条消息是群成员发送的，显示红点
        });
      }
    }

    chatList.value = contacts;
    console.log('成功加载联系人列表:', contacts);
  } catch (error) {
    console.error('加载联系人列表失败:', error);
  }
}

onMounted(() => {
  // 组件挂载后加载联系人列表
  loadContactsFromWorldbook();
});
</script>

<style scoped>
.app-screen {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-header {
  background: #f8f8f8;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  height: 50px;
}

.app-back {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  color: #007aff;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.app-action {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  color: #007aff;
}

.app-content {
  flex: 1;
  overflow-y: auto;
}

/* 微信聊天样式 */
.wechat-chat {
  background: #f5f5f5;
}

.chat-list {
  display: flex;
  flex-direction: column;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background: #f8f8f8;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-right: 15px;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-info {
  flex: 1;
  min-width: 0; /* 允许flex项目收缩 */
  margin-right: 15px; /* 与右侧内容保持间距 */
}

.chat-name {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-message {
  color: #999;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px; /* 限制最大宽度，防止挤压头像 */
}

.chat-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.chat-time {
  color: #999;
  font-size: 12px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ff3b30;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 朋友圈样式 */
.wechat-moments {
  background: #f5f5f5;
  min-height: 100vh;
}

/* 朋友圈头部 */
.moments-header {
  position: relative;
  height: 200px;
  margin-bottom: 60px;
}

.moments-cover {
  position: relative;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  background-image: url('https://testingcf.jsdelivr.net/gh/SarielAliceLee/SarielPhoneTest/src/image/朋友圈壁纸.png');
  background-size: 100% 100%;
  animation: gradientShift 8s ease infinite;
  position: relative;
}

.cover-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.cover-text {
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.moments-profile {
  position: absolute;
  bottom: -40px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 朋友圈内容 */
.moments-content {
  padding: 0 15px 20px;
}

.moment-item {
  background: white;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.moment-user {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.moment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  font-size: 16px;
  flex-shrink: 0;
  overflow: hidden;
}

.moment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.moment-info {
  flex: 1;
}

.moment-name {
  font-weight: 600;
  margin-bottom: 2px;
  color: #333;
  font-size: 15px;
}

.moment-time {
  font-size: 12px;
  color: #999;
}

.moment-text {
  line-height: 1.6;
  margin-bottom: 12px;
  color: #333;
  font-size: 15px;
  word-break: break-word;
}

.moment-location {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  color: #666;
}

.location-icon {
  margin-right: 4px;
  font-size: 12px;
}

.location-text {
  color: #666;
}

/* 图片网格 */
.moment-images {
  margin-bottom: 12px;
  display: grid;
  gap: 5px;
}

/* 1张图片 */
.moment-images.grid-1 {
  grid-template-columns: 1fr;
  max-width: 200px;
}

/* 2张图片 */
.moment-images.grid-2 {
  grid-template-columns: 1fr 1fr;
  max-width: 200px;
}

/* 3张图片 */
.moment-images.grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 300px;
}

/* 4张图片 */
.moment-images.grid-4 {
  grid-template-columns: 1fr 1fr;
  max-width: 200px;
}

/* 5张图片 */
.moment-images.grid-5 {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 300px;
}

/* 6张图片 */
.moment-images.grid-6 {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 300px;
}

/* 7张图片 */
.moment-images.grid-7 {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 300px;
}

/* 8张图片 */
.moment-images.grid-8 {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 300px;
}

/* 9张图片 */
.moment-images.grid-9 {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 300px;
}

.moment-image {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
  cursor: pointer;
  transition: transform 0.2s;
}

.moment-image:hover {
  transform: scale(1.02);
}

.moment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

/* 互动区域 */
.moment-interactions {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
}

.moment-likes {
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
}

.like-icon {
  margin-right: 6px;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.like-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  flex: 1;
}

.moment-comments {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-item {
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}

.comment-name {
  color: #576b95;
  font-weight: 500;
  margin-right: 4px;
}

.comment-text {
  color: #333;
}

/* 操作按钮 */
.moment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.like-btn.liked {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
}

.like-btn.liked:hover {
  background: rgba(255, 59, 48, 0.2);
}

.comment-btn {
  color: #576b95;
}

.comment-btn:hover {
  background: rgba(87, 107, 149, 0.1);
}

/* 标签栏样式 */
.tab-bar {
  display: flex;
  background: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  height: 50px;
}

.tab-item {
  flex: 1;
  padding: 12px;
  text-align: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: color 0.2s;
}

.tab-item.active {
  color: #07c160;
  font-weight: 600;
}

/* 空联系人状态样式 */
.empty-contacts {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: #f5f5f5;
}

.empty-message {
  color: #999;
  font-size: 16px;
  text-align: center;
}
</style>
