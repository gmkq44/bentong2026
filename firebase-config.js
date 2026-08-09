/* ────────────────────────────────────────────────────────────────
   Firebase 设定 —— 专案 q44travel
   ────────────────────────────────────────────────────────────────
   ⚠ databaseURL 这行是照「Singapore (asia-southeast1)」推出来的。
     建好 Realtime Database 后，到控制台 Realtime Database 页面，
     把最上面那串网址跟这里对一下：

       Singapore  → https://q44travel-default-rtdb.asia-southeast1.firebasedatabase.app
       us-central1→ https://q44travel-default-rtdb.firebaseio.com

     不一样的话，以控制台显示的为准，改这一行就好。

   这些值是「公开设定」，不是密钥 —— Firebase 网页应用程式本来就会
   把它们放在前端，安全性靠 database.rules.json 的规则来管。

   连不上时页面会自动退回「代码汇总」模式，照样能用。
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
