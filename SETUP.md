# 接上 Firebase — 让全家即时看到投票

做完这份，家人一按「想去」，其他人的画面会立刻更新，不必再传代码。
**全部在浏览器里做，不必装任何东西，大约 10 分钟。**

> 还没做也没关系 —— 页面会自动退回「代码汇总」模式，一样能投票。

---

## 1. 用哪个专案

**专案额度满了？不必建新的。** 这个投票挂在现有专案上完全没问题 ——
资料全写在 `trips/bentong2026/votes` 这一个独立路径底下，
跟你专案里原本的东西各走各的，不会互相影响。

| 你的情况 | 走哪条 |
| --- | --- |
| 还能建新专案 | 建一个干净的最省事 → 走 **1A** |
| 额度满了，有现成专案 | 沿用它，不必新增资料库 → 走 **1B** |

### 1A. 建新专案（约 3 分钟）

1. 打开 <https://console.firebase.google.com>，用你的 Google 帐号登入
2. 「建立专案」→ 名称随便打，例如 `bentong2026`
3. 问你要不要开 Google Analytics → **选「不要」**，省事
4. 左侧「建构」→「**Realtime Database**」→「建立资料库」
5. 地区选 **Singapore (asia-southeast1)** ← 离马来西亚最近
6. 规则先选「**以锁定模式启动**」，然后跳到第 2 步

### 1B. 沿用现有专案（约 1 分钟）

1. 打开 <https://console.firebase.google.com>，挑一个你已经有的专案
2. 左侧「建构」→「**Realtime Database**」
   - **已经有资料库** → 什么都不用做，直接跳到第 2 步
   - **还没有** → 按「建立资料库」，地区选 Singapore，规则选锁定模式

> 免费方案（Spark）一个专案只能有**一个** Realtime Database 实例 ——
> 这没关系，我们本来就是共用同一个资料库、只是写在不同路径下。

**沿用现有专案要注意的两件事：**

- 规则是整个资料库共用的 → **第 2 步一定要用「合并」，不要整份覆盖**，
  否则会把原本 app 的规则洗掉
- 之后想收掉，只删 `trips` 这个节点就好，别删整个资料库

## 2. 套用安全规则（约 3 分钟）

Realtime Database →上方「**规则**」分页。

### 如果是全新的资料库（规则长得像 `{"rules": {".read": false, ".write": false}}`）

整段换成本 repo 的 [`database.rules.json`](database.rules.json)，按「发布」。

### 如果这个资料库已经有别的 app 在用 ← **沿用现有专案走这里**

**不要整份贴上去。** 只要把 `trips` 这一段，插进你现有 `"rules"` 物件里就好：

```jsonc
{
  "rules": {
    // ↓↓↓ 你原本的规则，一个字都不要动 ↓↓↓
    "users":  { ".read": "auth != null", ".write": "auth != null" },
    "orders": { ".read": "auth != null", ".write": "auth != null" },
    // ↑↑↑ 你原本的规则 ↑↑↑

    // ↓↓↓ 只加这一段（从 database.rules.json 复制 "trips" 那块）↓↓↓
    "trips": {
      "$trip": {
        "votes": {
          ".read": true,
          "$voter": {
            ".write": true,
            ".validate": "$voter.length <= 40 && (!newData.exists() || newData.hasChildren(['name', 'picks']))",
            "name":  { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 16" },
            "picks": {
              ".validate": "newData.hasChildren()",
              "$i": { ".validate": "newData.isString() && newData.val().length <= 4 && newData.val().matches(/^[sf][0-9]{1,2}$/)" }
            },
            "updatedAt": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    }
  }
}
```

按「发布」。上面的 `//` 注解记得删掉 —— Firebase 的规则编辑器接受注解，
但贴之前先确认它没跳错误。

**会不会影响原本的 app？不会。** Firebase 规则只往下授权、不往上影响：
`trips` 底下开放，不代表别的路径跟着开放；你原本 `"users"` 那些规则照旧生效。

这份规则做的事：

- 任何人都能读投票、写自己那笔（家人不必注册帐号）
- 但只收 `name`（≤16 字）和 `picks`（只接受 `s1`、`f12` 这种格式的项目代号）
- 其他任何栏位一律拒绝，别人没办法拿你的资料库乱塞东西

## 3. 拿设定贴进档案（约 2 分钟）

1. 左上角齿轮 ⚙ →「专案设定」
2. 拉到最下面「你的应用程式」
   - **已经有网页应用程式**（`</>` 图示那种）→ 直接点它，选「设定」看 config，
     可以**直接沿用，不必新增**
   - **没有** → 按 `</>` 图示，暱称随便打 →「注册应用程式」
3. 它会给你一段 `const firebaseConfig = { ... }`
4. 打开本 repo 的 [`firebase-config.js`](firebase-config.js)：
   - 删掉 `window.FIREBASE_CONFIG = null;` 那一行
   - 把下面被注解包住的那段解开，用你拿到的值取代所有 `PASTE_HERE`

> 一个专案可以有很多个网页应用程式，不占专案额度。
> 沿用现有的也完全没问题 —— config 本来就是同一个专案共用的。

**如果同一个专案里已经有别的旅行/别的用途**，把 `firebase-config.js`
最下面的 `window.TRIP_ID` 改成别的名字（例如 `"bentong2026"` 改 `"cameron2027"`），
资料就会写到 `trips/cameron2027/votes`，两边各自独立、互不干扰。

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
```

接下来的指令**看你的资料库是不是全新的**，选错会出事：

#### 全新的资料库（只给这趟旅行用）

```bash
firebase deploy --only hosting,database
```

这样连规则也会一起上传，不必手动贴。

#### 沿用现有专案的资料库 ← **你如果走 1B，看这里**

```bash
firebase deploy --only hosting     # 注意：没有 ,database
```

> ⚠️ **千万不要带 `database`，也不要跑没有 `--only` 的 `firebase deploy`。**
> `database.rules.json` 是一份**完整**的规则档（根节点写死 `.read: false`），
> 部署它会把整个资料库的规则**整份取代**掉 —— 你原本 app 的
> `users`、`orders` 那些规则会被无声洗掉，那个 app 立刻全部读写失败。
>
> 共用资料库的规则请照**第 2 步**手动在控制台合并，那是唯一安全的做法。
>
> 更保险的话，把 `firebase.json` 里 `"database"` 那一段整个删掉，
> 这样就算手滑跑了 `firebase deploy` 也动不到规则。

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
（沿用现有专案的话，**只删 `trips` 这个节点**，别删整个资料库。）

**专案额度真的满了又不想共用？** 三条路：

1. Firebase 控制台 →「专案设定 → 一般」→ 最下面「删除专案」，
   清掉一个不用的旧专案就空出额度（会有 30 天缓冲期）
2. 用别的 Google 帐号建一个专案，config 贴过来一样能用 ——
   家人不需要登入任何帐号，只是资料库挂在那个帐号底下
3. 什么都不做 —— 页面本来就会自动退回**代码汇总模式**，
   各自投完把 `BT26.xxx` 丢家族群，一个人贴上来汇总，功能不缺
