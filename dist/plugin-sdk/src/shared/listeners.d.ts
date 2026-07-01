/** Notifies every registered listener while isolating individual listener failures. */
export declare function notifyListeners<T>(listeners: Iterable<(event: T) => void>, event: T, onError?: (error: unknown) => void): void;
/** Registers a listener in a Set and returns an idempotent unsubscribe handle. */
export declare function registerListener<T>(listeners: Set<(event: T) => void>, listener: (event: T) => void): () => void;
