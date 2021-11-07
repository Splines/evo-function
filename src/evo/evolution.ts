import { Int4 } from "../util/bit";
import { Compare, SortedLinkedList } from "../util/list";
import { getRandomBit, SetCustomEquals } from "../util/util";
import { BitGeneString } from "./gene";
import { Problem } from "./problem";

interface GeneWithCost {
    gene: BitGeneString;
    cost: number;
}

/**
 * Evolution for a minimization problem.
 */
export class Evolution {

    private parent: BitGeneString;
    private cost: number;

    constructor(
        private descendantsPerGen: number, // also known as λ
        private mutationsPerGen: number,
        private problem: Problem
    ) {
        // --- Checks
        if (mutationsPerGen < descendantsPerGen) {
            throw new Error('There must be at least as many mutations as descendants');
        }
        if (mutationsPerGen > 4) {
            throw new Error('As we deal with 4-bit integers, there are only 4 possible bit flip mutations');
        }

        // --- Init gene-string (parent)
        const initialBits: Int4 = Array(4).fill(null).map(() => getRandomBit()) as Int4;
        this.parent = new BitGeneString(initialBits);
        const x = this.parent.toInt();
        this.cost = this.problem.evaluate(x);
    }

    /**
     * Generates children form the current state.
     * @returns the children
     */
    private procreate() {
        const mutations = new SetCustomEquals<BitGeneString>();
        while (mutations.size < this.mutationsPerGen) {
            const mutation = this.parent.mutate();
            mutations.add(mutation);
        }
        return mutations;
    }

    /**
     * Produce the next generation using probabilistic hill-climbing,
     * i.e. a (1+λ) strategy.
     */
    public nextGeneration() {
        // --- Procreate (using mutation)
        const children = this.procreate();

        // --- Evaluate
        const evaluated = new SortedLinkedList<GeneWithCost>({ compareFunc: this.costCompareFunc });
        evaluated.insert({ gene: this.parent, cost: this.cost }); // parent cost

        for (const child of children) {
            const x = child.toInt();
            const cost = this.problem.evaluate(x);
            evaluated.insert({ gene: child, cost: cost }); // insert child (sorted)
        }
        const evaluatedArray = evaluated.toArray();
        console.log(evaluatedArray.map((value: GeneWithCost) => {
            return `🧬: ${value.gene.toString()}, 💰: ${value.cost}`
        }));

        // --- Choose (1+λ) best for next generation
        // just slice from the beginning as the array is sorted (due to our SortedLinkedList)
        return [evaluatedArray.slice(0, this.descendantsPerGen), evaluatedArray];
    }

    /**
     * Starts the evolutionary process.
     */
    public startEvolution() {
        // TODO
    }

    private costCompareFunc(a: GeneWithCost, b: GeneWithCost): Compare {
        // from smallest to biggest
        if (a.cost === b.cost) {
            return Compare.EQUALS;
        }
        return a.cost < b.cost ? Compare.LESS_THAN : Compare.BIGGER_THAN;
    }

}