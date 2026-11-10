import { Static, Type } from "typebox";
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
/** Ordered UTF-8 output emitted while a node command invocation is running. */
declare const NodeInvokeProgressParamsSchema: Type.TObject<{
  invokeId: Type.TString;
  nodeId: Type.TString;
  seq: Type.TInteger;
  chunk: Type.TString;
}>;
type NodeInvokeProgressParams = Static<typeof NodeInvokeProgressParamsSchema>;
type NodeHostStatsPayload = Static<typeof NodeHostStatsPayloadSchema>;
//#endregion
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
/** Worker-only lifecycle metadata layered onto the existing environment projection. */
declare const WorkerEnvironmentStartStatusSchema: Type.TUnion<[Type.TObject<{
  mode: Type.TLiteral<"snapshot">;
  phase: Type.TOptional<Type.TLiteral<"saving">>;
}>, Type.TObject<{
  mode: Type.TLiteral<"cold">;
  reason: Type.TUnion<[Type.TLiteral<"no-snapshot-yet">, Type.TLiteral<"setup-changed">, Type.TLiteral<"snapshot-retiring">, Type.TLiteral<"snapshot-unavailable">, Type.TLiteral<"os-unsupported">, Type.TLiteral<"warm-images-off">, Type.TLiteral<"capture-paused">, Type.TLiteral<"backend-cannot-snapshot">, Type.TLiteral<"class-unknown">]>;
  phase: Type.TUnion<[Type.TLiteral<"provisioning">, Type.TLiteral<"preparing">, Type.TLiteral<"saving">]>;
}>]>;
type WorkerEnvironmentStartStatus = Static<typeof WorkerEnvironmentStartStatusSchema>;
/** Provider-authored machine choice for one configured worker profile. */
declare const WorkerMachineOptionSchema: Type.TObject<{
  id: Type.TString;
  label: Type.TString;
  cpu: Type.TOptional<Type.TInteger>;
  memoryGb: Type.TOptional<Type.TInteger>;
  default: Type.TOptional<Type.TBoolean>;
  os: Type.TOptional<Type.TString>;
}>;
/** Provider-authored operating system choice for one configured worker profile. */
declare const WorkerOperatingSystemSchema: Type.TObject<{
  id: Type.TString;
  label: Type.TString;
  default: Type.TOptional<Type.TBoolean>;
  disabledReason: Type.TOptional<Type.TString>;
}>;
/** Placement execution modes shared by runtime requirements and worker providers. */
declare const WorkerExecutionModeSchema: Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>;
/** Prepares a configured profile's local Git project without dispatching a session. */
declare const EnvironmentsPrepareParamsSchema: Type.TObject<{
  profileId: Type.TString;
  projectPath: Type.TString;
}>;
declare const EnvironmentsPrepareResultSchema: Type.TObject<{
  environmentId: Type.TString;
  preparationKey: Type.TString;
  reused: Type.TBoolean;
}>;
declare const WorkerDesktopObserveResultSchema: Type.TObject<{
  transport: Type.TString;
  wsPath: Type.TString;
  expiresAtMs: Type.TInteger;
  control: Type.TBoolean;
  canResize: Type.TOptional<Type.TBoolean>;
  vncPassword: Type.TOptional<Type.TString>;
}>;
declare const WorkerDesktopLaunchParamsSchema: Type.TObject<{
  environmentId: Type.TString;
  app: Type.TUnion<[Type.TLiteral<"browser">, Type.TLiteral<"terminal">]>;
}>;
declare const WorkerDesktopLaunchResultSchema: Type.TObject<{
  app: Type.TUnion<[Type.TLiteral<"browser">, Type.TLiteral<"terminal">]>;
  status: Type.TLiteral<"ready">;
}>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
type RuntimeTargetIssue = Static<typeof RuntimeTargetIssueSchema>;
type WorkerSlotSummary = Static<typeof WorkerSlotSummarySchema>;
type WorkerMachineOption = Static<typeof WorkerMachineOptionSchema>;
type WorkerOperatingSystem = Static<typeof WorkerOperatingSystemSchema>;
type WorkerExecutionMode = Static<typeof WorkerExecutionModeSchema>;
type EnvironmentsPrepareParams = Static<typeof EnvironmentsPrepareParamsSchema>;
type EnvironmentsPrepareResult = Static<typeof EnvironmentsPrepareResultSchema>;
type WorkerDesktopObserveResult = Static<typeof WorkerDesktopObserveResultSchema>;
type WorkerDesktopLaunchParams = Static<typeof WorkerDesktopLaunchParamsSchema>;
type WorkerDesktopLaunchResult = Static<typeof WorkerDesktopLaunchResultSchema>;
//#endregion
export { NodePluginToolDescriptor as _, WorkerDesktopLaunchParams as a, WorkerEnvironmentStartStatus as c, WorkerMachineOption as d, WorkerOperatingSystem as f, NodeInvokeProgressParams as g, NodeHostStatsPayload as h, RuntimeTargetIssue as i, WorkerEnvironmentState as l, WorkerTunnelStatus as m, EnvironmentsPrepareParams as n, WorkerDesktopLaunchResult as o, WorkerSlotSummary as p, EnvironmentsPrepareResult as r, WorkerDesktopObserveResult as s, DesktopAvailability as t, WorkerExecutionMode as u, NodeSkillDescriptor as v };