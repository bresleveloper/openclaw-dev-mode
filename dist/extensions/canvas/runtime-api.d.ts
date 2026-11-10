import { M as OpenClawConfig } from "../../types-D7I_F5Ux.js";
import "../../config-contracts-CY87ANNp.js";
import "../../gateway-runtime-DcVrqV-f.js";
import { i as GatewayRpcOpts } from "../../gateway-rpc-CY-4AXWp.js";
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
export declare const A2UI_PATH = "/__openclaw__/a2ui";
export declare const CANVAS_HOST_PATH = "/__openclaw__/canvas";
//#endregion
//#region extensions/canvas/src/host/a2ui.d.ts
export declare function handleA2uiHttpRequest(req: A2uiHttpRequest, res: A2uiHttpResponse): Promise<boolean>;
//#endregion
//#region extensions/canvas/src/cli.d.ts
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
//#endregion
export type { CanvasHostConfig, CanvasNodesRpcOpts, CanvasPluginConfig };