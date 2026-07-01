import type { TaskRecord } from "./task-registry.types.js";
export declare const COPILOT_NATIVE_SUBAGENT_TASK_KIND = "copilot-native";
export declare const COPILOT_NATIVE_SUBAGENT_RUN_ID_PREFIX = "copilot-agent:";
export declare const COPILOT_NATIVE_SUBAGENT_STALE_ERROR = "Copilot native subagent stopped reporting progress";
declare const CHILDLESS_NATIVE_SUBAGENT_DEFINITIONS: readonly [{
    readonly taskKind: "codex-native";
    readonly runIdPrefix: "codex-thread:";
}, {
    readonly taskKind: "copilot-native";
    readonly runIdPrefix: "copilot-agent:";
}];
export type NativeSubagentTaskDefinition = (typeof CHILDLESS_NATIVE_SUBAGENT_DEFINITIONS)[number];
export declare function resolveChildlessNativeSubagentTaskDefinition(task: TaskRecord): NativeSubagentTaskDefinition | undefined;
export declare function isChildlessNativeSubagentTask(task: TaskRecord): boolean;
export {};
