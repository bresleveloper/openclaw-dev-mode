import { Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as sensitive, r as SecretInputSchema } from "./zod-schema.sensitive-bEFwMmOC.mjs";
//#region src/config/zod-schema.memory-search.ts
const MemorySearchSchema = strictObject({
	enabled: boolean().optional(),
	rememberAcrossConversations: boolean().optional(),
	sources: array(union([literal("memory"), literal("sessions")])).optional(),
	extraPaths: array(union([string(), strictObject({
		path: string(),
		pattern: string().optional()
	})])).optional(),
	multimodal: strictObject({
		enabled: boolean().optional(),
		modalities: array(union([
			literal("image"),
			literal("audio"),
			literal("all")
		])).optional(),
		maxFileBytes: number().int().positive().optional()
	}).optional(),
	experimental: strictObject({ sessionMemory: boolean().optional() }).optional(),
	provider: string().optional(),
	remote: strictObject({
		baseUrl: string().optional(),
		apiKey: SecretInputSchema.optional().register(sensitive),
		headers: record(string(), string()).optional(),
		batch: strictObject({ enabled: boolean().optional() }).optional()
	}).optional(),
	fallback: string().optional(),
	model: string().optional(),
	inputType: string().min(1).optional(),
	queryInputType: string().min(1).optional(),
	documentInputType: string().min(1).optional(),
	outputDimensionality: number().int().positive().optional(),
	local: strictObject({ modelPath: string().optional() }).optional(),
	store: strictObject({
		fts: strictObject({ tokenizer: union([literal("unicode61"), literal("trigram")]).optional() }).optional(),
		vector: strictObject({
			enabled: boolean().optional(),
			extensionPath: string().optional()
		}).optional()
	}).optional(),
	query: strictObject({
		maxResults: number().int().positive().optional(),
		minScore: number().min(0).max(1).optional()
	}).optional(),
	cache: strictObject({ enabled: boolean().optional() }).optional()
}).optional();
//#endregion
export { MemorySearchSchema as t };
