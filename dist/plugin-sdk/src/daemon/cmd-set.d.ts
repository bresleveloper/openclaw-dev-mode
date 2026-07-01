/** Windows cmd `set` assignment renderer/parser for managed service scripts. */
type CmdSetAssignment = {
    key: string;
    value: string;
};
/** Rejects line breaks before rendering values into Windows cmd scripts. */
export declare function assertNoCmdLineBreak(value: string, field: string): void;
export declare function parseCmdSetAssignment(line: string): CmdSetAssignment | null;
export declare function renderCmdSetAssignment(key: string, value: string): string;
export {};
