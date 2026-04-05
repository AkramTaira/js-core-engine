# The JS Core Engine

A professional, systems‑thinking implementation of a custom JS core engine that demonstrates data structures, reactive state, async simulation, and performance profiling in one unified project.
This engine was designed to operate efficiently in low-bandwidth environments (like Yemen) by implementing in-memory caching via HashTables and minimizing unnecessary network overhead through a reactive state-management pattern.

---

## What This Project Demonstrates

- HashTable vs Array performance
- Reactive State Management using Proxy + Observer Pattern
- Async Engine simulation with profiling
- UI dashboard that visualizes results in real time

---

## Architecture Flow

```
AsyncEngine (mockFetch)
        │
        ▼
DataStructures (HashTable)
        │
        ▼
StateManagement (Store + Proxy)
        │
        ▼
UI Dashboard (index.html)
```

---

## Core Components

### 1) DataStructures.js

- HashTable with chaining + dynamic resizing
- DoublyLinkedList to store history

### 2) StateManagement.js

- Reactive store with Proxy
- Observer pattern via `subscribe()`

### 3) AsyncEngine.js

- Simulated network requests
- Profiling wrapper to measure execution time

### 4) App.js

- Orchestrates all modules
- Runs stress test
- Renders dashboard results

---

## Performance Dashboard (UI Output)

The dashboard shows:

- Array search time
- HashTable search time
- Efficiency gain (%)
- Last reactive state update
- Async request duration + status

This makes the system understandable without reading the code.

---

## Complexity Analysis

| Operation | Structure   | Complexity |
| :-------- | :---------- | :--------- |
| Insert    | HashTable   | O(1)       |
| Search    | HashTable   | O(1)       |
| Insert    | Linked List | O(1)       |
| Search    | Array       | O(n)       |

---

## Why These Choices

### Why Chaining in HashTable?

Chaining keeps collisions simple and maintains near O(1) access in average cases.

### Why Proxy + Observer?

It makes the state reactive: when any property changes, the UI updates automatically.

---

## Run Locally

### Option A — Live Server (Recommended)

1. Right click `index.html`
2. Open with Live Server

### Option B — Python HTTP Server

```bash
python -m http.server 5500
```

Then open:

```
http://localhost:5500
```

---

## Project Structure

```
/src
  ├── App.js
  ├── DataStructures.js
  ├── StateManagement.js
  ├── AsyncEngine.js
/styles
  └── main.css
index.html
README.md
.gitignore
```

---

## Future Ideas (Optional Enhancements)

- Add real chart library (Chart.js)
- Export profiling results to JSON
- Persist history with IndexedDB
- Add undo/redo UI
