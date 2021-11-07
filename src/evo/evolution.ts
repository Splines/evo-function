import { Int4 } from "../util/bit";
import { SortedLinkedList } from "../util/list";
import { getRandomBit, SetCustomEquals } from "../util/util";
import { BitGeneString } from "./gene";
import { Problem } from "./problem";

interface ElementWithCost {
    x: number;
    cost: number;
}

/**
 * Evolution for a minimization problem.
 */
export class Evolution {

    private parent: BitGeneString;
    private cost: number;

    constructor(
        private descendantsPerGen: number,
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
     * Starts the evolutionary process using probabilistic hill-climbing,
     * i.e. a (1+λ) strategy.
     */
    public startEvolution() {
        const children = this.procreate();
        // const childrenEvaluated: BitGeneString[] = []; // [ best ... worst ]

        const evaluated = new SortedLinkedList(); // [smallest ... biggest]
        evaluated.insert(this.cost); // parent cost

        for (const child of children) {
            const x = child.toInt();
            const cost = this.problem.evaluate(x);
            evaluated.insert(cost);
        }

        console.log(evaluated.toArray());

    }

    // private costCompareFunc(a: ElementWithCost, b: ElementWithCost): Compare {
    //     if (a.cost === b.cost) {
    //         return Compare.EQUALS;
    //     }
    //     return a.cost < b.cost ? Compare.LESS_THAN : Compare.BIGGER_THAN;
    // }

}