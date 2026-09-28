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
declare const RuntimeTargetIssueSchema: Type.TObject<{
  code: Type.TLiteral<"update-required">;
  action: Type.TLiteral<"update-and-reconnect">;
  updateCommand: Type.TLiteral<"openclaw update">;
  headlessReconnectCommand: Type.TLiteral<"openclaw node restart">;
}>;
/** Bounded live worker slots advertised by a connected node host. */
declare const WorkerSlotSummarySchema: Type.TRefine<Type.TObject<{
  total: Type.TInteger;
  available: Type.TInteger;
}>>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
type RuntimeTargetIssue = Static<typeof RuntimeTargetIssueSchema>;
type WorkerSlotSummary = Static<typeof WorkerSlotSummarySchema>;
//#endregion
export { WorkerTunnelStatus as a, WorkerSlotSummary as i, RuntimeTargetIssue as n, WorkerEnvironmentState as r, DesktopAvailability as t };