type Deferred<T = void> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};
declare function createDeferredCore<T = void>(): Deferred<T>;
export { createDeferredCore as n, Deferred as t };