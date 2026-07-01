import { Command } from "commander";

//#region src/plugin-sdk/qa-runner-runtime.d.ts
/** CLI registration exported by a QA runner plugin runtime surface. */
type QaRunnerCliRegistration = {
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
type QaRunnerCliContribution = {
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
declare function loadQaRuntimeModule(): QaRuntimeSurface;
/** Load a bundled QA runner plugin test API facade by plugin id. */
declare function loadQaRunnerBundledPluginTestApi<T extends object>(pluginId: string): T;
/** Returns whether the private QA Lab runtime facade is available in this build. */
declare function isQaRuntimeAvailable(): boolean;
/** List QA runner CLI contributions declared by manifests and backed by runtime registrations. */
declare function listQaRunnerCliContributions(): readonly QaRunnerCliContribution[];
//#endregion
export { QaRunnerCliContribution, QaRunnerCliRegistration, isQaRuntimeAvailable, listQaRunnerCliContributions, loadQaRunnerBundledPluginTestApi, loadQaRuntimeModule };