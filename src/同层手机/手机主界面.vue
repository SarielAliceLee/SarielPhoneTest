<template>
  <div class="home-screen">
    <!-- 时间显示区域 -->
    <div class="time-section">
      <div class="main-time">{{ currentTime }}</div>
      <div class="date">{{ currentDate }}</div>
      <div class="greeting">{{ greeting }}</div>
    </div>

    <!-- 应用网格 -->
    <div class="app-grid">
      <div class="app-icon" @click="openApp('wechat')">
        <div class="icon wechat">
          <div class="icon-content">💬</div>
        </div>
        <div class="app-name">微信</div>
      </div>

      <div class="app-icon" @click="openApp('fortune')">
        <div class="icon fortune">
          <div class="icon-content">🔮</div>
        </div>
        <div class="app-name">运势</div>
      </div>

      <div class="app-icon" @click="openApp('weibo')">
        <div class="icon weibo">
          <div class="icon-content">微</div>
        </div>
        <div class="app-name">微博</div>
      </div>

      <div class="app-icon" @click="openApp('douban')">
        <div class="icon douban">
          <div class="icon-content">豆</div>
        </div>
        <div class="app-name">豆瓣</div>
      </div>

      <div class="app-icon" @click="openApp('nox')">
        <div class="icon nox">
          <div class="icon-content">🌘</div>
        </div>
        <div class="app-name">Nox</div>
      </div>

      <div class="app-icon" @click="openApp('treehole')">
        <div class="icon treehole">
          <div class="icon-content">💫</div>
        </div>
        <div class="app-name">树洞</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const currentTime = ref('');
const currentDate = ref('');
const greeting = ref('');

// 更新时间
function updateTime() {
  const now = new Date();

  // 更新时间
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // 更新日期
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 更新问候语
  const hour = now.getHours();
  if (hour < 6) {
    greeting.value = '夜深了，注意休息';
  } else if (hour < 12) {
    greeting.value = '早上好';
  } else if (hour < 14) {
    greeting.value = '中午好';
  } else if (hour < 18) {
    greeting.value = '下午好';
  } else if (hour < 22) {
    greeting.value = '晚上好';
  } else {
    greeting.value = '夜深了，注意休息';
  }
}

// 打开应用
function openApp(appName: string) {
  router.push(`/${appName}`);
}

// 生命周期
let timeInterval: number;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.home-screen {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.time-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  padding: 40px 0;
}

.main-time {
  font-size: 48px;
  font-weight: 300;
  color: white;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.date {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: 400;
  margin-bottom: 8px;
}

.greeting {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-weight: 300;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  padding: 20px 0;
  position: relative;
  z-index: 2;
}

.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: transform 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.app-icon:hover {
  transform: scale(1.1);
}

.app-icon:hover .icon {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.app-icon:active {
  transform: scale(0.95);
}

.icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.icon-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.app-name {
  font-size: 12px;
  text-align: center;
  font-weight: 500;
  color: white;
}

/* 不同APP的颜色 - 毛玻璃风格 */
.wechat {
  background: linear-gradient(135deg, rgba(7, 193, 96, 0.8), rgba(0, 212, 170, 0.6));
}

.fortune {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.8), rgba(255, 167, 38, 0.6));
}

.weibo {
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.8), rgba(240, 98, 146, 0.6));
}

.douban {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.8), rgba(76, 175, 80, 0.6));
}

.nox {
  background: linear-gradient(135deg, rgba(66, 66, 66, 0.8), rgba(117, 117, 117, 0.6));
}

.treehole {
  background: linear-gradient(135deg, rgba(142, 36, 170, 0.8), rgba(186, 104, 200, 0.6));
}

/* 响应式设计 */
@media (max-width: 480px) {
  .phone-container {
    width: 90vw;
    height: 90vh;
    max-width: 350px;
    max-height: 700px;
  }
}
</style>
