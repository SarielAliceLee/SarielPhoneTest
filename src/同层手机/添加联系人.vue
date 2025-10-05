<template>
  <div class="app-screen">
    <!-- 应用头部 -->
    <div class="app-header">
      <button class="app-back" @click="goBack">←</button>
      <div class="app-title">添加联系人</div>
      <div></div>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <div class="add-contact-form">
        <!-- 第一行：选择私聊或群聊 -->
        <div class="form-row">
          <div class="form-label">类型</div>
          <div class="radio-group">
            <label class="radio-item">
              <input v-model="contactType" type="radio" value="private" name="contactType" />
              <span class="radio-text">私聊</span>
            </label>
            <label class="radio-item">
              <input v-model="contactType" type="radio" value="group" name="contactType" />
              <span class="radio-text">群聊</span>
            </label>
          </div>
        </div>

        <!-- 第二行：输入姓名 -->
        <div class="form-row">
          <div class="form-label">{{ contactType === 'private' ? '好友姓名' : '群名' }}</div>
          <input
            v-model="contactName"
            type="text"
            class="form-input"
            :placeholder="contactType === 'private' ? '请输入好友姓名' : '请输入群名'"
          />
        </div>

        <!-- 第三行：输入头像 -->
        <div class="form-row">
          <div class="form-label">头像</div>
          <input v-model="contactAvatar" type="text" class="form-input" placeholder="请输入头像URL或emoji" />
        </div>

        <!-- 第四行：是否可攻略角色（仅私聊显示） -->
        <div v-if="contactType === 'private'" class="form-row">
          <div class="form-label">是否可攻略角色</div>
          <label class="checkbox-item">
            <input v-model="isMainCharacter" type="checkbox" />
            <span class="checkbox-text">是主要角色</span>
          </label>
        </div>

        <!-- 第五行：相识时间（仅私聊显示） -->
        <div v-if="contactType === 'private'" class="form-row">
          <div class="form-label">相识时间</div>
          <input v-model="meetTime" type="datetime-local" class="form-input" />
        </div>

        <!-- 群聊成员（仅群聊显示） -->
        <div v-if="contactType === 'group'" class="form-row">
          <div class="form-label">群成员</div>
          <input v-model="groupMembers" type="text" class="form-input" placeholder="请输入群成员，用逗号分隔" />
        </div>

        <!-- 第六行：确定按钮 -->
        <div class="form-row">
          <button class="submit-button" :disabled="!isFormValid" @click="submitContact">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const contactType = ref('private');
const contactName = ref('');
const contactAvatar = ref('');
const isMainCharacter = ref(false);
const meetTime = ref('');
const groupMembers = ref('');

// 表单验证
const isFormValid = computed(() => {
  if (!contactName.value.trim() || !contactAvatar.value.trim()) {
    return false;
  }

  if (contactType.value === 'private') {
    return meetTime.value.trim() !== '';
  } else {
    return groupMembers.value.trim() !== '';
  }
});

// 返回
function goBack() {
  router.push('/wechat');
}

// 提交联系人
async function submitContact() {
  try {
    // 获取当前角色绑定的世界书
    const charWorldbooks = getCharWorldbookNames('current');
    const primaryWorldbook = charWorldbooks.primary;

    if (!primaryWorldbook) {
      alert('当前角色没有绑定主世界书');
      return;
    }

    // 获取世界书内容
    const worldbook = await getWorldbook(primaryWorldbook);

    // 查找"角色列表"条目
    const characterListEntry = worldbook.find(entry => entry.name === '角色列表');

    if (!characterListEntry) {
      console.log('未找到"角色列表"条目');
      return;
    }

    // 构建新联系人数据
    let newContactLine = '';

    if (contactType.value === 'private') {
      // 私聊格式：姓名|头像地址|是否可攻略主要角色|和用户相遇时间
      const meetDate = new Date(meetTime.value);
      const formattedTime = meetDate.toUTCString();
      newContactLine = `${contactName.value}|${contactAvatar.value}|${isMainCharacter.value}|${formattedTime}`;
    } else {
      // 群聊格式：群名|群成员|群头像
      newContactLine = `${contactName.value}|${groupMembers.value}|${contactAvatar.value}`;
    }

    // 更新世界书内容
    const updatedContent = characterListEntry.content + '\n' + newContactLine;

    // 更新世界书条目
    const updatedEntry = {
      ...characterListEntry,
      content: updatedContent,
    };

    // 替换世界书条目
    const updatedWorldbook = worldbook.map(entry => (entry.name === '角色列表' ? updatedEntry : entry));

    await replaceWorldbook(primaryWorldbook, updatedWorldbook);

    alert('联系人添加成功！');
    router.push('/wechat');
  } catch (error) {
    console.error('添加联系人失败:', error);
    alert('添加联系人失败，请重试');
  }
}
</script>

<style scoped>
.add-contact-form {
  padding: 24px 20px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  min-height: calc(100vh - 100px);
  border-radius: 0 0 12px 12px;
}

.form-row {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
  display: block;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  background: #fafbfc;
  transition: all 0.3s ease;
  color: #2c3e50;
}

.form-input:focus {
  outline: none;
  border-color: #007aff;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: #95a5a6;
  font-size: 13px;
}

.radio-group {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.radio-item:hover {
  background: rgba(0, 122, 255, 0.05);
}

.radio-item input[type='radio'] {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  accent-color: #007aff;
}

.radio-text {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkbox-item:hover {
  background: rgba(0, 122, 255, 0.05);
}

.checkbox-item input[type='checkbox'] {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  accent-color: #007aff;
}

.checkbox-text {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.submit-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  letter-spacing: 0.5px;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.submit-button:disabled {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 添加一些微妙的动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-row {
  animation: fadeInUp 0.6s ease-out;
}

.form-row:nth-child(1) {
  animation-delay: 0.1s;
}
.form-row:nth-child(2) {
  animation-delay: 0.2s;
}
.form-row:nth-child(3) {
  animation-delay: 0.3s;
}
.form-row:nth-child(4) {
  animation-delay: 0.4s;
}
.form-row:nth-child(5) {
  animation-delay: 0.5s;
}
.form-row:nth-child(6) {
  animation-delay: 0.6s;
}
.form-row:nth-child(7) {
  animation-delay: 0.7s;
}
.form-row:nth-child(8) {
  animation-delay: 0.8s;
}
</style>
