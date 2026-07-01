/** Serializes async work by key so repeated skill loads do not race on shared files. */
export declare function serializeByKey<T>(key: string, task: () => Promise<T>): Promise<T>;
