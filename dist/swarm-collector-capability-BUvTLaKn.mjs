import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { f as SESSIONS_SPAWN_COLLECTOR_GUIDANCE } from "./tool-description-presets-CT4WhVkI.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import "./common-XfKigJno.mjs";
import { _ as bindAgentToolAvailability, b as getAgentToolAvailabilityBinding } from "./agent-tool-metadata-COcr-3AD.mjs";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-D9z9oa3w.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/subagents/swarm/swarm-collector-capability.ts
const COLLECTOR_FIELDS = [
	"collect",
	"outputSchema",
	"groupId"
];
const WAIT_GUIDANCE = SESSIONS_SPAWN_COLLECTOR_GUIDANCE.replace(/\.$/u, "; await with agents_wait.");
const readerBinding = { prepare() {} };
const spawnCapabilities = /* @__PURE__ */ new WeakMap();
const collectorFieldsBySchema = /* @__PURE__ */ new WeakMap();
const joinedSpawns = new AsyncLocalStorage();
function markCollectorReaderTool(tool) {
	return bindAgentToolAvailability(tool, readerBinding);
}
function collectorSchema(schema, fields) {
	if (!isRecord(schema) || !isRecord(schema.properties)) throw new ToolInputError("Collector spawn schema is unavailable.");
	const previousProperties = schema.properties;
	if (COLLECTOR_FIELDS.every((field) => previousProperties[field] === fields[field])) return schema;
	const properties = { ...previousProperties };
	for (const field of COLLECTOR_FIELDS) delete properties[field];
	return {
		...schema,
		properties: {
			...properties,
			...fields
		}
	};
}
function collectorFieldsFromSchema(schema) {
	if (!isRecord(schema) || !isRecord(schema.properties)) return;
	const properties = schema.properties;
	const fields = Object.fromEntries(COLLECTOR_FIELDS.filter((field) => field in properties).map((field) => [field, properties[field]]));
	return Object.keys(fields).length > 0 ? fields : void 0;
}
function bindCollectorSpawnTool(tool, properties, signal) {
	const fields = Object.fromEntries(COLLECTOR_FIELDS.filter((field) => field in properties).map((field) => [field, properties[field]]));
	const capability = {
		nativeReader: void 0,
		signal
	};
	const binding = {
		prepare(current, callableTools) {
			const schema = current.parameters;
			const retainedFields = collectorFieldsBySchema.get(schema);
			const currentFields = retainedFields ?? collectorFieldsFromSchema(schema) ?? fields;
			const reader = callableTools.get("agents_wait");
			capability.nativeReader = reader && getAgentToolAvailabilityBinding(reader) === readerBinding && filterRuntimeCompatibleTools([reader]).tools.length === 1 ? reader : void 0;
			const preparedSchema = collectorSchema(schema, capability.nativeReader ? currentFields : {});
			if (preparedSchema !== schema || !retainedFields) collectorFieldsBySchema.set(preparedSchema, currentFields);
			current.parameters = preparedSchema;
			const description = current.description.replace(WAIT_GUIDANCE, "").replace(SESSIONS_SPAWN_COLLECTOR_GUIDANCE, "").trim();
			current.description = capability.nativeReader && Object.keys(fields).length > 0 ? `${description} ${WAIT_GUIDANCE}` : description;
		},
		executionSchema(currentSchema) {
			const joined = joinedSpawns.getStore();
			if (joined?.owner !== binding) return currentSchema;
			assertJoinedSpawn(joined);
			return collectorSchema(currentSchema, fields);
		}
	};
	spawnCapabilities.set(binding, capability);
	bindAgentToolAvailability(tool, binding);
	binding.prepare(tool, /* @__PURE__ */ new Map());
	return tool;
}
function isCollectorSpawnTool(tool) {
	const binding = getAgentToolAvailabilityBinding(tool);
	return binding !== void 0 && spawnCapabilities.has(binding);
}
function assertJoinedSpawn(joined) {
	if (!joined.active) throw new ToolInputError("Joined collector spawn is no longer active.");
	joined.assertCurrent();
}
/** One lexical joined call; neither replay metadata nor guest input can mint it. */
async function runWithJoinedCollectorSpawn(tool, assertCurrent, run) {
	const owner = getAgentToolAvailabilityBinding(tool);
	if (!owner || !spawnCapabilities.has(owner)) throw new ToolInputError("agents.run requires the native collector spawn tool.");
	const joined = {
		owner,
		assertCurrent,
		active: true,
		claimed: false
	};
	return await joinedSpawns.run(joined, async () => {
		try {
			assertJoinedSpawn(joined);
			return await run();
		} finally {
			joined.active = false;
		}
	});
}
/** Bind the private context to the catalog's exact invocation before awaited hooks. */
function bindJoinedCollectorInvocation(tool, toolCallId) {
	const joined = joinedSpawns.getStore();
	if (!joined || joined.owner !== getAgentToolAvailabilityBinding(tool)) return;
	assertJoinedSpawn(joined);
	if (joined.toolCallId !== void 0) throw new ToolInputError("Joined collector spawn already has an invocation.");
	joined.toolCallId = toolCallId;
}
function captureCollectorSpawnGuard(tool, toolCallId, assertActive) {
	const owner = getAgentToolAvailabilityBinding(tool);
	const capability = owner && spawnCapabilities.get(owner);
	const joined = joinedSpawns.getStore();
	if (joined && joined.owner === owner && joined.toolCallId === toolCallId) {
		assertJoinedSpawn(joined);
		if (joined.claimed) throw new ToolInputError("Joined collector spawn was already claimed.");
		joined.claimed = true;
		return () => {
			assertActive();
			capability?.signal?.throwIfAborted();
			assertJoinedSpawn(joined);
		};
	}
	return () => {
		assertActive();
		capability?.signal?.throwIfAborted();
		if (!capability?.nativeReader) throw new ToolInputError("Collector results are unavailable in this tool surface. Omit collect, outputSchema, and groupId to start an ordinary announcing child.");
	};
}
//#endregion
export { markCollectorReaderTool as a, isCollectorSpawnTool as i, bindJoinedCollectorInvocation as n, runWithJoinedCollectorSpawn as o, captureCollectorSpawnGuard as r, bindCollectorSpawnTool as t };
