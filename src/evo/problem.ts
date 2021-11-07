export class Problem {

    constructor(private func: MathFunc) {
    }

    evaluate(x: number) {
        return this.func(x);
    }
}

interface MathFunc {
    (x: number): number;
}
