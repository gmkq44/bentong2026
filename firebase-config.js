/* ────────────────────────────────────────────────────────────────
   Firebase 设定 —— 只需要改这一个档案
   ────────────────────────────────────────────────────────────────
   1. 到 https://console.firebase.google.com 建立专案
   2. 左侧「建构 → Realtime Database」→ 建立资料库
      （地区选 Singapore (asia-southeast1)，规则先选「锁定模式」，
        之后用本 repo 的 database.rules.json 覆盖）
   3. 专案设定 ⚙ → 你的应用程式 → 新增「网页应用程式」</>
   4. 把它给你的 firebaseConfig 整段贴到下面，取代 PASTE_HERE

   这些值是「公开设定」，不是密钥 —— Firebase 网页应用程式本来就会
   把它们放在前端，安全性靠 database.rules.json 的规则来管。

   还没填也没关系：页面会自动退回「代码汇总」模式，照样能用。
   ──────────────────────────────────────────────────────────────── */

window.FIREBASE_CONFIG = null; // ← 填好后把这行删掉，取消下面那段的注解

/*
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE.firebaseapp.com",
  databaseURL: "https://PASTE_HERE-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE.appspot.com",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};
*/

/* 同一个资料库想放多趟旅行的话，改这里就好 */
window.TRIP_ID = "bentong2026";
