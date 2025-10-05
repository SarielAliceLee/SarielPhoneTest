<template>
  <div class="app-screen">
    <!-- 应用头部 -->
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">微博</div>
      <button class="app-action">✏️</button>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <!-- 首页 -->
      <div v-if="currentTab === 'home'" class="weibo-home">
        <div v-for="post in weiboPosts" :key="post.id" class="weibo-post">
          <div class="weibo-user">
            <div class="weibo-avatar" :style="{ background: post.avatarColor }">
              {{ post.avatar }}
            </div>
            <div>
              <div class="weibo-name">{{ post.name }}</div>
              <div class="weibo-time">{{ post.time }}</div>
            </div>
          </div>
          <div class="weibo-content-text">{{ post.content }}</div>
          <div class="weibo-actions">
            <span>👍 {{ post.likes }}</span>
            <span>💬 {{ post.comments }}</span>
            <span>🔄 {{ post.reposts }}</span>
          </div>
        </div>
      </div>

      <!-- 热搜 -->
      <div v-if="currentTab === 'trending'" class="weibo-trending">
        <div v-for="trend in trendingList" :key="trend.id" class="trending-item">
          <div class="trending-rank">{{ trend.rank }}</div>
          <div class="trending-content">
            <div class="trending-title">{{ trend.title }}</div>
            <div class="trending-desc">{{ trend.desc }}</div>
          </div>
          <div class="trending-hot">热</div>
        </div>
      </div>

      <!-- 个人资料 -->
      <div v-if="currentTab === 'profile'" class="weibo-profile">
        <div class="profile-header">
          <div class="profile-avatar">我</div>
          <div class="profile-name">我的微博</div>
          <div class="profile-id">@我的微博账号</div>
        </div>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-number">128</div>
            <div class="stat-label">关注</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1.2K</div>
            <div class="stat-label">粉丝</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">56</div>
            <div class="stat-label">微博</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部标签栏 -->
    <div class="tab-bar">
      <button class="tab-item" :class="{ active: currentTab === 'home' }" @click="switchTab('home')">首页</button>
      <button class="tab-item" :class="{ active: currentTab === 'trending' }" @click="switchTab('trending')">
        热搜
      </button>
      <button class="tab-item" :class="{ active: currentTab === 'profile' }" @click="switchTab('profile')">我的</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const currentTab = ref('home');

// 微博帖子数据
const weiboPosts = ref([
  {
    id: 1,
    name: '微博用户',
    avatar: '微',
    avatarColor: 'linear-gradient(135deg, #e91e63, #f06292)',
    time: '2小时前',
    content: '今天天气真不错，适合出去走走！',
    likes: 12,
    comments: 5,
    reposts: 3,
  },
  {
    id: 2,
    name: '热门话题',
    avatar: '热',
    avatarColor: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    time: '5小时前',
    content: '#今日话题# 分享你的美好瞬间',
    likes: 128,
    comments: 45,
    reposts: 23,
  },
]);

// 热搜数据
const trendingList = ref([
  {
    id: 1,
    rank: 1,
    title: '#今日话题#',
    desc: '分享你的美好瞬间',
  },
  {
    id: 2,
    rank: 2,
    title: '#天气真好#',
    desc: '今天阳光明媚',
  },
  {
    id: 3,
    rank: 3,
    title: '#美食推荐#',
    desc: '发现一家超棒的餐厅',
  },
]);

// 切换标签
function switchTab(tab: string) {
  currentTab.value = tab;
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

/* 微博首页样式 */
.weibo-home {
  background: #f5f5f5;
}

.weibo-post {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
}

.weibo-user {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.weibo-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 10px;
  font-size: 16px;
}

.weibo-name {
  font-weight: 600;
  margin-bottom: 2px;
  color: #333;
}

.weibo-time {
  font-size: 12px;
  color: #999;
}

.weibo-content-text {
  line-height: 1.5;
  margin-bottom: 10px;
  color: #333;
}

.weibo-actions {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

/* 热搜样式 */
.weibo-trending {
  background: #f5f5f5;
  padding: 20px;
}

.trending-item {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trending-rank {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 18px;
  margin-right: 15px;
}

.trending-content {
  flex: 1;
}

.trending-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.trending-desc {
  color: #666;
  font-size: 14px;
}

.trending-hot {
  color: #ff6b6b;
  font-size: 12px;
}

/* 个人资料样式 */
.weibo-profile {
  background: #f5f5f5;
  padding: 20px;
}

.profile-header {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e91e63, #f06292);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  margin: 0 auto 15px;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.profile-id {
  color: #666;
  font-size: 14px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #e91e63;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
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
  color: #e91e63;
  font-weight: 600;
}
</style>
