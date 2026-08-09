# 接上 Firebase — 让全家即时看到投票

做完这份，家人一按「想去」，其他人的画面会立刻更新，不必再传代码。
**全部在浏览器里做，不必装任何东西，大约 10 分钟。**

> 还没做也没关系 —— 页面会自动退回「代码汇总」模式，一样能投票。

---

## 1. 建立 Firebase 专案（约 3 分钟）

1. 打开 <https://console.firebase.google.com>，用你的 Google 帐号登入
2. 「建立专案」→ 名称随便打，例如 `bentong2026`
3. 问你要不要开 Google Analytics → **选「不要」**，省事
4. 等它建好，按「继续」

## 2. 开 Realtime Database（约 2 分钟）

1. 左侧选单 →「建构」→「**Realtime Database**」→「建立资料库」
2. 地区选 **Singapore (asia-southeast1)** ← 离马来西亚最近，最快
3. 安全性规则先选「**以锁定模式启动**」（下一步会换掉）
4. 建好后切到上方「**规则**」分页，把整段内容换成本 repo 的
   [`database.rules.json`](database.rules.json)，按「发布」

这份规则做的事：

- 任何人都能读投票、写自己那笔（家人不必注册帐号）
- 但只收 `name`（≤16 字）和 `picks`（只接受 `s1`、`f12` 这种格式的项目代号）
- 其他任何栏位一律拒绝，别人没办法拿你的资料库乱塞东西

## 3. 拿设定贴进档案（约 2 分钟）

1. 左上角齿轮 ⚙ →「专案设定」
2. 拉到最下面「你的应用程式」→ 按 **`</>`（网页）** 图示
3. 暱称随便打 → 「注册应用程式」
4. 它会给你一段 `const firebaseConfig = { ... }`
5. 打开本 repo 的 [`firebase-config.js`](firebase-config.js)：
   - 删掉 `window.FIREBASE_CONFIG = null;` 那一行
   - 把下面被注解包住的那段解开，用你拿到的值取代所有 `PASTE_HERE`

`databaseURL` 那一行一定要有 —— 如果 Firebase 给的设定里没有，
回到 Realtime Database 页面，把最上面那串
`https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app` 抄进去。

## 4. 放上网（二选一）

### A. GitHub Pages（不必装东西，推荐）

1. GitHub repo →「Settings」→「Pages」
2. Source 选 **Deploy from a branch**，branch 选
   `claude/bentong-trip-itinerary-webpage-fph1yf`，资料夹选 `/ (root)`
3. 等一两分钟，网址会长这样：
   `https://gmkq44.github.io/bentong2026/`
4. 把这个网址丢进家族群

### B. Firebase Hosting（要用指令列）

repo 里已经放好 `firebase.json` 和 `.firebaserc`。
先把 `.firebaserc` 里的 `PASTE_YOUR_FIREBASE_PROJECT_ID` 换成你的专案 ID，然后：

```bash
npm install -g firebase-tools
firebase login                    # 会开浏览器让你登入 Google
firebase deploy --only hosting,database
```

这样连规则也会一起上传，不必手动贴。

---

## 怎么知道成功了

打开网页拉到「家庭投票」，最上面那条状态列：

| 显示 | 意思 |
| --- | --- |
| 🟢 **已连线 · 全家即时同步（N 人已投）** | 成功了，可以把网址发给家人 |
| ⚪ 代码汇总模式 | 设定还没填、或档案没载到 |
| 🟠 读不到投票资料 | 设定对了但规则没套用 → 回第 2 步第 4 点 |

开两个浏览器分页各投一票，另一个分页没重整就自己更新 —— 那就是通了。

---

## 几件小事

**费用** — Firebase 免费方案（Spark）完全够。七个人投票的资料量大概几 KB，
免费额度是每月 10GB 传输，用不到千分之一。不必绑信用卡。

**隐私** — 投票资料是「谁投了哪几项」，没有其他个资。规则允许任何拿到
网址的人读写，所以别把网址贴到公开的地方。旅行结束后想收掉，
到 Firebase 控制台把资料库删掉就好。

**投票不见了？** — 每台装置有自己的身分代号，存在浏览器里。
清掉浏览器资料或换手机，会被当成新的人。同一个人重投会覆盖旧的，不会重复计票。

**想重来** — Firebase 控制台 → Realtime Database → 找到 `trips/bentong2026/votes`
→ 删掉整个节点，所有人的画面会立刻清空。
