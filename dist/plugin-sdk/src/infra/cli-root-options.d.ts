/** CLI token that stops root option scanning and leaves following args positional. */
export declare const FLAG_TERMINATOR = "--";
/** Returns whether a token can be consumed as a root option value. */
export declare function isValueToken(arg: string | undefined): boolean;
/** Returns how many argv tokens a supported root option consumes at the given index. */
export declare function consumeRootOptionToken(args: ReadonlyArray<string>, index: number): number;
