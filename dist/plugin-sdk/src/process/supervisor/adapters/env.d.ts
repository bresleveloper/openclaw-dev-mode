/** Convert Node's optional env values into the concrete string map spawn adapters expect. */
export declare function toStringEnv(env?: NodeJS.ProcessEnv): Record<string, string>;
