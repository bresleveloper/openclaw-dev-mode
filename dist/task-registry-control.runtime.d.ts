import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { Tl as DetachedTaskTerminalState } from "./types-BpDhk2ev.js";
import { t as getAcpSessionManager } from "./manager-jn9of4Yn.js";
//#region src/agents/subagent-control.d.ts
type SubagentKillTargetState = {
  state: "finalizing";
} | {
  state: "terminal";
  task: DetachedTaskTerminalState;
};
/** Kills every currently controlled child run and its descendants. */
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
declare function killSubagentRunAdmin(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}): Promise<{
  found: false;
  killed: boolean;
} | {
  runId: string;
  sessionKey: string;
  cascadeKilled: number;
  cascadeLabels: string[] | undefined;
  targetState?: SubagentKillTargetState | undefined;
  found: true;
  killed: boolean;
}>;
//#endregion
export { getAcpSessionManager, killSubagentRunAdmin };