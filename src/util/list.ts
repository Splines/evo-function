class Node {
    public next: Node | null;

    constructor(public element: number) {
        this.next = null;
    }
}

function defaultEquals(a: number, b: number): boolean {
    return a === b;
}

// adapted from https://github.com/swarup260/Learning_Algorithms/blob/master/data_structure/LinkedList.js
class LinkedList {

    private _size: number;
    private _head: Node | null;

    constructor(private equalFunc = defaultEquals) {
        this._size = 0;
        this._head = null;
    }

    get head() {
        if (this.isEmpty()) {
            return null;
        }
        return this._head;
    }

    push(element: number): void {
        const node = new Node(element);
        let current = this._head;

        if (current == null) {
            this._head = node;
        } else {
            while (current.next != null) {
                current = current.next;
            }
            current.next = node;
        }

        this._size++;
    }

    _getNode(index: number): Node | null {
        let node = this._head;
        if (!node || index < 0 || index >= this._size)
            return null;

        for (let i = 0; i < index; i++) {
            node = node!.next;
        }
        return node;
    }

    get(index: number): number | null {
        const node = this._getNode(index);
        return node ? node.element : null;
    }

    insert(element: number, position: number): void {
        if (position < 0 || position > this._size) {
            throw new Error('Index error for linked list');
        }

        const node = new Node(element);
        let current = this._head;

        if (position == 0) {
            this._head = node;
            node.next = current;
        } else {
            let previous = this._getNode(position - 1);
            current = previous!.next;
            node.next = current;
            previous!.next = node;
        }

        this._size++;
    }

    indexOf(element: number): number {
        let current = this._head;
        for (let i = 0; i < this._size && current != null; i++) {
            if (this.equalFunc(current.element, element)) {
                return i;
            }
            current = current.next;
        }
        return -1;
    }

    remove(element: number): boolean {
        if (this.isEmpty())
            return false;

        let index = this.indexOf(element);
        if (index == -1)
            return false;

        this.removeAt(index);
        return true;
    }

    removeAt(index: number): boolean {
        if (this.isEmpty())
            return false;

        if (index < 0 || index >= this._size)
            return false;

        let current = this._head;
        if (index == 0) {
            this._head = current!.next;
        } else {
            let previous = this._getNode(index - 1);
            current = previous!.next;
            previous!.next = current!.next;
        }

        this._size--;
        return true;
    }

    isEmpty() {
        return this._size == 0;
    }

    get size() {
        return this._size;
    }

    toString() {
        if (this.isEmpty()) {
            return ""
        }

        let string = `${this._head!.element}`;
        let current = this._head!.next;
        for (let i = 1; i < this._size && current != null; i++) {
            string += `, ${current.element}`
            current = current.next;
        }
        return string;
    }

    toArray() {
        let elements = [];
        let current = this._head;
        while (this._size && current != null) {
            elements.push(current.element);
            current = current.next;
        }
        return elements;
    }
}

export enum Compare {
    EQUALS,
    LESS_THAN,
    BIGGER_THAN
}

function smallerFirstCompare(a: number, b: number): number {
    if (a === b) {
        return Compare.EQUALS;
    }
    return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function biggerFirstCompare(a: number, b: number): number {
    if (a === b) {
        return Compare.EQUALS;
    }
    return a < b ? Compare.BIGGER_THAN : Compare.LESS_THAN
}

export class SortedLinkedList extends LinkedList {

    private compareFunc: (a: number, b: number) => Compare;

    constructor(
        options?: {
            customEqualFunc?: (a: number, b: number) => boolean,
            customCompareFunc?: (a: number, b: number) => Compare
        }
    ) {
        const eqFunc = options?.customEqualFunc || defaultEquals;
        super(eqFunc);
        this.compareFunc = options?.customCompareFunc || smallerFirstCompare;
    }

    insert(element: number, index = 0): void {
        if (this.isEmpty())
            return super.insert(element, index);
        const pos = this.getNextSortIndex(element);
        return super.insert(element, pos);
    }

    private getNextSortIndex(element: number): number {
        let current = this.head;
        let i = 0;
        while (true) {
            if (this.compareFunc(element, current!.element) == Compare.LESS_THAN)
                break;

            current = current!.next;
            i++;
            if (current == null)
                break;
        }
        return i;
    }

}