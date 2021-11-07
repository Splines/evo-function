import { Evolution } from "./evo/evolution";
import { Problem } from "./evo/problem";

console.log('--- Main ---');

function problemFunc(x: number): number {
    // return 10 / (0.01 * (x - 15) ** 2 + 1);
    return x * Math.sin(2.4 * x);
    // return Math.exp(-x);
    // return x * Math.sin(100 / x);
    // return Math.sin(1000 / x) * (100 / (x ** 2));
    // return Math.sin(x + Math.exp(Math.sin(x)));

    // if (x === 0) {
    //     return 4;
    // }
    // return 8 * Math.exp(1 / x * Math.sin(0.4 * x)) - 8;
}

const problem = new Problem(problemFunc);


const bests = [];
for (let i = 0; i < 10; i++) {
    const evolution = new Evolution(2, 4, problem);
    const best = evolution.startEvolution();
    bests.push(best);
}

// --- Log bests
console.table(bests.map((best) => {
    return { 'Best gene 🧬': best.gene.toString(), 'Best cost 💰': best.cost };
}));
