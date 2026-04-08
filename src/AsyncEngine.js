/**
 * AsyncEngine.js
 * Mock network layer + async pipeline + profiling interceptor
 */
const mockFetch = (data) => {
  return new Promise((resolve, reject) => {
    const latency = Math.floor(Math.random() * 1000) + 500;
    setTimeout(() => {
      if (data) resolve({ status: 200, payload: data });
      else reject({ status: 500, message: "No data provided" });
    }, latency);
  });
};

const withProfiling = async (fn, label = "request") => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return {
    result,
    profile: {
      label,
      duration: end - start
    }
  };
};

const fetchAndStore = async (data, hashTable, store) => {
  const response = await mockFetch(data);
  if (response.status === 200) {
    hashTable.set(data.id, data);
    store.getState().lastUpdate = data;
  }
  return response;
};

export { mockFetch, withProfiling, fetchAndStore };