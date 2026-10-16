import { n as OpenClawConfig } from "../../types.openclaw-C-OasKBU.js";
import "../../node-list-types-BtJ_nH3c.js";
import "../../config-contracts-C9WIRZbi.js";
import { Command } from "commander";
//#region extensions/canvas/src/config.d.ts
type CanvasHostConfig = {
  enabled?: boolean;
};
type CanvasPluginConfig = {
  host?: CanvasHostConfig;
};
export declare function parseCanvasPluginConfig(value: unknown): CanvasPluginConfig;
export declare function resolveCanvasHostConfig(params: {
  config?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
}): CanvasHostConfig;
export declare function isCanvasHostEnabled(config?: OpenClawConfig): boolean;
export declare const canvasConfigSchema: {
  parse: typeof parseCanvasPluginConfig;
};
//#endregion
//#region extensions/canvas/src/host/a2ui-route.d.ts
type A2uiHttpRequest = {
  method?: string;
  url?: string;
};
type A2uiHttpResponse = {
  statusCode: number;
  setHeader(name: string, value: number | string | readonly string[]): void;
  end(chunk?: Buffer | string): void;
};
//#endregion
//#region extensions/canvas/src/host/a2ui-shared.d.ts
/** Stable hosted paths for Canvas-owned widget resources. */
/** Hosted path prefix for bundled A2UI renderer assets. */
export declare const A2UI_PATH = "/__openclaw__/a2ui";
/** Hosted path prefix for managed widget documents. */
export declare const CANVAS_HOST_PATH = "/__openclaw__/canvas";
//#endregion
//#region extensions/canvas/src/host/a2ui.d.ts
/** Handles one HTTP request for the hosted A2UI asset surface. */
export declare function handleA2uiHttpRequest(req: A2uiHttpRequest, res: A2uiHttpResponse): Promise<boolean>;
//#endregion
//#region src/cli/nodes-cli/rpc.d.ts
/** Attach shared Gateway connection/json options to a node command. */
declare const nodesCallOpts: (cmd: Command, defaults?: {
  timeoutMs?: number;
}) => Command;
/** Build a node.invoke payload with an idempotency key and optional timeout. */
declare function buildNodeInvokeParams(params: {
  nodeId: string;
  command: string;
  params?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
}): Record<string, unknown>;
//#endregion
//#region extensions/canvas/src/cli.d.ts
type CanvasCliRuntime = {
  log: (message: string) => void;
  error: (message: string) => void;
  exit: (code: number) => void;
  writeJson: (value: unknown) => void;
};
type CanvasNodesRpcOpts = {
  url?: string;
  token?: string;
  timeout?: string;
  json?: boolean;
  node?: string;
  invokeTimeout?: string;
  target?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
};
type CanvasCliDependencies = {
  defaultRuntime: CanvasCliRuntime;
  nodesCallOpts: typeof nodesCallOpts;
  runNodesCommand: (label: string, action: () => Promise<void>) => Promise<void> | void;
  getNodesTheme: () => {
    ok: (value: string) => string;
  };
  parseTimeoutMs: (raw: unknown) => number | undefined;
  resolveNodeId: (opts: CanvasNodesRpcOpts, query: string) => Promise<string>;
  buildNodeInvokeParams: typeof buildNodeInvokeParams;
  callGatewayCli: (method: string, opts: CanvasNodesRpcOpts, params?: unknown, callOpts?: {
    transportTimeoutMs?: number;
  }) => Promise<unknown>;
};
export declare function registerNodesCanvasCommands(nodes: Command, deps: CanvasCliDependencies): void;
//#endregion
export type { CanvasCliDependencies, CanvasHostConfig, CanvasNodesRpcOpts, CanvasPluginConfig };