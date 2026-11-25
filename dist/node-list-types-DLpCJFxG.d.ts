import { a as RuntimeTargetIssue, g as NodeHostStatsPayload, m as WorkerSlotSummary, v as NodePluginToolDescriptor } from "./environments-DuGZujQU.js";
import { c as ComputerUseCapabilityDescriptor } from "./computer-use-contract-BrLJ434o.js";
type NodeHostStats = NodeHostStatsPayload & {
  updatedAtMs: number;
};
type NodeWorkerBundleStatus = {
  status: "installed";
  version: string;
} | {
  status: "missing";
};
type NodeIdentityMetadata = {
  nodeId: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  remoteIp?: string;
};
/** Node record returned by gateway node-list endpoints. */
type NodeListNode = NodeIdentityMetadata & {
  clientId?: string;
  clientMode?: string;
  /** This node host runs from the Gateway's own canonical node-host installation. */
  gatewayLocal?: boolean;
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
export { NodeWorkerBundleStatus as n, NodeHostStats as r, NodeListNode as t };