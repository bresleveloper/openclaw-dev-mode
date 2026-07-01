import type { Command } from "commander";
type QaRuntimeSurface = {
    defaultQaRuntimeModelForMode: (mode: string, options?: {
        alternate?: boolean;
        preferredLiveModel?: string;
    }) => string;
    startQaLiveLaneGateway: (...args: unknown[]) => Promise<unknown>;
};
/** Load the bundled QA lab runtime surface, throwing when the private bundle is absent. */
export declare function loadQaRuntimeModule(): QaRuntimeSurface;
/** Check whether the bundled QA lab runtime surface is present without hiding other load errors. */
export declare function isQaRuntimeAvailable(): boolean;
/** Normalized options passed from live-transport QA CLIs into lane runners. */
export type LiveTransportQaCommandOptions = {
    repoRoot?: string;
    outputDir?: string;
    providerMode?: string;
    primaryModel?: string;
    alternateModel?: string;
    fastMode?: boolean;
    allowFailures?: boolean;
    failFast?: boolean;
    profile?: string;
    scenarioIds?: string[];
    listScenarios?: boolean;
    sutAccountId?: string;
    credentialSource?: string;
    credentialRole?: string;
};
/** Commander registration hook for one live-transport QA subcommand. */
export type LiveTransportQaCliRegistration = {
    commandName: string;
    register(qa: Command): void;
};
/** Help text customizations for live credential source and role flags. */
export type LiveTransportQaCredentialCliOptions = {
    sourceDescription?: string;
    roleDescription?: string;
};
/** Declarative command metadata and runner used to install a live-transport QA CLI. */
export type LiveTransportQaCliRegistrationOptions = {
    commandName: string;
    credentialOptions?: LiveTransportQaCredentialCliOptions;
    defaultProviderMode: string;
    description: string;
    providerModeHelp: string;
    listScenariosHelp?: string;
    outputDirHelp: string;
    profileHelp?: string;
    failFastHelp?: string;
    allowFailuresHelp?: string;
    scenarioHelp: string;
    sutAccountHelp: string;
    run: (opts: LiveTransportQaCommandOptions) => Promise<void>;
};
/** Memoize a lazy CLI runtime import so repeated command paths share one loaded module. */
export declare function createLazyCliRuntimeLoader<T>(load: () => Promise<T>): () => Promise<T>;
/** Build a Commander registration object for one live-transport QA command. */
export declare function createLiveTransportQaCliRegistration(params: LiveTransportQaCliRegistrationOptions): LiveTransportQaCliRegistration;
/** One top-level check row in a rendered QA markdown report. */
export type QaReportCheck = {
    name: string;
    status: "pass" | "fail" | "skip";
    details?: string;
};
/** One scenario section in a rendered QA markdown report. */
export type QaReportScenario = {
    name: string;
    status: "pass" | "fail" | "skip";
    details?: string;
    steps?: QaReportCheck[];
};
export { LIVE_TRANSPORT_BASELINE_STANDARD_SCENARIO_IDS, collectLiveTransportStandardScenarioCoverage, findMissingLiveTransportStandardScenarios, selectLiveTransportScenarios, type LiveTransportScenarioDefinition, type LiveTransportStandardScenarioId, } from "./qa-live-transport-scenarios.js";
/** Docker command runner abstraction used by QA Docker helpers and tests. */
export type QaDockerRunCommand = (command: string, args: string[], cwd: string) => Promise<{
    stdout: string;
    stderr: string;
}>;
/** Minimal fetch-like health probe used by QA Docker runtime helpers. */
export type QaDockerFetchResponse = {
    ok: boolean;
    body?: {
        cancel?: () => unknown;
    } | null;
};
export type QaDockerFetchLike = (input: string) => Promise<QaDockerFetchResponse>;
/** Render checks, scenarios, timeline, and notes into the standard QA markdown report format. */
export declare function renderQaMarkdownReport(params: {
    title: string;
    startedAt: Date;
    finishedAt: Date;
    checks?: QaReportCheck[];
    scenarios?: QaReportScenario[];
    timeline?: string[];
    notes?: string[];
}): string;
/** Append a formatted live-lane issue while preserving the caller-owned issue list. */
export declare function appendQaLiveLaneIssue(issues: string[], label: string, error: unknown): void;
/** Format a live-lane failure message that includes artifact labels and paths. */
export declare function buildQaLiveLaneArtifactsError(params: {
    heading: string;
    artifacts: Record<string, string>;
    details?: string[];
}): string;
/** Print live-transport QA artifact paths with a lane label for CI log parsers. */
export declare function printLiveTransportQaArtifacts(laneLabel: string, artifacts: Record<string, string>): void;
/** Return the preferred Docker host port unless it is unpinned and already occupied. */
export declare function resolveQaDockerHostPort(preferredPort: number, pinned: boolean): Promise<number>;
/** Create Docker command, health-check, and compose helpers for QA harnesses. */
export declare function createQaDockerRuntime(params: {
    auditContext: string;
    commandTimeoutMs?: number | null;
}): {
    execCommand: QaDockerRunCommand;
    fetchHealthUrl: (url: string) => Promise<{
        ok: boolean;
    }>;
    resolveComposeServiceUrl: (service: string, port: number, composeFile: string, repoRoot: string, runCommand: QaDockerRunCommand, fetchImpl?: QaDockerFetchLike) => Promise<string | null>;
    resolveHostPort: typeof resolveQaDockerHostPort;
    waitForDockerServiceHealth: (service: string, composeFile: string, repoRoot: string, runCommand: QaDockerRunCommand, sleepImpl: (ms: number) => Promise<unknown>, timeoutMs?: number, pollMs?: number) => Promise<void>;
    waitForHealth: (url: string, deps: {
        label?: string;
        composeFile?: string;
        fetchImpl: QaDockerFetchLike;
        sleepImpl: (ms: number) => Promise<unknown>;
        timeoutMs?: number;
        pollMs?: number;
    }) => Promise<void>;
};
/** Tee stdout and stderr into a private artifact file until the returned stop hook runs. */
export declare function startLiveTransportQaOutputTee(params: {
    fileName: string;
    outputDir: string;
}): Promise<{
    outputPath: string;
    stop(): Promise<void>;
}>;
