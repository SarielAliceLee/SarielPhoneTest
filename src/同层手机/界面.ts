import { createMemoryHistory, createRouter } from 'vue-router';
import NoxApp from './Nox界面.vue';
import WechatApp from './微信界面.vue';
import WeiboApp from './微博界面.vue';
import PhoneHome from './手机主界面.vue';
import TreeholeApp from './树洞界面.vue';
import AddContact from './添加联系人.vue';
import App from './界面.vue';
import ChatApp from './聊天界面.vue';
import DoubanApp from './豆瓣界面.vue';
import FortuneApp from './运势界面.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: PhoneHome },
    { path: '/wechat', component: WechatApp },
    { path: '/add-contact', component: AddContact },
    { path: '/chat', component: ChatApp },
    { path: '/fortune', component: FortuneApp },
    { path: '/weibo', component: WeiboApp },
    { path: '/douban', component: DoubanApp },
    { path: '/nox', component: NoxApp },
    { path: '/treehole', component: TreeholeApp },
  ],
});
router.replace('/');

$(() => {
  createApp(App).use(router).mount('#app');
});
