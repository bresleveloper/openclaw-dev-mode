import type { HandleCommandsParams } from "./commands-types.js";
export type CommandSessionMetadataChange = {
    sessionKey: string;
    agentId?: string;
    reason: "command-metadata";
};
export declare function markCommandSessionMetadataChanged(params: Pick<HandleCommandsParams, "agentId" | "ctx" | "rootCtx" | "sessionKey">): void;
export declare function takeCommandSessionMetadataChanges(target: object): CommandSessionMetadataChange[] | undefined;
export declare function takeCommandSessionMetadataChangesFromTargets(targets: Iterable<object>): CommandSessionMetadataChange[] | undefined;
