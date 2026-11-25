import "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../gateway-runtime-D_zQvTfF.js";
import { i as GatewayRpcOpts } from "../../gateway-rpc-DXTfd5fR.js";
import { Command } from "commander";
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
type CanvasNodesRpcOpts = GatewayRpcOpts & {
  node?: string;
  invokeTimeout?: string;
  target?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
};
export declare function registerNodesCanvasCommands(nodes: Command): void;
export type { CanvasHostConfig, CanvasNodesRpcOpts, CanvasPluginConfig };