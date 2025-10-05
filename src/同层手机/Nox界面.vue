<template>
  <div class="app-screen">
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">Nox</div>
      <button class="app-action">🌘</button>
    </div>

    <div class="app-content">
      <div v-if="currentTab === 'community'" class="nox-community">
        <div v-for="post in communityPosts" :key="post.id" class="nox-post">
          <div class="nox-user">
            <div class="nox-avatar">{{ post.avatar }}</div>
            <div>
              <div class="nox-name">{{ post.name }}</div>
              <div class="nox-time">{{ post.time }}</div>
            </div>
          </div>
          <div class="nox-content-text">{{ post.content }}</div>
          <div class="nox-actions">
            <span>❤️ {{ post.likes }}</span>
            <span>💬 {{ post.comments }}</span>
            <span>🔄 {{ post.reposts }}</span>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'explore'" class="nox-explore">
        <div v-for="category in exploreCategories" :key="category.id" class="explore-category">
          <div class="category-title">{{ category.title }}</div>
          <div class="category-tags">
            <span v-for="tag in category.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-bar">
      <button class="tab-item" :class="{ active: currentTab === 'community' }" @click="switchTab('community')">
        社区
      </button>
      <button class="tab-item" :class="{ active: currentTab === 'explore' }" @click="switchTab('explore')">探索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTab = ref('community');

const communityPosts = ref([
  {
    id: 1,
    name: '月食',
    avatar: '🌙',
    time: '3小时前',
    content: '今晚的月亮特别美，分享一张月食照片',
    likes: 23,
    comments: 8,
    reposts: 5,
  },
  {
    id: 2,
    name: '神秘学',
    avatar: '🔮',
    time: '5小时前',
    content: '塔罗牌占卜，探索内心深处的秘密',
    likes: 45,
    comments: 12,
    reposts: 8,
  },
]);

const exploreCategories = ref([
  {
    id: 1,
    title: '🌙 月相文化',
    tags: ['月食', '满月', '新月', '月相'],
  },
  {
    id: 2,
    title: '🔮 神秘学',
    tags: ['塔罗', '占星', '水晶', '冥想'],
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

.nox-community {
  background: linear-gradient(135deg, #424242, #757575);
  color: white;
  padding: 20px;
}

.nox-post {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.nox-user {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.nox-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 16px;
}

.nox-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.nox-time {
  font-size: 12px;
  opacity: 0.7;
}

.nox-content-text {
  line-height: 1.5;
  margin-bottom: 10px;
}

.nox-actions {
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.nox-explore {
  background: linear-gradient(135deg, #424242, #757575);
  color: white;
  padding: 20px;
}

.explore-category {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
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
  color: #424242;
  font-weight: 600;
}
</style>
