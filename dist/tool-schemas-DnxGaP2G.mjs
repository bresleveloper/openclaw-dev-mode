import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-BDV45rRZ.mjs";
import { i as normalizeOpenRouterModelFamilyId, r as normalizeOpenRouterApiModelId } from "./models-DFeYq0pM.mjs";
//#region extensions/openrouter/tool-schemas.ts
const openAiTools = buildProviderToolCompatFamilyHooks("openai");
const schemaTypes = /* @__PURE__ */ new Set([
	"null",
	"boolean",
	"object",
	"array",
	"number",
	"integer",
	"string"
]);
const schemaMapKeys = /* @__PURE__ */ new Set([
	"properties",
	"patternProperties",
	"dependentSchemas",
	"dependencies",
	"$defs",
	"definitions"
]);
const schemaValueKeys = /* @__PURE__ */ new Set([
	"items",
	"additionalItems",
	"prefixItems",
	"additionalProperties",
	"anyOf",
	"oneOf",
	"allOf",
	"then",
	"else",
	"if",
	"not",
	"contains",
	"propertyNames",
	"unevaluatedItems",
	"unevaluatedProperties",
	"contentSchema"
]);
function readSchemaTypes(type) {
	const types = Array.isArray(type) ? type : [type];
	return types.length > 0 && types.every((entry) => typeof entry === "string" && schemaTypes.has(entry)) ? types : void 0;
}
function canMoveParentType(branches, parentTypes) {
	return branches.length > 0 && branches.every((branch) => {
		const record = asOptionalRecord(branch);
		if (!record || "$ref" in record || "anyOf" in record || "oneOf" in record) return false;
		if (!("type" in record)) return true;
		return readSchemaTypes(record.type)?.every((type) => parentTypes.includes(type) || type === "integer" && parentTypes.includes("number")) === true;
	});
}
function normalizeMoonshotSchema(schema) {
	if (Array.isArray(schema)) return schema.map(normalizeMoonshotSchema);
	const record = asOptionalRecord(schema);
	if (!record) return schema;
	return normalizeMoonshotSchemaObject(record);
}
function normalizeMoonshotSchemaObject(record) {
	const next = Object.fromEntries(Object.entries(record).map(([key, value]) => {
		const entries = schemaMapKeys.has(key) ? asOptionalRecord(value) : void 0;
		if (entries) return [key, Object.fromEntries(Object.entries(entries).map(([name, child]) => [name, normalizeMoonshotSchema(child)]))];
		return [key, schemaValueKeys.has(key) ? normalizeMoonshotSchema(value) : value];
	}));
	const parentTypes = readSchemaTypes(next.type);
	const branches = next.anyOf;
	if (!parentTypes || !Array.isArray(branches) || !canMoveParentType(branches, parentTypes)) return next;
	const { type, ...result } = next;
	const typedBranches = [];
	for (const branch of branches) {
		const branchRecord = asOptionalRecord(branch);
		typedBranches.push(branchRecord && !("type" in branchRecord) ? {
			type,
			...branchRecord
		} : branch);
	}
	result.anyOf = typedBranches;
	return result;
}
const moonshotTools = {
	normalizeToolSchemas: (ctx) => ctx.tools.map((tool) => {
		const parameters = asOptionalRecord(tool.parameters);
		return parameters ? {
			...tool,
			parameters: normalizeMoonshotSchemaObject(parameters)
		} : tool;
	}),
	inspectToolSchemas: (_ctx) => []
};
function resolveOpenRouterToolFamily(modelId) {
	const normalized = normalizeOpenRouterModelFamilyId(normalizeOpenRouterApiModelId(modelId)) ?? modelId;
	if (normalized.startsWith("moonshot/") || normalized.startsWith("moonshotai/")) return moonshotTools;
	return openAiTools;
}
function normalizeOpenRouterToolSchemas(ctx) {
	return resolveOpenRouterToolFamily(ctx.modelId ?? "").normalizeToolSchemas(ctx);
}
function inspectOpenRouterToolSchemas(ctx) {
	return resolveOpenRouterToolFamily(ctx.modelId ?? "").inspectToolSchemas(ctx);
}
//#endregion
export { normalizeOpenRouterToolSchemas as n, inspectOpenRouterToolSchemas as t };
