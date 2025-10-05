<template>
  <div class="app-screen">
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">豆瓣</div>
      <button class="app-action">🔍</button>
    </div>

    <div class="app-content">
      <div v-if="currentTab === 'media'" class="douban-media">
        <div v-for="media in mediaList" :key="media.id" class="media-item">
          <div class="media-poster">{{ media.poster }}</div>
          <div class="media-info">
            <div class="media-title">{{ media.title }}</div>
            <div class="media-rating">⭐ {{ media.rating }}分</div>
            <div class="media-desc">{{ media.desc }}</div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'group'" class="douban-group">
        <div v-for="group in groupList" :key="group.id" class="group-item">
          <div class="group-header">
            <div class="group-avatar">{{ group.avatar }}</div>
            <div>
              <div class="group-name">{{ group.name }}</div>
              <div class="group-members">{{ group.members }}成员</div>
            </div>
          </div>
          <div class="group-desc">{{ group.desc }}</div>
          <div class="group-stats">
            <span>📝 {{ group.topics }} 话题</span>
            <span>👥 {{ group.members }} 成员</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-bar">
      <button class="tab-item" :class="{ active: currentTab === 'media' }" @click="switchTab('media')">书影音</button>
      <button class="tab-item" :class="{ active: currentTab === 'group' }" @click="switchTab('group')">小组</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTab = ref('media');

const mediaList = ref([
  {
    id: 1,
    poster: '🎬',
    title: '《流浪地球2》',
    rating: 8.2,
    desc: '科幻电影，视觉效果震撼，剧情紧凑',
  },
  {
    id: 2,
    poster: '📚',
    title: '《三体》',
    rating: 9.1,
    desc: '科幻小说改编，想象力丰富',
  },
]);

const groupList = ref([
  {
    id: 1,
    avatar: '影',
    name: '电影爱好者',
    members: '12.5万',
    desc: '分享最新电影资讯，讨论经典影片',
    topics: '1.2K',
  },
  {
    id: 2,
    avatar: '书',
    name: '读书会',
    members: '8.3万',
    desc: '好书推荐，读书心得分享',
    topics: '856',
  },
]);

function switchTab(tab: string) {
  currentTab.value = tab;
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

.douban-media {
  background: #f5f5f5;
  padding: 20px;
}

.media-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  display: flex;
}

.media-poster {
  width: 60px;
  height: 80px;
  background: linear-gradient(135deg, #2e7d32, #4caf50);
  border-radius: 6px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.media-info {
  flex: 1;
}

.media-title {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
}

.media-rating {
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 5px;
}

.media-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.douban-group {
  background: #f5f5f5;
  padding: 20px;
}

.group-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.group-avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(135deg, #2e7d32, #4caf50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 10px;
  font-size: 16px;
}

.group-name {
  font-weight: 600;
  margin-bottom: 2px;
  color: #333;
}

.group-members {
  font-size: 12px;
  color: #999;
}

.group-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.group-stats {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
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
  color: #2e7d32;
  font-weight: 600;
}
</style>
