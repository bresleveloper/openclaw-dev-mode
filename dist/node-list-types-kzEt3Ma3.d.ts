import { _ as NodePluginToolDescriptor, h as NodeHostStatsPayload, i as RuntimeTargetIssue, p as WorkerSlotSummary } from "./environments-GFdlZ3hi.js";
import { o as ComputerUseCapabilityDescriptor } from "./computer-use-contract-m5XGEc-d.js";
//#region src/shared/node-host-stats.d.ts
type NodeHostStats = NodeHostStatsPayload & {
  updatedAtMs: number;
};
//#endregion
//#region src/shared/node-list-types.d.ts
type NodeWorkerBundleStatus = {
  status: "installed";
  version: string;
} | {
  status: "missing";
};
/** Node record returned by gateway node-list endpoints. */
type NodeListNode = {
  nodeId: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  clientId?: string;
  clientMode?: string;
  /** This node host runs from the Gateway's own canonical node-host installation. */
  gatewayLocal?: boolean;
  remoteIp?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  pathEnv?: string;
  caps?: string[];
  commands?: string[];
  computerUse?: ComputerUseCapabilityDescriptor;
  /** Node has explicitly enabled session hosting; live slots own current capacity. */
  sessionHost?: boolean;
  workerHost?: {
    deviceFolders?: true;
  };
  workerSlots?: WorkerSlotSummary;
  hostStats?: NodeHostStats;
  workerBundle?: NodeWorkerBundleStatus;
  issues?: readonly RuntimeTargetIssue[];
  nodePluginTools?: NodePluginToolDescriptor[];
  permissions?: Record<string, boolean>;
  approvalState?: "approved" | "pending-approval" | "pending-reapproval" | "unapproved";
  pendingRequestId?: string;
  pendingDeclaredCaps?: string[];
  pendingDeclaredCommands?: string[];
  pendingDeclaredPermissions?: Record<string, boolean>;
  paired?: boolean;
  connected?: boolean;
  connectedAtMs?: number;
  lastConnectedAtMs?: number;
  lastDisconnectedAtMs?: number;
  lastActiveAtMs?: number;
  presenceUpdatedAtMs?: number;
  active?: boolean;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
  approvedAtMs?: number;
};
//#endregion
export { NodeWorkerBundleStatus as n, NodeHostStats as r, NodeListNode as t };