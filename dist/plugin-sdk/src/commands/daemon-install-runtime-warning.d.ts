export type DaemonInstallWarnFn = (message: string, title?: string) => void;
/** Warn when daemon install will use a system Node path that may be unsuitable. */
export declare function emitNodeRuntimeWarning(params: {
    env: Record<string, string | undefined>;
    runtime: string;
    nodeProgram?: string;
    warn?: DaemonInstallWarnFn;
    title: string;
}): Promise<void>;
