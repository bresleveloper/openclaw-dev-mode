import { a as ComputerActParamsSchema, c as ComputerUseCapabilityDescriptor, d as ScreenSnapshotParams, f as ScreenSnapshotParamsSchema, i as ComputerActParams, l as ComputerUseCapabilityDescriptorSchema, m as ScreenSnapshotResultSchema, n as parseScreenSnapshotParamsJSON, o as ComputerActResult, p as ScreenSnapshotResult, r as COMPUTER_USE_V2_ACTION_NAMES, s as ComputerActResultSchema, t as parseComputerActParamsJSON, u as ComputerUseV2ActionName } from "../computer-use-contract-BrLJ434o.js";
import { n as OpenClawPluginNodeHostCommandAvailabilityContext, t as OpenClawPluginNodeHostCommand } from "../types.node-host-oQhlRSVu.js";
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
export { COMPUTER_USE_V2_ACTION_NAMES, type ComputerActParams, ComputerActParamsSchema, type ComputerActResult, ComputerActResultSchema, type ComputerUseCapabilityDescriptor, ComputerUseCapabilityDescriptorSchema, type ComputerUseProvider, type ComputerUseV2ActionName, type ScreenSnapshotParams, ScreenSnapshotParamsSchema, type ScreenSnapshotResult, ScreenSnapshotResultSchema, parseComputerActParamsJSON, parseScreenSnapshotParamsJSON };