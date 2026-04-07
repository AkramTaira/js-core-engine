/**
 * DataStructures.js
 * Core structures: HashTable (chaining) + DoublyLinkedList (history)
 */
// =============== Immutability Helper ===============
function deepClone(value) {
  if (value === null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return Object.freeze(value.map(item => deepClone(item)));
  }

  const cloned = {};
  for (let key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key]);
    }
  }
  return Object.freeze(cloned);
}

// =============== Hash Table ===============
class HashTable {
  #size;
  #table;
  #count;
  #loadFactorThreshold;

  constructor(size = 50) {
    this.#size = size;
    this.#table = Array.from({ length: size }, () => []);
    this.#count = 0;
    this.#loadFactorThreshold = 0.75;
  }

  // _hash(key): string -> index
  _hash(key) {
    let hash = 0;
    const PRIME = 31;
    const str = String(key);
    for (let i = 0; i < str.length; i++) {
      hash = (hash * PRIME + str.charCodeAt(i)) % this.#size;
    }
    return hash;
  }

  _loadFactor() {
    return this.#count / this.#size;
  }

  _resize(newSize) {
    const oldTable = this.#table;
    this.#size = newSize;
    this.#table = Array.from({ length: newSize }, () => []);
    this.#count = 0;

    for (let bucket of oldTable) {
      for (let [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  set(key, value) {
    const index = this._hash(key);
    const bucket = this.#table[index];

    for (let pair of bucket) {
      if (pair[0] === key) {
        pair[1] = deepClone(value);
        return;
      }
    }

    bucket.push([key, deepClone(value)]);
    this.#count++;

    if (this._loadFactor() >= this.#loadFactorThreshold) {
      this._resize(this.#size * 2);
    }
  }

  get(key) {
    const index = this._hash(key);
    const bucket = this.#table[index];
    for (let pair of bucket) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }

  remove(key) {
    const index = this._hash(key);
    const bucket = this.#table[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.#count--;
        return true;
      }
    }
    return false;
  }
}

// =============== Doubly Linked List ===============
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  #head;
  #tail;
  #length;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
  }

  append(value) {
    const node = new Node(value);
    if (!this.#head) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.prev = this.#tail;
      this.#tail.next = node;
      this.#tail = node;
    }
    this.#length++;
  }

  removeTail() {
    if (!this.#tail) return null;
    const removed = this.#tail;
    if (this.#tail.prev) {
      this.#tail = this.#tail.prev;
      this.#tail.next = null;
    } else {
      this.#head = null;
      this.#tail = null;
    }
    this.#length--;
    return removed.value;
  }
}

export { HashTable, DoublyLinkedList };