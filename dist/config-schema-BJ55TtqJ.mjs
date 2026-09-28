import { I as toJSONSchema } from "./json-schema-processors-C6KO_BFy.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { O as evaluateDmPolicyAllowFromDependency, o as DmPolicySchema } from "./zod-schema.core-DyJd-bbI.mjs";
import { n as validateJsonSchemaValue, t as parseJsonSchemaIssuePath } from "./schema-validator-G8odGT6Q.mjs";
import { o as ToolPolicySchema } from "./zod-schema.agent-runtime-A2vJPWeP.mjs";
//#region src/channels/plugins/config-schema.ts
/**
* Channel config schema helpers.
*
* Builds common zod/JSON schema shapes and parses runtime config issues for channel plugins.
*/
/** Shared allowlist entry shape for channel sender/user ids. */
const AllowFromEntrySchema = union([string(), number()]);
/** Optional allowlist array used by channel config schema builders. */
const AllowFromListSchema = array(AllowFromEntrySchema).optional();
/** Validate one policy scope; the channel owns account selection and refinement ordering. */
function refineChannelDmPolicy(params) {
	const { channelId, value, accountId, ctx } = params;
	const account = accountId === void 0 ? value : value.accounts?.[accountId];
	if (!account) return;
	const policy = account.dmPolicy ?? value.dmPolicy;
	const violation = evaluateDmPolicyAllowFromDependency({
		policy,
		allowFrom: account.allowFrom ?? value.allowFrom
	});
	if (!violation) return;
	const root = `channels.${channelId}`;
	const owner = accountId === void 0 ? root : `${root}.accounts.*`;
	const inherited = accountId === void 0 ? "" : ` (or ${root}.allowFrom)`;
	const requirement = violation === "open_requires_wildcard" ? "include \"*\"" : "contain at least one sender ID";
	ctx.addIssue({
		code: ZodIssueCode.custom,
		path: accountId === void 0 ? ["allowFrom"] : [
			"accounts",
			accountId,
			"allowFrom"
		],
		message: `${owner}.dmPolicy="${policy}" requires ${owner}.allowFrom${inherited} to ${requirement}`
	});
}
/** Canonical per-group/room channel policy shape. */
const ChannelGroupEntrySchema = object({
	requireMention: boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: record(string(), ToolPolicySchema).optional(),
	skills: array(string()).optional(),
	enabled: boolean().optional(),
	allowFrom: AllowFromListSchema,
	systemPrompt: string().optional()
}).strict();
/** Extend the canonical group/room policy shape with channel-owned fields. */
function buildGroupEntrySchema(extraShape, options) {
	const omitted = new Set(options?.omit ?? []);
	const baseShape = Object.fromEntries(Object.entries(ChannelGroupEntrySchema.shape).filter(([key]) => !omitted.has(key)));
	return object({
		...baseShape,
		...extraShape ?? {}
	}).strict();
}
/** Build the common nested DM config block used by channel account schemas. */
function buildNestedDmConfigSchema(extraShape) {
	const baseShape = {
		enabled: boolean().optional(),
		policy: DmPolicySchema.optional(),
		allowFrom: AllowFromListSchema
	};
	return object(extraShape ? {
		...baseShape,
		...extraShape
	} : baseShape).optional();
}
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
function buildCatchallMultiAccountChannelSchema(accountSchema) {
	return buildMultiAccountChannelSchema(accountSchema, { accountsMode: "catchall" });
}
/** Add the standard accounts/defaultAccount envelope and optional shared account/root refinement. */
function buildMultiAccountChannelSchema(baseSchema, options = {}) {
	const refine = options.refine;
	const rawAccountSchema = options.accountSchema ?? baseSchema;
	const accountSchema = refine ? rawAccountSchema.superRefine((value, ctx) => {
		return refine(value, ctx);
	}) : rawAccountSchema;
	const accountValueSchema = options.optionalAccount ? accountSchema.optional() : accountSchema;
	const accountsSchema = options.accountsMode === "catchall" ? object({}).catchall(accountValueSchema).optional() : record(string(), accountValueSchema).optional();
	const channelSchema = baseSchema.extend({
		accounts: accountsSchema,
		defaultAccount: string().optional()
	});
	return refine ? channelSchema.superRefine((value, ctx) => {
		return refine(value, ctx);
	}) : channelSchema;
}
function cloneRuntimeIssue(issue) {
	const record = issue && typeof issue === "object" ? issue : {};
	const path = Array.isArray(record.path) ? record.path.filter((segment) => {
		const kind = typeof segment;
		return kind === "string" || kind === "number";
	}) : void 0;
	return {
		...record,
		...path ? { path } : {}
	};
}
function safeParseRuntimeSchema(schema, value) {
	const result = schema.safeParse(value);
	if (result.success) return {
		success: true,
		data: result.data
	};
	return {
		success: false,
		issues: result.error.issues.map((issue) => cloneRuntimeIssue(issue))
	};
}
function safeParseJsonSchema(schema, cacheKey, value) {
	const result = validateJsonSchemaValue({
		schema,
		cacheKey,
		value,
		applyDefaults: true
	});
	if (result.ok) return {
		success: true,
		data: result.value
	};
	return {
		success: false,
		issues: result.errors.map((issue) => ({
			path: parseJsonSchemaIssuePath(issue.path),
			message: issue.message
		}))
	};
}
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
function buildJsonChannelConfigSchema(schema, options) {
	return {
		schema,
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: options?.runtime ?? { safeParse: (value) => safeParseJsonSchema(schema, options?.cacheKey ?? "channel-config-schema:json", value) }
	};
}
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
function buildChannelConfigSchema(schema, options) {
	if ("_zod" in schema) return {
		schema: toJSONSchema(schema, {
			target: "draft-07",
			...options?.jsonSchemaMode ? { io: options.jsonSchemaMode } : {},
			unrepresentable: "any"
		}),
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
	return {
		schema: {
			type: "object",
			additionalProperties: true
		},
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
}
/** Return a channel config schema for channels that intentionally accept no config keys. */
function emptyChannelConfigSchema() {
	return {
		schema: {
			type: "object",
			additionalProperties: false,
			properties: {}
		},
		runtime: { safeParse(value) {
			if (value === void 0) return {
				success: true,
				data: void 0
			};
			if (!value || typeof value !== "object" || Array.isArray(value)) return {
				success: false,
				issues: [{
					path: [],
					message: "expected config object"
				}]
			};
			if (Object.keys(value).length > 0) return {
				success: false,
				issues: [{
					path: [],
					message: "config must be empty"
				}]
			};
			return {
				success: true,
				data: value
			};
		} }
	};
}
//#endregion
export { buildGroupEntrySchema as a, buildNestedDmConfigSchema as c, buildChannelConfigSchema as i, emptyChannelConfigSchema as l, ChannelGroupEntrySchema as n, buildJsonChannelConfigSchema as o, buildCatchallMultiAccountChannelSchema as r, buildMultiAccountChannelSchema as s, AllowFromListSchema as t, refineChannelDmPolicy as u };
