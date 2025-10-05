<template>
  <div class="app-screen">
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">树洞</div>
      <button class="app-action">💫</button>
    </div>

    <div class="app-content">
      <div v-if="currentTab === 'us'" class="treehole-us">
        <div v-for="post in treeholePosts" :key="post.id" class="treehole-post">
          <div class="treehole-time">{{ post.time }}</div>
          <div class="treehole-content">{{ post.content }}</div>
        </div>
      </div>

      <div v-if="currentTab === 'wish'" class="treehole-wish">
        <textarea v-model="wishText" class="wish-input" placeholder="写下你的心愿和幻想..." rows="4"></textarea>
        <button class="wish-submit" @click="submitWish">许愿</button>

        <div v-for="wish in wishList" :key="wish.id" class="wish-item">
          <div class="treehole-time">{{ wish.time }}</div>
          <div class="wish-content">{{ wish.content }}</div>
        </div>
      </div>
    </div>

    <div class="tab-bar">
      <button class="tab-item" :class="{ active: currentTab === 'us' }" @click="switchTab('us')">我们</button>
      <button class="tab-item" :class="{ active: currentTab === 'wish' }" @click="switchTab('wish')">所愿</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTab = ref('us');
const wishText = ref('');

const treeholePosts = ref([
  {
    id: 1,
    time: '今天 14:30',
    content: '今天心情很好，希望明天也能保持这样的状态',
  },
  {
    id: 2,
    time: '今天 12:15',
    content: '工作压力有点大，但是我相信一切都会好起来的',
  },
  {
    id: 3,
    time: '昨天 20:45',
    content: '感谢所有帮助过我的人，你们让我的生活更美好',
  },
]);

const wishList = ref([
  {
    id: 1,
    time: '今天 16:20',
    content: '希望明天面试顺利，能够找到理想的工作',
  },
  {
    id: 2,
    time: '今天 10:30',
    content: '想要一个温暖的拥抱，让所有的烦恼都消失',
  },
]);

function switchTab(tab: string) {
  currentTab.value = tab;
}

function submitWish() {
  if (!wishText.value.trim()) {
    alert('请输入你的心愿');
    return;
  }

  const now = new Date();
  const timeString = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const newWish = {
    id: Date.now(),
    time: `今天 ${timeString}`,
    content: wishText.value,
  };

  wishList.value.unshift(newWish);
  wishText.value = '';
}

function goBack() {
  router.push('/');
}
</script>

<style scoped>
.app-screen {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #f8f8f8;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  height: 50px;
}

.app-back,
.app-action {
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

.treehole-us {
  background: linear-gradient(135deg, #8e24aa, #ba68c8);
  color: white;
  padding: 20px;
}

.treehole-post {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.treehole-time {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.treehole-content {
  line-height: 1.5;
}

.treehole-wish {
  background: linear-gradient(135deg, #8e24aa, #ba68c8);
  color: white;
  padding: 20px;
}

.wish-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 15px;
  resize: none;
  outline: none;
  font-family: inherit;
}

.wish-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.wish-submit {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
}

.wish-submit:hover {
  background: rgba(255, 255, 255, 0.3);
}

.wish-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.wish-content {
  line-height: 1.5;
  margin-top: 8px;
}

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
  color: #8e24aa;
  font-weight: 600;
}
</style>
