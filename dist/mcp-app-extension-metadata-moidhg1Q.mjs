import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/shared/mcp-app-extensions.ts
/** Wire metadata for OpenAI MCP Plugin Extensions; never a tool grant. */
const text = string().trim().min(1).max(2048);
const mcpAppIconSchema = object({
	src: text,
	mimeType: text.optional(),
	sizes: array(text).max(16).optional(),
	theme: _enum(["light", "dark"]).optional()
});
const quickActionSchema = object({
	title: text,
	icons: array(mcpAppIconSchema).min(1).max(16),
	target: object({
		type: literal("tool"),
		name: text,
		arguments: record(string(), unknown()).optional()
	})
});
const mcpAppEntrypointSchema = discriminatedUnion("type", [
	object({
		type: literal("global"),
		quickAction: quickActionSchema.optional()
	}),
	object({ type: literal("thread") }),
	object({
		type: literal("file"),
		extensions: array(string().trim().regex(/^\.[^\s/\\,]+$/)).min(1).max(64)
	}),
	object({
		type: literal("settings"),
		searchTerms: array(text).max(64).optional()
	})
]);
const mcpAppSettingsCapabilitySchema = object({
	readTool: text,
	updateTool: text
});
const title = {
	title: text,
	description: string().max(8192).optional()
};
const settingSchema = discriminatedUnion("type", [
	object({
		...title,
		type: literal("boolean")
	}),
	object({
		...title,
		type: literal("string"),
		enum: array(string()).optional(),
		minLength: number().int().nonnegative().optional(),
		maxLength: number().int().nonnegative().optional(),
		pattern: string().optional()
	}),
	...["number", "integer"].map((type) => object({
		...title,
		type: literal(type),
		minimum: number().finite().optional(),
		maximum: number().finite().optional(),
		multipleOf: number().positive().optional()
	}))
]);
const mcpAppSettingsSchema = object({
	schema: object({
		type: literal("object"),
		properties: record(string(), settingSchema),
		required: array(text).optional()
	}),
	values: record(string(), union([
		string(),
		number().finite(),
		boolean()
	])),
	layout: array(object({
		kind: literal("group"),
		title: text,
		items: array(discriminatedUnion("kind", [object({
			kind: literal("property"),
			property: text
		}), object({
			kind: literal("tool"),
			tool: text,
			...title
		})]))
	})).optional()
});
//#endregion
//#region src/agents/mcp-app-extension-metadata.ts
function readMcpAppSettings(value) {
	const settings = mcpAppSettingsSchema.parse(value);
	for (const key of Object.keys(settings.schema.properties)) if (!Object.hasOwn(settings.values, key)) throw new Error(`MCP settings missing effective value for ${key}`);
	return settings;
}
function readMcpAppSettingsCapability(capabilities) {
	const record = asOptionalRecord(capabilities);
	const value = asOptionalRecord(record?.extensions)?.["openai/settings"] ?? asOptionalRecord(record?.experimental)?.["openai/settings"];
	const parsed = mcpAppSettingsCapabilitySchema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
function readMcpAppIcons(value) {
	const parsed = array(mcpAppIconSchema).max(16).safeParse(value);
	return parsed.success && parsed.data.length ? parsed.data : void 0;
}
/** Decode advertised metadata without conferring visibility or execution authority. */
function readMcpAppToolExtensions(tool) {
	const meta = asOptionalRecord(tool._meta);
	const ui = asOptionalRecord(meta?.["openai/ui"]);
	const entrypoints = Array.isArray(ui?.entrypoints) ? ui.entrypoints.slice(0, 16).flatMap((value) => {
		const parsed = mcpAppEntrypointSchema.safeParse(value);
		return parsed.success ? [parsed.data] : [];
	}) : [];
	const visibility = asOptionalRecord(meta?.ui)?.visibility;
	const mentionSearch = Array.isArray(visibility) && visibility.includes("app") && asOptionalRecord(asOptionalRecord(meta?.["openai/extensions"])?.["mentions/search"]) !== void 0;
	const icons = readMcpAppIcons(tool.icons);
	const mode = ui?.preferredModelDisplayMode;
	return entrypoints.length || mentionSearch || icons || mode === "inline" || mode === "fullscreen" ? {
		...entrypoints.length ? { entrypoints } : {},
		...mentionSearch ? { mentionSearch: true } : {},
		...icons ? { icons } : {},
		...mode === "inline" || mode === "fullscreen" ? { preferredModelDisplayMode: mode } : {}
	} : void 0;
}
//#endregion
export { readMcpAppToolExtensions as i, readMcpAppSettings as n, readMcpAppSettingsCapability as r, readMcpAppIcons as t };
