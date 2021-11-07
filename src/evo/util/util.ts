import { Bit } from "./bit";

export function getRandomInt(max: number): number {
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
}

export function getRandomBit(): Bit {
    const x = getRandomInt(2);
    return x as Bit;
}


///////////////////////// Equality of arrays ///////////////////////////////////
// https://stackoverflow.com/a/14853974
// https://stackoverflow.com/a/27859185
export function arrayEquals(array1: any[], array2: any[]): boolean {
    // if any array is a falsy value, return
    if (!array1 || !array2)
        return false;

    // compare lengths - can save a lot of time 
    if (array1.length != array2.length)
        return false;

    for (let i = 0, l = array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arrayEquals(array1[i], array2[i]))
                return false;
        }
        else if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}


//////////////////// Avoid comparison by reference for sets ////////////////////
// https://stackoverflow.com/a/66597517
export interface Equatable {
    /**
    * Returns `true` if the two objects are equal, `false` otherwise.
    */
    equals(object: any): boolean
}

export class SetCustomEquals<T extends Equatable> extends Set<T>{

    override add(value: T) {
        if (!this.has(value)) {
            super.add(value);
        }
        return this;
    }

    override has(otherValue: T): boolean {
        for (const value of this.values()) {
            if (otherValue.equals(value)) {
                return true;
            }
        }
        return false;
    }
}