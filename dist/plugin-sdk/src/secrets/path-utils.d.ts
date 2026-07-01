/**
 * Reads a config path from object/array containers.
 * Missing containers, invalid array indexes, and scalar parents resolve to undefined.
 */
export declare function getPath(root: unknown, segments: string[]): unknown;
/**
 * Sets a config path, creating missing object or array containers from the next path segment.
 * Existing non-container parents fail so callers cannot silently change config shape.
 */
export declare function setPathCreateStrict(root: Record<string, unknown>, segments: string[], value: unknown): boolean;
/**
 * Sets an existing config path and throws if any parent or leaf segment is missing.
 * Used by runtime resolution paths that must only replace values proven by source discovery.
 */
export declare function setPathExistingStrict(root: Record<string, unknown>, segments: string[], value: unknown): boolean;
/**
 * Deletes an existing config path, returning whether anything was removed.
 * Array deletes compact with splice; object deletes remove only the concrete leaf key.
 */
export declare function deletePathStrict(root: Record<string, unknown>, segments: string[]): boolean;
