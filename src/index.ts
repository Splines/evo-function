import { Evolution } from "./evo/evolution";
import { Problem } from "./evo/problem";

console.log('--- Main ---');

function problemFunc(x: number): number {
    return 10 / (0.01 * (x - 15) ** 2 + 1);
}

const problem = new Problem(problemFunc);
const evolution = new Evolution(2, 4, problem);
evolution.nextGeneration();

