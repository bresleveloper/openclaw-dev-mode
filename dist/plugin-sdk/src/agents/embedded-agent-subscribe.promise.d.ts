/** Narrow unknown values to PromiseLike without requiring a concrete Promise. */
export declare function isPromiseLike<T>(value: unknown): value is PromiseLike<T>;
