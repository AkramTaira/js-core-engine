/**
 * App.js
 * Entry point & orchestrator: profiling + inheritance + integration
 */

import { HashTable, DoublyLinkedList } from "./DataStructures.js";
import { Store } from "./StateManagement.js";
import { withProfiling, fetchAndStore } from "./AsyncEngine.js";

// =============== Simple Logger ===============
const Logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};

// =============== Inheritance Simulation (Prototype) ===============
function BaseUser(name) {
  this.name = name;
  this.role = "user";
}
BaseUser.prototype.canAccessStore = function () {
  return true;
};

function AdminUser(name) {
  BaseUser.call(this, name);
  this.role = "admin";
}
AdminUser.prototype = Object.create(BaseUser.prototype);
AdminUser.prototype.constructor = AdminUser;
AdminUser.prototype.canAccessStore = function () {
  return true;
};

// =============== Core Setup ===============
const store = new Store({ lastUpdate: null });
const table = new HashTable(50);
const history = new DoublyLinkedList();

store.subscribe((change) => {
  Logger.info(`State changed: ${JSON.stringify(change)}`);
  const el = document.getElementById("lastState");
  if (!el) return;
  if(change.lastUpdate){
    el.textContent = `Last Update → id: ${change.lastUpdate.id}, value: ${change.lastUpdate.value}`;
  } else{
    const key = Object.keys(change)[0];
    el.textContent = `Updated: ${key}`;
  }
});

// =============== Stress Test Data ===============
const records = [];
for (let i = 0; i < 10000; i++) {
  records.push({ id: `id_${i}`, value: Math.random() });
}

// =============== Profiling: HashTable vs Array ===============
const arraySearch = (arr, id) => arr.find((item) => item.id === id);

const profileArray = () => {
  const start = performance.now();
  for (let r of records) {
    arraySearch(records, r.id);
  }
  const end = performance.now();
  return end - start;
};

const profileHash = () => {
  const start = performance.now();
  for (let r of records) {
    table.set(r.id, r);
  }
  for (let r of records) {
    table.get(r.id);
  }
  const end = performance.now();
  return end - start;
};

const arrayTime = profileArray();
const hashTime = profileHash();
const efficiency = ((arrayTime - hashTime) / arrayTime) * 100;

// =============== UI Render ===============
const setText = (id, text) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
};

const setBarWidth = (id, percent) => {
  const el = document.getElementById(id);
  if (el) el.style.width = `${percent}%`;
};

const maxTime = Math.max(arrayTime, hashTime);
const arrayPercent = (arrayTime / maxTime) * 100;
const hashPercent = (hashTime / maxTime) * 100;

setText("arrayTime", `${arrayTime.toFixed(2)} ms`);
setText("hashTime", `${hashTime.toFixed(2)} ms`);
setText("efficiency", `${efficiency.toFixed(2)} %`);

setBarWidth("arrayBar", arrayPercent);
setBarWidth("hashBar", hashPercent);

const perfNote = `HashTable is faster because it provides O(1) lookup on average, while Array search is O(n).`;
setText("perfNote", perfNote);

// =============== Async Pipeline Example ===============
(async () => {
  const sample = { id: "network_1", value: 42 };

  const { result, profile } = await withProfiling(
    () => fetchAndStore(sample, table, store),
    "mockFetch"
  );

  history.append(result);

  setText("asyncTime", `${profile.duration.toFixed(2)} ms`);
  setText("asyncStatus", result.status === 200 ? "Success" : "Failed");

  Logger.info(`Async profile: ${profile.duration.toFixed(2)} ms`);
})();