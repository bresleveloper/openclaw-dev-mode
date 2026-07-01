import type { QueuedFileWriter, QueuedFileWriterDiagnostics } from "../agents/queued-file-writer.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { TrajectoryToolDefinition } from "./types.js";
type TrajectoryRuntimeInit = {
    cfg?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    maxRuntimeFileBytes?: number;
    runId?: string;
    sessionId: string;
    sessionKey?: string;
    sessionFile?: string;
    provider?: string;
    modelId?: string;
    modelApi?: string | null;
    workspaceDir?: string;
    writer?: TrajectoryRuntimeWriter;
};
type TrajectoryRuntimeRecorder = {
    enabled: true;
    filePath: string;
    recordEvent: (type: string, data?: Record<string, unknown>) => void;
    flush: () => Promise<void>;
    describeFlushState: () => string | undefined;
};
type TrajectoryRuntimeWriterDiagnostics = Omit<QueuedFileWriterDiagnostics, "activeOperation"> & {
    activeOperation: QueuedFileWriterDiagnostics["activeOperation"] | "file-replace";
};
type TrajectoryRuntimeWriter = Omit<QueuedFileWriter, "describeQueue"> & {
    describeQueue?: () => TrajectoryRuntimeWriterDiagnostics;
    nextSourceSeq?: () => number;
};
export declare function toTrajectoryToolDefinitions(tools: ReadonlyArray<{
    name?: string;
    description?: string;
    parameters?: unknown;
}>): TrajectoryToolDefinition[];
export declare function createTrajectoryRuntimeRecorder(params: TrajectoryRuntimeInit): TrajectoryRuntimeRecorder | null;
export {};
