<template>
  <div class="phone-container">
    <div class="phone-screen">
      <!-- 壁纸背景 -->
      <div class="wallpaper"></div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <div class="time">{{ currentTime }}</div>
        <div class="status-icons">
          <div class="signal">
            <div class="signal-bar"></div>
            <div class="signal-bar"></div>
            <div class="signal-bar"></div>
            <div class="signal-bar"></div>
          </div>
          <div class="wifi-icon">📶</div>
          <div class="battery">
            <div class="battery-level"></div>
            <div class="battery-tip"></div>
          </div>
        </div>
      </div>

      <!-- 内容容器 -->
      <div class="content-container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import './共享样式.css';

// 响应式数据
const currentTime = ref('');

// 更新时间
function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
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
.phone-container {
  width: 320px;
  height: 640px;
  background: #000;
  border-radius: 30px;
  padding: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  margin: 0 auto;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 22px;
  overflow: hidden;
  position: relative;
}

.wallpaper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../image/壁纸.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
}

.status-bar {
  height: 44px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.time {
  font-size: 16px;
  font-weight: 600;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signal {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 12px;
}

.signal-bar {
  width: 3px;
  background: white;
  border-radius: 1px;
}

.signal-bar:nth-child(1) {
  height: 4px;
}
.signal-bar:nth-child(2) {
  height: 6px;
}
.signal-bar:nth-child(3) {
  height: 8px;
}
.signal-bar:nth-child(4) {
  height: 10px;
}

.wifi-icon {
  font-size: 12px;
}

.battery {
  width: 24px;
  height: 12px;
  border: 2px solid white;
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
}

.battery-level {
  width: 80%;
  height: 100%;
  background: #4caf50;
  border-radius: 1px;
  margin: 1px;
}

.battery-tip {
  position: absolute;
  right: -4px;
  top: 2px;
  width: 2px;
  height: 6px;
  background: white;
  border-radius: 0 1px 1px 0;
}

.content-container {
  height: calc(100% - 44px);
  position: relative;
  z-index: 2;
  overflow: hidden;
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
