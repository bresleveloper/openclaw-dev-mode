import type { AgentHarness, AgentHarnessResetParams, RegisteredAgentHarness } from "./types.js";
/** Registers or replaces an agent harness under its trimmed id. */
export declare function registerAgentHarness(harness: AgentHarness, options?: {
    ownerPluginId?: string;
}): void;
/** Returns the harness plus plugin ownership metadata for registry diagnostics. */
export declare function getRegisteredAgentHarness(id: string): RegisteredAgentHarness | undefined;
/** Lists registered harness records for selection and lifecycle fan-out. */
export declare function listRegisteredAgentHarnesses(): RegisteredAgentHarness[];
/** Clears all harnesses; intended for tests and controlled registry reloads. */
export declare function clearAgentHarnesses(): void;
/** Restores a prior harness snapshot after tests temporarily replace the registry. */
export declare function restoreRegisteredAgentHarnesses(entries: RegisteredAgentHarness[]): void;
/** Calls each registered harness session-reset hook without letting one failure stop the fan-out. */
export declare function resetRegisteredAgentHarnessSessions(params: AgentHarnessResetParams): Promise<void>;
/** Calls each registered harness dispose hook during registry shutdown or reload. */
export declare function disposeRegisteredAgentHarnesses(): Promise<void>;
