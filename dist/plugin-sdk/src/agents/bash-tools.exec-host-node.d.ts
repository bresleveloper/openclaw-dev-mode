import type { ExecuteNodeHostCommandParams } from "./bash-tools.exec-host-node.types.js";
import type { ExecToolDetails } from "./bash-tools.exec-types.js";
import type { AgentToolResult } from "./runtime/index.js";
/**
 * Executes a command on a remote node, requesting approval when policy requires it.
 * Node-host approval combines caller policy and remote node approval snapshots.
 */
export declare function executeNodeHostCommand(params: ExecuteNodeHostCommandParams): Promise<AgentToolResult<ExecToolDetails>>;
