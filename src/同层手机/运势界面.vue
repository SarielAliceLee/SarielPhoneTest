<template>
  <div class="app-screen">
    <!-- 应用头部 -->
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">运势</div>
      <div></div>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <!-- 星座运势 -->
      <div v-if="currentTab === 'zodiac'" class="fortune-zodiac">
        <div class="zodiac-grid">
          <div v-for="zodiac in zodiacList" :key="zodiac.id" class="zodiac-item" @click="selectZodiac(zodiac)">
            <div class="zodiac-icon">{{ zodiac.icon }}</div>
            <div class="zodiac-name">{{ zodiac.name }}</div>
          </div>
        </div>

        <div class="fortune-today">
          <div class="fortune-title">今日运势</div>
          <div v-if="selectedZodiac" class="fortune-content">
            <div class="zodiac-info">
              <span class="zodiac-icon-large">{{ selectedZodiac.icon }}</span>
              <span class="zodiac-name-large">{{ selectedZodiac.name }}</span>
            </div>
            <div class="fortune-text">{{ todayFortune }}</div>
            <div class="fortune-details">
              <div class="detail-item">
                <span class="detail-label">幸运数字:</span>
                <span class="detail-value">{{ luckyNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">幸运颜色:</span>
                <span class="detail-value">{{ luckyColor }}</span>
              </div>
            </div>
          </div>
          <button v-else class="fortune-today-btn" @click="getTodayFortune()">查看今日运势</button>
        </div>
      </div>

      <!-- 塔罗牌占卜 -->
      <div v-if="currentTab === 'tarot'" class="fortune-tarot">
        <div ref="tarotChat" class="tarot-chat">
          <div v-if="tarotMessages.length === 0" class="tarot-welcome">
            <div class="welcome-text">向塔罗牌提问，获得神秘指引...</div>
          </div>
          <div v-for="message in tarotMessages" :key="message.id" class="tarot-message">
            <div class="message-question">{{ message.question }}</div>
            <div class="message-answer">
              <div class="tarot-card">抽到的牌：{{ message.card }}</div>
              <div class="tarot-interpretation">{{ message.interpretation }}</div>
            </div>
          </div>
        </div>
        <div class="tarot-input">
          <input v-model="tarotQuestion" type="text" placeholder="输入你的问题..." @keyup.enter="askTarot" />
          <button class="tarot-send" @click="askTarot">发送</button>
        </div>
      </div>
    </div>

    <!-- 底部标签栏 -->
    <div class="tab-bar">
      <button class="tab-item" :class="{ active: currentTab === 'zodiac' }" @click="switchTab('zodiac')">星座</button>
      <button class="tab-item" :class="{ active: currentTab === 'tarot' }" @click="switchTab('tarot')">塔罗</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const currentTab = ref('zodiac');
const selectedZodiac = ref<any>(null);
const todayFortune = ref('');
const luckyNumber = ref('');
const luckyColor = ref('');
const tarotQuestion = ref('');
const tarotMessages = ref<any[]>([]);
const tarotChat = ref<HTMLElement | null>(null);

// 星座列表
const zodiacList = ref([
  { id: 1, name: '白羊座', icon: '♈', element: '火' },
  { id: 2, name: '金牛座', icon: '♉', element: '土' },
  { id: 3, name: '双子座', icon: '♊', element: '风' },
  { id: 4, name: '巨蟹座', icon: '♋', element: '水' },
  { id: 5, name: '狮子座', icon: '♌', element: '火' },
  { id: 6, name: '处女座', icon: '♍', element: '土' },
  { id: 7, name: '天秤座', icon: '♎', element: '风' },
  { id: 8, name: '天蝎座', icon: '♏', element: '水' },
  { id: 9, name: '射手座', icon: '♐', element: '火' },
  { id: 10, name: '摩羯座', icon: '♑', element: '土' },
  { id: 11, name: '水瓶座', icon: '♒', element: '风' },
  { id: 12, name: '双鱼座', icon: '♓', element: '水' },
]);

// 运势文本
const fortuneTexts = [
  '今天是个好日子，适合做重要决定。财运亨通，事业顺利，感情甜蜜。',
  '今日运势不错，人际关系和谐，工作进展顺利，心情愉悦。',
  '今天可能会遇到一些小挑战，但保持积极心态，一切都会好起来。',
  '今日适合学习新技能，投资理财，感情方面会有新的进展。',
  '今天需要保持耐心，不要急于求成，稳扎稳打才能获得成功。',
  '今日人际关系运势佳，适合与朋友聚会，可能会遇到贵人。',
];

const colors = ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'];

// 切换标签
function switchTab(tab: string) {
  currentTab.value = tab;
}

// 选择星座
function selectZodiac(zodiac: any) {
  selectedZodiac.value = zodiac;
  generateFortune();
}

// 生成运势
function generateFortune() {
  const randomFortune = fortuneTexts[Math.floor(Math.random() * fortuneTexts.length)];
  const randomNumber = Math.floor(Math.random() * 9) + 1;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  todayFortune.value = randomFortune;
  luckyNumber.value = randomNumber.toString();
  luckyColor.value = randomColor;
}

// 获取今日运势
function getTodayFortune() {
  if (!selectedZodiac.value) {
    alert('请先选择一个星座');
    return;
  }
  generateFortune();
}

// 塔罗牌占卜
function askTarot() {
  if (!tarotQuestion.value.trim()) {
    alert('请输入你的问题');
    return;
  }

  const cards = [
    '愚者',
    '魔术师',
    '女祭司',
    '皇后',
    '皇帝',
    '教皇',
    '恋人',
    '战车',
    '力量',
    '隐者',
    '命运之轮',
    '正义',
    '倒吊人',
    '死神',
    '节制',
    '恶魔',
    '塔',
    '星星',
    '月亮',
    '太阳',
    '审判',
    '世界',
  ];
  const interpretations = [
    '塔罗牌显示，你需要保持内心的平静，答案就在你心中。',
    '这张牌暗示着新的开始，勇敢地迈出第一步吧。',
    '塔罗牌建议你相信自己的直觉，它会指引你走向正确的方向。',
    '这张牌提醒你要保持耐心，美好的事物即将到来。',
    '塔罗牌显示，你需要释放过去的包袱，才能迎接新的机遇。',
    '这张牌暗示着内在的力量，相信自己的能力，你能够克服任何困难。',
  ];

  const randomCard = cards[Math.floor(Math.random() * cards.length)];
  const randomInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];

  const newMessage = {
    id: Date.now(),
    question: tarotQuestion.value,
    card: randomCard,
    interpretation: randomInterpretation,
  };

  tarotMessages.value.push(newMessage);
  tarotQuestion.value = '';

  // 滚动到底部
  setTimeout(() => {
    if (tarotChat.value) {
      tarotChat.value.scrollTop = tarotChat.value.scrollHeight;
    }
  }, 100);
}

// 返回
function goBack() {
  router.push('/');
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
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

.app-content {
  flex: 1;
  overflow-y: auto;
}

/* 星座运势样式 */
.fortune-zodiac {
  background: #f5f5f5;
  padding: 20px;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.zodiac-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.zodiac-item:hover {
  transform: scale(1.05);
}

.zodiac-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.zodiac-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.fortune-today {
  background: linear-gradient(135deg, #ff6b6b, #ffa726);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
}

.fortune-title {
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
}

.zodiac-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  gap: 10px;
}

.zodiac-icon-large {
  font-size: 32px;
}

.zodiac-name-large {
  font-size: 20px;
  font-weight: 600;
}

.fortune-text {
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 16px;
}

.fortune-details {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.detail-label {
  font-size: 12px;
  opacity: 0.8;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
}

.fortune-today-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 16px;
}

.fortune-today-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 塔罗牌样式 */
.fortune-tarot {
  background: #f5f5f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tarot-chat {
  background: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
  flex: 1;
}

.tarot-welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.welcome-text {
  color: #666;
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.tarot-message {
  margin-bottom: 15px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 8px;
}

.message-question {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.message-answer {
  color: #666;
}

.tarot-card {
  font-size: 14px;
  color: #ff6b6b;
  margin-bottom: 8px;
}

.tarot-interpretation {
  line-height: 1.5;
}

.tarot-input {
  display: flex;
  gap: 10px;
}

.tarot-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.tarot-send {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.tarot-send:hover {
  background: #ff5252;
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
  color: #ff6b6b;
  font-weight: 600;
}
</style>
