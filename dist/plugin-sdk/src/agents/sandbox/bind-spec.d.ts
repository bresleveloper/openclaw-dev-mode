/**
 * Parser for Docker-style host:container[:options] bind specs.
 */
type SplitBindSpec = {
    host: string;
    container: string;
    options: string;
};
/** Splits a bind spec while preserving Windows drive-letter prefixes in host paths. */
export declare function splitSandboxBindSpec(spec: string): SplitBindSpec | null;
export {};
