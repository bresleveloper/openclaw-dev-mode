/**
 * Live-provider model error classifiers.
 *
 * Probe and fallback code uses these string checks to distinguish missing or
 * deprecated model ids from generic provider/runtime failures.
 */
/** Returns whether a provider error message indicates a missing or retired model id. */
export declare function isModelNotFoundErrorMessage(raw: string): boolean;
