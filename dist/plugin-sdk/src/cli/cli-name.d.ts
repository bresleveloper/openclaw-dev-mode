/** Resolve the displayed CLI binary name from argv, falling back to `openclaw`. */
export declare function resolveCliName(argv?: string[]): string;
/** Replace a leading `openclaw` command prefix with the active CLI name. */
export declare function replaceCliName(command: string, cliName?: string): string;
