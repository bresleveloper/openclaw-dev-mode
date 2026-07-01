import type { Command } from "commander";
/** CLI registration exported by a QA runner plugin runtime surface. */
export type QaRunnerCliRegistration = {
    commandName: string;
    register(qa: Command): void;
};
type QaRuntimeSurface = {
    defaultQaRuntimeModelForMode: (mode: string, options?: {
        alternate?: boolean;
        preferredLiveModel?: string;
    }) => string;
    startQaLiveLaneGateway: (...args: unknown[]) => Promise<unknown>;
};
/** Resolved QA runner CLI contribution declared by plugin manifest metadata. */
export type QaRunnerCliContribution = {
    pluginId: string;
    commandName: string;
    description?: string;
    status: "available";
    registration: QaRunnerCliRegistration;
} | {
    pluginId: string;
    commandName: string;
    description?: string;
    status: "blocked";
};
/** Load the private QA Lab runtime facade used by QA runner commands. */
export declare function loadQaRuntimeModule(): QaRuntimeSurface;
/** Load a bundled QA runner plugin test API facade by plugin id. */
export declare function loadQaRunnerBundledPluginTestApi<T extends object>(pluginId: string): T;
/** Returns whether the private QA Lab runtime facade is available in this build. */
export declare function isQaRuntimeAvailable(): boolean;
/** List QA runner CLI contributions declared by manifests and backed by runtime registrations. */
export declare function listQaRunnerCliContributions(): readonly QaRunnerCliContribution[];
export {};
