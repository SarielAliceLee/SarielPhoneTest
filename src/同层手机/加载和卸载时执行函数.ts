// 在界面加载好后执行某个函数
// 注意: 必须使用 `$()` 而不是 `document.addEventListener('DOMContentLoaded'`, 后者会让实时修改失效
$(() => {
  toastr.success('手机界面已成功加载!', '欢迎使用!');
  console.log('手机界面初始化完成');

  // 初始化角色列表条目
  initCharacterListEntry();
});

// 初始化角色列表条目
async function initCharacterListEntry() {
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

    // 查找"角色列表"条目
    const characterListEntry = worldbook.find(entry => entry.name === '角色列表');

    if (!characterListEntry) {
      console.log('未找到"角色列表"条目，正在创建...');

      // 创建新的角色列表条目
      const newEntry = {
        uid: `角色列表_${Date.now()}`,
        name: '角色列表',
        enabled: true,
        strategy: 'green_light',
        position: 0,
        content: '',
        probability: 0,
        recursion: false,
        effect: 'never_activate',
        extra: {},
      };

      // 创建世界书条目
      await createWorldbookEntries(primaryWorldbook, [newEntry]);
      console.log('角色列表条目创建成功');
    }
  } catch (error) {
    console.error('初始化角色列表条目失败:', error);
  }
}

// 在界面卸载时执行某个函数
$(window).on('pagehide', () => {
  toastr.info('手机界面已卸载!', '再见!');
  console.log('手机界面已卸载');
});
