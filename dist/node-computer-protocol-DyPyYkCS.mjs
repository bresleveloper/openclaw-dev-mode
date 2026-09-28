import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { c as ComputerUseCapabilityDescriptorSchema, l as ScreenSnapshotParamsSchema, o as ComputerActParamsSchema } from "./computer-use-contract-DzawlQtp.mjs";
import { Type } from "typebox";
//#region src/worker/node-computer-protocol.ts
const ExecutionOwnerSchema = Type.Required(Type.Pick(ScreenSnapshotParamsSchema, ["executionId"]));
const ExecutionCloseFields = {
	...ExecutionOwnerSchema.properties,
	reason: Type.String({
		minLength: 1,
		maxLength: 64
	})
};
const NodeWorkerComputerCloseParamsSchema = Type.Object({
	action: Type.Literal("__close_execution"),
	...ExecutionCloseFields
}, { additionalProperties: false });
const NodeWorkerComputerInputSchema = Type.Union([
	Type.Object({ operation: Type.Literal("capabilities") }, { additionalProperties: false }),
	Type.Object({
		operation: Type.Literal("snapshot"),
		providerGeneration: ComputerUseCapabilityDescriptorSchema.properties.provider.properties.generation,
		params: Type.Intersect([ScreenSnapshotParamsSchema, ExecutionOwnerSchema])
	}, { additionalProperties: false }),
	Type.Object({
		operation: Type.Literal("act"),
		providerGeneration: ComputerUseCapabilityDescriptorSchema.properties.provider.properties.generation,
		params: Type.Intersect([ComputerActParamsSchema, ExecutionOwnerSchema])
	}, { additionalProperties: false }),
	Type.Object({
		operation: Type.Literal("close"),
		...ExecutionCloseFields
	}, { additionalProperties: false })
]);
const validateInput = /* @__PURE__ */ lazyCompile(NodeWorkerComputerInputSchema);
/** Private carrier for the existing registered Computer Use provider, never arbitrary node commands. */
function parseNodeWorkerComputerInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > 131072) throw new Error("INVALID_REQUEST: invalid worker computer request size");
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed worker computer request");
	}
	if (!validateInput(value)) throw new Error("INVALID_REQUEST: invalid worker computer request");
	return value;
}
//#endregion
export { parseNodeWorkerComputerInput as n, NodeWorkerComputerCloseParamsSchema as t };
