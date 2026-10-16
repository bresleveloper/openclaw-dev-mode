import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { rt as OpenClawRegisteredAgentDatabase } from "./reply-payload-DazZPys5.js";
import "./openclaw-state-db-Yba_0aSZ.js";
import "./openclaw-state-db.generated-CriCmxNW.js";
import "@openclaw/fs-safe/advanced";
import "minimatch";
//#region src/hooks/internal-hook-types.d.ts
type InternalHookEventType = "command" | "session" | "agent" | "gateway" | "message";
interface InternalHookEvent {
  /** The type of event (command, session, agent, gateway, etc.) */
  type: InternalHookEventType;
  /** The specific action within the type (e.g., 'new', 'reset', 'stop') */
  action: string;
  /** The session key this event relates to */
  sessionKey: string;
  /** Additional context specific to the event */
  context: Record<string, unknown>;
  /** Timestamp when the event occurred */
  timestamp: Date;
  /** Messages to send back to the user (hooks can push to this array) */
  messages: string[];
}
type InternalHookHandler = (event: InternalHookEvent) => Promise<void> | void;
//#endregion
//#region src/state/agent-deletion-journal.types.d.ts
type RetainedAgentDeletion = {
  agentId: string;
  agentDir: string;
  databasePaths: string[];
};
type HeldAgentDatabase = {
  agentId: string;
  path: string;
};
type KnownAgentDeletionFacts = {
  entries: RetainedAgentDeletion[];
  held: HeldAgentDatabase[];
};
type AgentDeletionJournalDisposition = {
  status: "unavailable";
  cause: "missing" | "unreadable";
  reason: string;
  known?: KnownAgentDeletionFacts;
} | {
  status: "empty";
} | ({
  status: "present";
} & KnownAgentDeletionFacts);
type AgentDatabaseDeletionSnapshot = {
  retainedDeletions: AgentDeletionJournalDisposition;
  registeredAgentDatabases: OpenClawRegisteredAgentDatabase[];
};
//#endregion
//#region src/agents/workspace-bootstrap-policy.d.ts
/**
 * Canonical bootstrap filenames in prompt order. Single source for the runtime
 * validation set, the name union, and the Control UI core-files list; a private
 * copy anywhere else silently drifts when a file is retired.
 */
declare const WORKSPACE_BOOTSTRAP_FILENAMES: readonly ["AGENTS.md", "SOUL.md", "IDENTITY.md", "USER.md", "BOOTSTRAP.md", "MEMORY.md"];
type WorkspaceBootstrapFileName = (typeof WORKSPACE_BOOTSTRAP_FILENAMES)[number];
type WorkspaceBootstrapFile = {
  name: WorkspaceBootstrapFileName;
  path: string;
  content?: string;
  missing: boolean;
  /** Set only by the authenticated personal USER loader, never inferred from a path. */
  personalUser?: true;
};
/** Restrict a workspace adapter to native bootstrap reads and owner-document writes. */
declare function createWorkspaceBootstrapFilePolicy(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
}): {
  canRead: (relativePath: string) => boolean;
  canList: (relativePath: string) => boolean;
  canWrite: (relativePath: string) => boolean;
};
//#endregion
//#region src/state/agent-deletion-journal-recovery.kernel.d.ts
type AgentDeletionRecoveryHoldPredicate = {
  agentId: string;
  held: readonly HeldAgentDatabase[];
  applies: boolean;
};
//#endregion
//#region src/agents/workspace-state-store.worker-contract.d.ts
type WorkspaceStateGuard = {
  /** Host lifecycle and filesystem authority only; never reads SQLite. */
  assertHost?: () => void;
  recoveryHoldPredicate?: AgentDeletionRecoveryHoldPredicate;
  /** Released SDK compatibility: before worker dispatch or host file mutation, never a grant. */
  beforeLegacyApply?: () => void;
};
//#endregion
//#region src/agents/workspace.d.ts
type EnsureAgentWorkspaceParams = {
  dir?: string;
  ensureBootstrapFiles?: boolean;
  /** Approved custom-agent instructions; never replaces an existing AGENTS.md. */
  purpose?: string;
  /** Creation-time role content; existing workspace files are still preserved. */
  templates?: Partial<Record<"AGENTS.md" | "SOUL.md" | "IDENTITY.md", string>>;
  /** Guard each new mutation after async preparation; admitted effects may settle. */
  guard?: WorkspaceStateGuard;
  /**
   * List of optional bootstrap filenames to skip writing.
   * Applies only to SOUL.md, USER.md, IDENTITY.md.
   * Required workspace setup such as AGENTS.md still runs.
   */
  skipOptionalBootstrapFiles?: string[];
  /**
   * Workspace provisioning mode. "runtime-managed-implicit" marks a workspace
   * owned by a runtime-managed (ACP) agent without an explicit workspace and
   * with a distinct authoritative cwd: only the directory is provisioned, and
   * bootstrap files, workspace setup state, and `git init` are skipped (#92015).
   */
  provisioning?: "standard" | "runtime-managed-implicit";
};
type EnsuredAgentWorkspace = {
  dir: string;
  agentsPath?: string;
  soulPath?: string;
  identityPath?: string;
  userPath?: string;
  bootstrapPath?: string;
  bootstrapPending?: boolean;
  identityPathCreated?: boolean;
};
declare function ensureAgentWorkspace(params?: EnsureAgentWorkspaceParams): Promise<EnsuredAgentWorkspace>;
//#endregion
export { InternalHookEvent as a, AgentDatabaseDeletionSnapshot as i, WorkspaceBootstrapFile as n, InternalHookEventType as o, createWorkspaceBootstrapFilePolicy as r, InternalHookHandler as s, ensureAgentWorkspace as t };