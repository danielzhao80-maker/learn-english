// 🏅 Learn English's arcade titles: 📚 Bookworm (50 right answers) · 🤫 🔤 Perfect Speller (15 right in a row).
// Run: node tools/test-titles.js   (pulls the real functions out of index.html and runs them with fakes)
const fs = require("fs"), vm = require("vm");
const html = fs.readFileSync(__dirname + "/../index.html", "utf8");
const a = html.indexOf("  // 🏅 Arcade titles"), b = html.indexOf("function checkSpelling() {");
if (a < 0 || b < 0) throw new Error("title code not found");
const store = {};
const ctx = { localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
  document: { createElement: () => ({ style: {}, remove() {} }), body: { appendChild() {} } }, setTimeout: () => 0, JSON, Object, Array, String };
vm.createContext(ctx);
vm.runInContext(html.slice(a, b) + "\nthis.titleRight = titleRight;", ctx);
let ok = true; const check = (p, l) => { if (!p) ok = false; console.log(`  ${p ? "PASS" : "FAIL"} ${l}`); };
const owned = () => (JSON.parse(store["daniels-arcade-v1"] || "{}").owned || []);
for (let i = 0; i < 14; i++) ctx.titleRight(true);
ctx.titleRight(false);
check(!owned().includes("le-perfect"), "14 right then a mistake: no Perfect Speller");
for (let i = 0; i < 15; i++) ctx.titleRight(true);
check(owned().includes("le-perfect"), "🤫 15 right in a row → 🔤 Perfect Speller");
check(!owned().includes("le-bookworm"), "29 right so far: no Bookworm yet");
for (let i = 0; i < 21; i++) ctx.titleRight(true);
check(owned().includes("le-bookworm"), "50 right answers → 📚 Bookworm");
const html2 = html;
check((html2.match(/titleRight\((correct|isCorrect)\);/g) || []).length === 2, "both kinds of question count (spelling and choices)");
console.log(ok ? "\nLEARN ENGLISH TITLES PASS" : "\nLEARN ENGLISH TITLES FAIL"); process.exit(ok ? 0 : 1);
