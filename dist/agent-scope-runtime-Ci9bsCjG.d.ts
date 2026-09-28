import { a as resolveSessionAgentIdsStrict } from "./agent-scope-D4U2tjwQ.js";
//#region src/plugin-sdk/agent-scope-runtime.d.ts
type SessionAgentResolutionParams = Parameters<typeof resolveSessionAgentIdsStrict>[0];
/**
 * @deprecated Use `resolveSessionAgentIdsStrict` with an explicit or prepared
 * owner. Retained through 2026-11-29 for plugins shipped before strict
 * multi-agent ownership was introduced.
 */
declare function resolveSessionAgentIdsCompatibility(params: SessionAgentResolutionParams): {
  defaultAgentId: string;
  sessionAgentId: string;
};
/**
 * @deprecated Use `resolveSessionAgentIdStrict` with an explicit or prepared
 * owner. Retained through 2026-11-29 for plugins shipped before strict
 * multi-agent ownership was introduced.
 */
declare function resolveSessionAgentIdCompatibility(params: SessionAgentResolutionParams): string;
//#endregion
export { resolveSessionAgentIdsCompatibility as n, resolveSessionAgentIdCompatibility as t };