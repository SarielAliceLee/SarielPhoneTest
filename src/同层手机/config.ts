// 配置文件 - 用于管理jsdelivr URL
export const CONFIG = {
  // jsdelivr基础URL
  JSDELIVR_BASE: 'https://cdn.jsdelivr.net/gh',

  // GitHub仓库信息
  GITHUB_USER: 'SarielAliceLee', // 请替换为您的GitHub用户名
  GITHUB_REPO: 'SarielPhoneTest', // 请替换为您的仓库名
  BRANCH: 'main', // 或 'master'

  // 图片路径配置
  IMAGES: {
    WALLPAPER: 'src/image/壁纸.png',
    // 可以添加更多图片路径
    // AVATAR: 'src/image/avatar.png',
    // ICON: 'src/image/icon.png',
  },
};

// 构建图片URL的工具函数
export const getImageUrl = (imagePath: string): string => {
  return `${CONFIG.JSDELIVR_BASE}/${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}@${CONFIG.BRANCH}/${imagePath}`;
};

// 预定义的图片URL
export const IMAGE_URLS = {
  WALLPAPER: getImageUrl(CONFIG.IMAGES.WALLPAPER),
  // 可以添加更多预定义的URL
  // AVATAR: getImageUrl(CONFIG.IMAGES.AVATAR),
  // ICON: getImageUrl(CONFIG.IMAGES.ICON),
};
