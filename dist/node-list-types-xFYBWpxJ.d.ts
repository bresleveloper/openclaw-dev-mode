import { i as WorkerSlotSummary, n as RuntimeTargetIssue } from "./environments-BX9CHZ7Z.js";
import { n as NodePluginToolDescriptor } from "./nodes-Bibk7CGC.js";
import { o as ComputerUseCapabilityDescriptor } from "./computer-use-contract-DHZnFt1X.js";
import { t as NodeHostStats } from "./node-host-stats-Pu9TCih-.js";
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
export { NodeWorkerBundleStatus as n, NodeListNode as t };