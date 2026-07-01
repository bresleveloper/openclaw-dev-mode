/**
 * Resolves lazy runtime import parts against the caller's module URL or path.
 * Absolute normalized paths stay standalone; relative parts resolve against the normalized base.
 */
export declare function resolveRuntimeImportSpecifier(baseUrl: string, parts: readonly string[]): string;
/**
 * Imports a lazy runtime module through the normalized runtime specifier.
 * The injectable importer keeps platform-specific specifier handling unit-testable.
 */
export declare function importRuntimeModule<T>(baseUrl: string, parts: readonly string[], importModule?: (specifier: string) => Promise<unknown>): Promise<T>;
