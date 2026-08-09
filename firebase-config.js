/* ────────────────────────────────────────────────────────────────
   Firebase 设定 —— 只需要改这一个档案
   ────────────────────────────────────────────────────────────────
   1. 到 https://console.firebase.google.com
      —— 专案额度满了不必建新的，沿用现有专案就行
   2. 左侧「建构 → Realtime Database」
      已经有资料库就直接用；还没有才按「建立资料库」
      （地区选 Singapore (asia-southeast1)，规则先选「锁定模式」）
   3. 「规则」分页套用 database.rules.json
      ⚠ 资料库已经有别的 app 在用的话，只把 "trips" 那一段插进现有规则里，
        千万别整份覆盖 —— 详见 SETUP.md 第 2 步
   4. 专案设定 ⚙ → 你的应用程式 → 用现成的网页应用程式，或新增一个 </>
   5. 把它给你的 firebaseConfig 整段贴到下面，取代 PASTE_HERE

   投票资料只写在 trips/<TRIP_ID>/votes 底下，与专案里其他资料无关。

   这些值是「公开设定」，不是密钥 —— Firebase 网页应用程式本来就会
   把它们放在前端，安全性靠 database.rules.json 的规则来管。

   还没填也没关系：页面会自动退回「代码汇总」模式，照样能用。
   ──────────────────────────────────────────────────────────────── */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCPbBMADJuURv0vEygSHmhLy9GSVg1fSjY",
  authDomain: "q44travel.firebaseapp.com",
  databaseURL: "https://q44travel-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "q44travel",
  storageBucket: "q44travel.firebasestorage.app",
  messagingSenderId: "1007248105413",
  appId: "1:1007248105413:web:fe89155fece57c1860f5ac"
};

/* 同一个资料库想放多趟旅行的话，改这里就好 */
window.TRIP_ID = "bentong2026";
