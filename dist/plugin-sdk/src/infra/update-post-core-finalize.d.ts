import { type UpdateChannel } from "./update-channels.js";
import { type PreUpdateConfigRestoreInput } from "./update-post-core-context.js";
import type { UpdateRunResult } from "./update-runner.js";
export type PostCoreFinalizeOutcome = {
    status: "skipped";
    reason: "not-git-update" | "entrypoint-missing";
} | {
    status: "ok";
    entrypoint: string;
} | {
    status: "error";
    reason: "nonzero-exit" | "spawn-failed";
    entrypoint: string;
    exitCode?: number;
    message?: string;
};
type FinalizeSpawnResult = {
    code: number | null;
    stderr?: string;
};
export type PostCoreFinalizeSpawner = (params: {
    argv: string[];
    cwd: string;
    timeoutMs: number;
    env: NodeJS.ProcessEnv;
}) => Promise<FinalizeSpawnResult>;
export declare function runPostCoreFinalizeAfterGatewayUpdate(params: {
    result: UpdateRunResult;
    channel?: UpdateChannel;
    timeoutMs?: number;
    preUpdateConfig?: PreUpdateConfigRestoreInput;
    resolveEntrypoint?: (root: string) => Promise<string | undefined>;
    spawnFinalize?: PostCoreFinalizeSpawner;
    env?: NodeJS.ProcessEnv;
}): Promise<PostCoreFinalizeOutcome>;
export declare function foldPostCoreFinalizeIntoResult(result: UpdateRunResult, outcome: PostCoreFinalizeOutcome): UpdateRunResult;
export {};
