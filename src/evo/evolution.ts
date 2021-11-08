import { BitGeneString } from "./gene";
import { Problem } from "./problem";
import { Int4 } from "./util/bit";
import { Compare, SortedLinkedList } from "./util/list";
import { getRandomBit, SetCustomEquals } from "./util/util";

export interface GeneWithCost {
    gene: BitGeneString;
    cost: number;
}

/**
 * Evolution for a minimization problem.
 */
export class Evolution {

    private generation = -1;
    private bestChildren: GeneWithCost[] = [];

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
    }

    /**
     * Generates children form the current state.
     * @returns the children
     */
    private procreate(parent: BitGeneString) {
        const mutations = new SetCustomEquals<BitGeneString>();
        while (mutations.size < this.mutationsPerGen) {
            const mutation = parent.mutate();
            mutations.add(mutation);
        }
        return mutations;
    }

    /**
     * Produces the next generation using probabilistic hill-climbing,
     * i.e. a (1+λ) strategy.
     */
    private nextGeneration(parents: BitGeneString[]): GeneWithCost[] {
        this.generation++;
        console.log(`--- Producing generation ${this.generation}`);

        const evaluatedChildren = new SortedLinkedList<GeneWithCost>({ compareFunc: this.costCompareFunc });
        for (const parent of parents) {
            // --- Procreate (using mutation)
            const children = this.procreate(parent);

            // --- Evaluate parent & children
            const toEvaluate = [parent, ...children];
            for (const evalGene of toEvaluate) {
                const x = evalGene.toInt();
                const cost = this.problem.evaluate(x);
                evaluatedChildren.insert({ gene: evalGene, cost: cost }); // insert (sorted)
            }
        }

        // --- Log
        const evaluatedArray = evaluatedChildren.toArray();
        console.table(evaluatedArray.map((child: GeneWithCost) => {
            return { 'Gene 🧬': child.gene.toString(), 'Cost 💰': child.cost }
        }))
        // console.log(evaluatedArray.map((child: GeneWithCost) => {
        //     return `🧬: ${child.gene.toString()}, 💰: ${child.cost}`
        // }));

        // --- Choose (1+λ) best for next generation
        // just slice from the beginning as the array is sorted (due to our SortedLinkedList)
        // return [evaluatedArray.slice(0, this.descendantsPerGen), evaluatedArray];

        return evaluatedArray.slice(0, this.descendantsPerGen);
    }

    // /**
    //  * Start and run the evolution until no better solution is found.
    //  */
    // fullEvolution(): GeneWithCost {
    //     console.log('=== Start Evolution ===');

    //     // --- Start with one parent
    //     let bestChildren = this.nextGeneration([this.initialParent]);
    //     let best = bestChildren[0];

    //     // --- Create new generations
    //     // until all best children are not any better than their parents
    //     let newBest;
    //     while (true) {
    //         bestChildren = this.nextGeneration(bestChildren.map(x => x.gene));
    //         newBest = bestChildren[0];
    //         if (newBest.cost >= best.cost) { // no improvements anymore
    //             break
    //         }
    //         best = newBest;
    //     }

    //     return best;
    // }

    /**
     * Inits the evolution by generating a random parent.
     * @returns a randomly generated parent
     */
    private init(): GeneWithCost[] {
        const initialBits: Int4 = Array(4).fill(null).map(() => getRandomBit()) as Int4;
        const initialParentGene = new BitGeneString(initialBits);
        console.log(`Initial gene 🧬: ${initialParentGene.toString()}`);

        this.bestChildren = [{
            gene: initialParentGene,
            cost: this.problem.evaluate(initialParentGene.toInt())
        }];

        this.generation = 0;
        return this.bestChildren;
    }

    /**
     * Performs one step of the evolution.
     * @returns the new generation (best of parent + children)
     */
    next(): GeneWithCost[] {
        if (this.generation === -1) {
            return this.init();
        } else {
            this.bestChildren = this.nextGeneration(this.bestChildren.map(x => x.gene));
            return this.bestChildren;
        }
    }

    private costCompareFunc(a: GeneWithCost, b: GeneWithCost): Compare {
        // from smallest to biggest
        if (a.cost === b.cost) {
            return Compare.EQUALS;
        }
        return a.cost < b.cost ? Compare.LESS_THAN : Compare.BIGGER_THAN;
    }

}