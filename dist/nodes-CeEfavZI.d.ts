import { Static, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/environments.d.ts
/** Operational desktop state reported by the current native node connection. */
declare const DesktopAvailabilitySchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"locked">, Type.TLiteral<"unlocked">, Type.TLiteral<"unknown">]>;
}>;
type DesktopAvailability = Static<typeof DesktopAvailabilitySchema>;
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
/** Process-local SSH tunnel connectivity for a worker environment. */
declare const WorkerTunnelStatusSchema: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
/** Actionable issue attached only to runtime targets that need operator intervention. */
declare const RuntimeTargetIssueSchema: Type.TUnion<[Type.TObject<{
  code: Type.TLiteral<"update-required">;
  action: Type.TLiteral<"update-and-reconnect">;
  updateCommand: Type.TLiteral<"openclaw update">;
  headlessReconnectCommand: Type.TLiteral<"openclaw node restart">;
}>, Type.TObject<{
  code: Type.TLiteral<"worker-host-unavailable">;
  message: Type.TString;
}>]>;
/** Bounded live worker slots advertised by a connected node host. */
declare const WorkerSlotSummarySchema: Type.TRefine<Type.TObject<{
  total: Type.TInteger;
  available: Type.TInteger;
  reclaimableIdle: Type.TOptional<Type.TInteger>;
}>>;
/** Placement execution modes shared by runtime requirements and worker providers. */
declare const WorkerExecutionModeSchema: Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>;
declare const WorkerDesktopLaunchResultSchema: Type.TObject<{
  app: Type.TUnion<[Type.TLiteral<"browser">, Type.TLiteral<"terminal">]>;
  status: Type.TLiteral<"ready">;
}>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
type RuntimeTargetIssue = Static<typeof RuntimeTargetIssueSchema>;
type WorkerSlotSummary = Static<typeof WorkerSlotSummarySchema>;
type WorkerExecutionMode = Static<typeof WorkerExecutionModeSchema>;
type WorkerDesktopLaunchResult = Static<typeof WorkerDesktopLaunchResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.d.ts
declare const NodeHostStatsPayloadSchema: Type.TRefine<Type.TObject<{
  cpuCount: Type.TInteger;
  loadAverage: Type.TOptional<Type.TTuple<[Type.TNumber, Type.TNumber, Type.TNumber]>>;
  memoryTotalBytes: Type.TInteger;
  memoryFreeBytes: Type.TInteger;
  diskTotalBytes: Type.TOptional<Type.TInteger>;
  diskAvailableBytes: Type.TOptional<Type.TInteger>;
}>>;
/** Agent-visible tool descriptor advertised by a connected node. */
declare const NodePluginToolDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  name: Type.TString;
  description: Type.TString;
  parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  command: Type.TOptional<Type.TString>;
  mcp: Type.TOptional<Type.TObject<{
    server: Type.TString;
    tool: Type.TString;
  }>>;
}>;
type NodePluginToolDescriptor = Static<typeof NodePluginToolDescriptorSchema>;
/** Agent-visible skill descriptor advertised by a connected node. */
declare const NodeSkillDescriptorSchema: Type.TObject<{
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
}>;
type NodeSkillDescriptor = Static<typeof NodeSkillDescriptorSchema>;
type NodeHostStatsPayload = Static<typeof NodeHostStatsPayloadSchema>;
//#endregion
export { RuntimeTargetIssue as a, WorkerExecutionMode as c, DesktopAvailability as i, WorkerSlotSummary as l, NodePluginToolDescriptor as n, WorkerDesktopLaunchResult as o, NodeSkillDescriptor as r, WorkerEnvironmentState as s, NodeHostStatsPayload as t, WorkerTunnelStatus as u };