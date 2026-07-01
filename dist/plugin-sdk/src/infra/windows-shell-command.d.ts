import type { ExecCommandAnalysis } from "./exec-command-analysis-types.js";
export declare function tokenizeWindowsSegment(segment: string): string[] | null;
export declare function analyzeWindowsShellCommand(params: {
    command: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
}): ExecCommandAnalysis;
export declare function isWindowsPlatform(platform?: string | null): boolean;
export declare function windowsEscapeArg(value: string): {
    ok: true;
    escaped: string;
} | {
    ok: false;
};
export type ShellSegmentRenderResult = {
    ok: true;
    rendered: string;
} | {
    ok: false;
    reason: string;
};
export type RebuiltShellCommandResult = {
    ok: boolean;
    command?: string;
    reason?: string;
    segmentCount?: number;
};
export declare function rebuildWindowsShellCommandFromSource(params: {
    command: string;
    renderSegment: (rawSegment: string, segmentIndex: number) => ShellSegmentRenderResult;
}): RebuiltShellCommandResult;
