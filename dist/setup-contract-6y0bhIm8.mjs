import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { Option } from "commander";
//#region src/channels/plugins/setup-contract.ts
function resolveChannelSetupFieldCliAttributeName(flags) {
	const option = new Option(flags);
	return option.long ? option.attributeName() : void 0;
}
function assertChannelSetupFieldCliAttributeName(key, flags) {
	let attributeName;
	try {
		attributeName = resolveChannelSetupFieldCliAttributeName(flags);
	} catch {
		throw new Error(`Channel setup field "${key}" has invalid CLI flags "${flags}".`);
	}
	if (!attributeName) throw new Error(`Channel setup field "${key}" must declare a long CLI flag.`);
	if (attributeName !== key) throw new Error(`Channel setup field "${key}" must match camelCased long flag name "${attributeName}" from "${flags}".`);
}
/** Adapts the released shared-bag contract at one explicit compatibility boundary. */
function resolveChannelSetupExecutionAdapter(plugin) {
	return plugin.setupContract ?? plugin.setup;
}
function parseStringList(value) {
	if (Array.isArray(value)) return value.every((entry) => typeof entry === "string") ? value : void 0;
	if (typeof value !== "string") return;
	return value.split(/[\n,]/u).map((entry) => entry.trim()).filter(Boolean);
}
function parseFieldValue(key, field, value) {
	if (field.kind === "string") return typeof value === "string" ? {
		ok: true,
		value
	} : {
		ok: false,
		error: `${key} must be a string.`
	};
	if (field.kind === "boolean") return typeof value === "boolean" ? {
		ok: true,
		value
	} : {
		ok: false,
		error: `${key} must be true or false.`
	};
	if (field.kind === "integer") {
		const parsed = parseStrictNonNegativeInteger(value);
		return parsed === void 0 ? {
			ok: false,
			error: `${key} must be a non-negative integer.`
		} : {
			ok: true,
			value: parsed
		};
	}
	if (field.kind === "string-list") {
		const parsed = parseStringList(value);
		return parsed ? {
			ok: true,
			value: parsed
		} : {
			ok: false,
			error: `${key} must be a comma-separated list of strings.`
		};
	}
	if (typeof value !== "string" || !field.choices.includes(value)) return {
		ok: false,
		error: `${key} must be one of: ${field.choices.map((choice) => JSON.stringify(choice)).join(", ")}.`
	};
	return {
		ok: true,
		value
	};
}
function parseSetupInput(fields, rawInput) {
	if (!isRecord(rawInput)) return {
		ok: false,
		error: "Channel setup input must be an object."
	};
	const value = {};
	for (const [key, rawValue] of Object.entries(rawInput)) {
		if (rawValue === void 0) continue;
		if (key === "name") {
			if (typeof rawValue !== "string") return {
				ok: false,
				error: "name must be a string."
			};
			value.name = rawValue;
			continue;
		}
		const field = fields[key];
		if (!field) return {
			ok: false,
			error: `Unsupported setup option: ${key}`
		};
		const parsed = parseFieldValue(key, field, rawValue);
		if (!parsed.ok) return parsed;
		value[key] = parsed.value;
	}
	return {
		ok: true,
		value
	};
}
function requireParsedInput(fields, input) {
	const parsed = parseSetupInput(fields, input);
	if (!parsed.ok) throw new Error(parsed.error);
	return parsed.value;
}
function defineChannelSetupContract(params) {
	const { fields } = params;
	const fieldEntries = Object.entries(fields);
	for (const [key, field] of fieldEntries) {
		assertChannelSetupFieldCliAttributeName(key, field.cli.flags);
		if (field.cli.negatedFlags) assertChannelSetupFieldCliAttributeName(key, field.cli.negatedFlags);
	}
	const adapter = params.adapter ?? params.legacyAdapter;
	const prepareAccountConfigInput = adapter.prepareAccountConfigInput;
	return {
		kind: "channel-owned",
		metadata: { fields: fieldEntries.map(([key, field]) => Object.assign({}, field, { key })) },
		parseInput: (input) => parseSetupInput(fields, input),
		...adapter.resolveAccountId ? { resolveAccountId: (inputParams) => adapter.resolveAccountId?.({
			...inputParams,
			input: requireParsedInput(fields, inputParams.input ?? {})
		}) ?? inputParams.accountId ?? "default" } : {},
		...prepareAccountConfigInput ? { prepareAccountConfigInput: async (inputParams) => await prepareAccountConfigInput({
			...inputParams,
			input: requireParsedInput(fields, inputParams.input)
		}) } : {},
		resolveBindingAccountId: adapter.resolveBindingAccountId,
		applyAccountName: adapter.applyAccountName,
		applyAccountConfig: (inputParams) => adapter.applyAccountConfig({
			...inputParams,
			input: requireParsedInput(fields, inputParams.input)
		}),
		...adapter.afterAccountConfigWritten ? { afterAccountConfigWritten: (inputParams) => adapter.afterAccountConfigWritten?.({
			...inputParams,
			input: requireParsedInput(fields, inputParams.input)
		}) } : {},
		...adapter.validateInput ? { validateInput: (inputParams) => {
			const parsed = parseSetupInput(fields, inputParams.input);
			if (!parsed.ok) return parsed.error;
			return adapter.validateInput?.({
				...inputParams,
				input: parsed.value
			}) ?? null;
		} } : {},
		accountKeyPolicy: adapter.accountKeyPolicy,
		configPromotion: adapter.configPromotion,
		singleAccountKeysToMove: adapter.singleAccountKeysToMove,
		namedAccountPromotionKeys: adapter.namedAccountPromotionKeys,
		resolveSingleAccountPromotionTarget: adapter.resolveSingleAccountPromotionTarget
	};
}
//#endregion
export { resolveChannelSetupExecutionAdapter as n, resolveChannelSetupFieldCliAttributeName as r, defineChannelSetupContract as t };
