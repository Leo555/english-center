# 本地视频存放说明

视频学习专区支持两种视频来源，配置在 `src/data/videos.ts` 的 `VIDEOS` 数组中：

## 1. 本地视频文件（source: 'local'）

请将你**拥有合法版权/使用授权**的视频文件放到本目录下，按级别分子目录，例如：

```
public/videos/l1/greetings.mp4
public/videos/l2/my-family.mp4
```

然后在 `src/data/videos.ts` 中把对应条目改为：

```ts
{ id: 'L1-V1', levelId: 'L1', title: '打招呼', titleEn: 'Greetings', desc: '...', emoji: '👋',
  source: 'local', localSrc: '/videos/l1/greetings.mp4' }
```

## 2. YouTube 官方视频嵌入（source: 'youtube'）

如果是官方发布在 YouTube 且允许 embed 嵌入的公开视频，无需下载文件，直接填 YouTube 视频 ID：

```ts
{ id: 'L1-V1', ..., source: 'youtube', youtubeId: 'xxxxxxxxxxx' }
```

（`youtubeId` 是视频链接 `https://www.youtube.com/watch?v=xxxxxxxxxxx` 中 `v=` 后面的那段）

## ⚠️ 版权提醒

- 请勿下载、转存、托管未获授权的第三方版权视频（包括教材出版社的付费课程视频）。
- 本目录下的视频文件不应提交到公共代码仓库（如涉及版权内容），建议在 `.gitignore` 中排除，或仅在私有部署环境中使用。
