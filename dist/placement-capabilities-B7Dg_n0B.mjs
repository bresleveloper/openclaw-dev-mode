import "./agent-runtime-id-BZLMe-UU.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
//#region src/gateway/worker-environments/placement-capabilities.ts
/** Returns the bounded placement contract declared by one active agent runtime. */
function resolveWorkerPlacementCapabilities(runtime) {
	const runtimeId = runtime.trim();
	if (runtimeId === "openclaw") return {
		executionMode: "worker-turn",
		devicePlacement: {
			requiredNodeCommands: [],
			consumesWorkerSlot: true
		}
	};
	const placement = getRegisteredAgentHarness(runtimeId)?.harness.cloudPlacement;
	if (!placement) return {};
	const requirement = placement.devicePlacement;
	if (!requirement) return { executionMode: placement.mode };
	const requiredNodeCommands = [...new Set(requirement.requiredNodeCommands)].toSorted();
	if (requiredNodeCommands.length > 32 || requiredNodeCommands.some((command) => command.length === 0 || command.length > 128 || command.trim() !== command)) return { executionMode: placement.mode };
	return {
		executionMode: placement.mode,
		devicePlacement: {
			requiredNodeCommands,
			consumesWorkerSlot: requirement.consumesWorkerSlot
		}
	};
}
//#endregion
export { resolveWorkerPlacementCapabilities as t };
