import { a as ComputerActResultSchema, c as ComputerUseV2ActionName, d as ScreenSnapshotResult, f as ScreenSnapshotResultSchema, i as ComputerActResult, l as ScreenSnapshotParams, m as parseScreenSnapshotParamsJSON, n as ComputerActParams, o as ComputerUseCapabilityDescriptor, p as parseComputerActParamsJSON, r as ComputerActParamsSchema, s as ComputerUseCapabilityDescriptorSchema, t as COMPUTER_USE_V2_ACTION_NAMES, u as ScreenSnapshotParamsSchema } from "../computer-use-contract-m5XGEc-d.js";
import { n as OpenClawPluginNodeHostCommandAvailabilityContext, t as OpenClawPluginNodeHostCommand } from "../types.node-host-l4KvC1QJ.js";
//#region src/plugins/computer-use-registration.d.ts
type ComputerUseExecution = {
  snapshot(paramsJSON: string | null | undefined, signal?: AbortSignal): Promise<string>;
  act(paramsJSON: string | null | undefined, signal?: AbortSignal): Promise<string>;
  close(reason: string): Promise<void>;
};
type ComputerUseProvider = {
  id: string;
  label: string;
  capabilities(): ComputerUseCapabilityDescriptor;
  isAvailable(): boolean;
  prepare?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => Promise<void> | void;
  watchAvailability?: OpenClawPluginNodeHostCommand["watchAvailability"];
  openExecution(context: {
    executionId: string;
    sessionKey?: string;
  }): Promise<ComputerUseExecution>;
};
type ComputerUseRegistrationApi = {
  registerNodeHostCommand(command: OpenClawPluginNodeHostCommand): void;
};
/** Register the canonical node-host command pair for one node-local provider. */
export declare function registerComputerUseProvider(api: ComputerUseRegistrationApi, provider: ComputerUseProvider): void;
//#endregion
export { COMPUTER_USE_V2_ACTION_NAMES, type ComputerActParams, ComputerActParamsSchema, type ComputerActResult, ComputerActResultSchema, type ComputerUseCapabilityDescriptor, ComputerUseCapabilityDescriptorSchema, type ComputerUseProvider, type ComputerUseV2ActionName, type ScreenSnapshotParams, ScreenSnapshotParamsSchema, type ScreenSnapshotResult, ScreenSnapshotResultSchema, parseComputerActParamsJSON, parseScreenSnapshotParamsJSON };