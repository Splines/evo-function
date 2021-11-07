import { Evolution } from "./evo/evolution";
import { Problem } from "./evo/problem";

console.log('--- Main ---');

function problemFunc(x: number): number {
    return 10 / (0.01 * (x - 15) ** 2 + 1);
}

const problem = new Problem(problemFunc);
const evolution = new Evolution(3, 4, problem);
evolution.startEvolution();

// const a = new SortedLinkedList();
// a.insert(5);
// a.insert(9);
// a.insert(2);
// a.insert(6);
// a.insert(14);
// a.insert(1);
// console.log(a.toString());
// console.log('===========');
