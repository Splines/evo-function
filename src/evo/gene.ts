import { Int4 } from "../util/bit";
import { arrayEquals, Equatable, getRandomInt } from "../util/util";



export class BitGeneString implements Equatable {

    constructor(private x: Int4) {
    }

    mutate(): BitGeneString {
        // Choose random bit to flip
        const index = getRandomInt(4);
        const xModified = [...this.x] as Int4; // shallow copy
        xModified[index] = xModified[index] == 1 ? 0 : 1;
        return new BitGeneString(xModified);
    }

    toInt(): number {
        let sum = 0;
        let power = this.x.length - 1;
        for (const bit of this.x) {
            sum += bit * Math.pow(2, power);
            power--;
        }
        return sum;
    }

    public toString(): string {
        return `[ ${this.x.toString()} ] (int: ${this.toInt()})`;
    }

    equals(other: BitGeneString): boolean {
        return arrayEquals(this.x, other.x);
    }

}

