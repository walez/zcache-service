export interface StoreItem {
  key: string;
  value: string;
}

export interface StoreResult extends StoreItem {
  ok: boolean;
}

export interface StoreDeleteResult extends Omit<StoreResult, 'value'> {
  ok: boolean;
}

class Node {
  constructor(
    public key: string,
    public value: string,
    public next: Node = null,
    public prev: Node = null,
  ) {}
}

export default class Cache {
  private store = new Map<string, Node>();
  private size: number;
  private head?: Node;
  private tail?: Node;
  constructor(private capacity: number) {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  // Write Node to head of LinkedList
  // update cache with Node key and Node reference
  private write(key: string, value: string): void {
    this.ensureLimit();

    if (!this.head) {
      this.head = this.tail = new Node(key, value);
    } else {
      const node = new Node(key, value, this.head);
      this.head.prev = node;
      this.head = node;
    }

    // Update the cache map
    this.store.set(key, this.head);
    this.size++;
  }

  // Read from cache map and make that node as new Head of LinkedList
  private read(key: string): Node | undefined {
    const node = this.store.get(key);
    if (node) {
      const value = node.value;

      // node removed from it's position and cache
      this.remove(key);
      // write node again to the head of LinkedList to make it most recently used
      this.write(key, value);
    }

    return node;
  }

  private ensureLimit(): void {
    if (this.size === this.capacity) {
      this.remove(this.tail.key);
    }
  }

  private remove(key: string): boolean {
    const node = this.store.get(key);

    if (!node) {
      return false;
    }

    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    this.store.delete(key);
    this.size--;
    return true;
  }

  get(keys: string[]): StoreResult[] {
    const res: StoreResult[] = keys.map((key) => {
      const node = this.read(key);
      return {
        key,
        value: node?.value,
        ok: !!node,
      };
    });
    return res;
  }

  set(item: StoreItem): StoreResult {
    this.write(item.key, item.value);
    return {
      key: item.key,
      value: item.value,
      ok: true,
    };
  }

  delete(keys: string[]): StoreDeleteResult[] {
    return keys.map((key) => {
      const ok = this.remove(key);
      return {
        key,
        ok,
      };
    });
  }
}
