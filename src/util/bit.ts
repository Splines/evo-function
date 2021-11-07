// adapted form http://blog.joshuakgoldberg.com/binary-arithmetic/
export type Bit = 0 | 1;
export type Int4 = [Bit, Bit, Bit, Bit];
export type BitFlip<T> = T extends 0 ? 1 : 0;
