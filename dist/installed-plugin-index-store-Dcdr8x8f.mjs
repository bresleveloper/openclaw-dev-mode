import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import "./installed-plugin-index-Zl-RSskC.mjs";
import { n as recordInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { c as parsePluginInstallRecordMap } from "./installed-plugin-record-match-DMViKhkx.mjs";
import "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { l as preparePersistedInstalledPluginIndexCacheEntry, s as getPersistedInstalledPluginIndexCacheEntry } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
//#region src/plugins/plugin-source-admission.types.ts
const SourceAdmissionReceiptSchema = object({
	signature: string().min(1),
	sourceDigest: string().regex(/^[a-f0-9]{64}$/),
	nativeArtifacts: record(string(), object({
		sourceIdentity: string().min(1),
		contentHash: string().regex(/^[a-f0-9]{64}$/),
		sizeBytes: number().int().nonnegative().safe(),
		capturedPath: string().min(1),
		namespace: string().min(1),
		capturedIdentity: string().min(1)
	})),
	nativeNamespaces: record(string(), object({
		sourceDirectory: string().min(1),
		capturedRoot: string().min(1),
		managed: boolean(),
		/** Original immutable npm directory, retained by the install-generation owner. */
		referenceRoot: string().min(1).optional(),
		members: record(string(), object({
			source: string().min(1),
			sourceIdentity: string().min(1),
			capturedIdentity: string().min(1),
			boundaryChecked: boolean(),
			contentHash: string().regex(/^[a-f0-9]{64}$/).optional(),
			sizeBytes: number().int().nonnegative().safe().optional()
		}))
	}))
});
//#endregion
//#region src/plugins/installed-plugin-index-store.ts
/** Reads and parses the installed plugin index in the state database. */
const StringArraySchema = array(string());
const InstalledPluginIndexStartupSchema = object({
	sidecar: boolean(),
	memory: boolean(),
	agentHarnesses: StringArraySchema,
	configPaths: StringArraySchema.optional()
});
const InstalledPluginIndexContributionSchema = object({
	channels: StringArraySchema,
	channelConfigs: StringArraySchema,
	providers: StringArraySchema,
	modelCatalogProviders: StringArraySchema,
	modelSupportPrefixes: StringArraySchema,
	modelSupportPatterns: StringArraySchema,
	autoEnableProviderIds: StringArraySchema,
	commandAliases: StringArraySchema,
	contracts: record(string(), StringArraySchema)
});
const InstalledPluginFileSignatureSchema = object({
	size: number(),
	mtimeMs: number(),
	ctimeMs: number().optional()
});
const InstalledPluginIndexRecordSchema = object({
	pluginId: string(),
	installOwner: string().optional(),
	installOwnerAmbiguous: literal(true).optional(),
	packageName: string().optional(),
	packageVersion: string().optional(),
	installRecordHash: string().optional(),
	sourceAdmissions: record(string(), SourceAdmissionReceiptSchema).optional().catch(void 0),
	packageInstall: unknown().optional(),
	packageChannel: unknown().optional(),
	packageBuild: object({ bundledDist: boolean().optional() }).optional(),
	manifestPath: string(),
	manifestHash: string(),
	doctorContractHash: string().optional(),
	doctorContractFile: InstalledPluginFileSignatureSchema.optional(),
	manifestFile: InstalledPluginFileSignatureSchema.optional(),
	format: string().optional(),
	bundleFormat: string().optional(),
	source: string().optional(),
	setupSource: string().optional(),
	packageJson: object({
		path: string(),
		hash: string(),
		fileSignature: InstalledPluginFileSignatureSchema.optional()
	}).optional(),
	rootDir: string(),
	origin: string(),
	enabled: boolean(),
	enabledByDefault: boolean().optional(),
	enabledByDefaultOnPlatforms: StringArraySchema.optional(),
	syntheticAuthRefs: StringArraySchema.optional(),
	startup: InstalledPluginIndexStartupSchema,
	contributions: InstalledPluginIndexContributionSchema.optional(),
	compat: array(string())
});
const PluginDiagnosticSchema = object({
	level: union([literal("warn"), literal("error")]),
	message: string(),
	pluginId: string().optional(),
	source: string().optional(),
	code: string().optional(),
	configDisposition: literal("preserve").optional(),
	errorCode: string().optional(),
	fixHint: string().optional()
});
const InstalledPluginIndexSchema = object({
	version: literal(1),
	warning: string().optional(),
	hostContractVersion: string(),
	compatRegistryVersion: string(),
	migrationVersion: literal(1),
	policyHash: string(),
	generatedAtMs: number(),
	workspaceDir: string().optional(),
	refreshReason: string().optional(),
	installRecords: unknown().optional(),
	plugins: array(InstalledPluginIndexRecordSchema),
	diagnostics: array(PluginDiagnosticSchema)
});
function parseInstalledPluginIndex(value) {
	const parsed = safeParseWithSchema(InstalledPluginIndexSchema, value);
	if (!parsed) return null;
	const installRecords = parsePluginInstallRecordMap(parsed.installRecords);
	if (!installRecords) return null;
	for (const diagnostic of parsed.diagnostics) if (diagnostic.level === "warn" && diagnostic.code === "explicit-config-plugin-selection") diagnostic.level = "info";
	return {
		version: parsed.version,
		...parsed.warning ? { warning: parsed.warning } : {},
		hostContractVersion: parsed.hostContractVersion,
		compatRegistryVersion: parsed.compatRegistryVersion,
		migrationVersion: parsed.migrationVersion,
		policyHash: parsed.policyHash,
		generatedAtMs: parsed.generatedAtMs,
		...parsed.workspaceDir !== void 0 ? { workspaceDir: parsed.workspaceDir } : {},
		...parsed.refreshReason ? { refreshReason: parsed.refreshReason } : {},
		installRecords,
		plugins: parsed.plugins.map(({ installOwner, installOwnerAmbiguous, ...plugin }) => recordInstalledPluginIndexInstallOwner(plugin, installOwner, installOwnerAmbiguous === true)),
		diagnostics: parsed.diagnostics
	};
}
async function readPersistedInstalledPluginIndex(options = {}) {
	const prepared = await preparePersistedInstalledPluginIndexCacheEntry(options);
	prepared.assertCurrent();
	return parseCachedInstalledPluginIndex(prepared.entry);
}
function readPersistedInstalledPluginIndexSync(options = {}) {
	return parseCachedInstalledPluginIndex(getPersistedInstalledPluginIndexCacheEntry(options));
}
function parseCachedInstalledPluginIndex(entry) {
	if (entry.index === void 0) {
		const value = entry.state.status === "present" ? entry.state.value : void 0;
		entry.index = value && typeof value === "object" && "revision" in value && typeof value.revision === "number" ? parseInstalledPluginIndex("index" in value ? value.index : void 0) : null;
	}
	return entry.index;
}
//#endregion
export { readPersistedInstalledPluginIndex as n, readPersistedInstalledPluginIndexSync as r, parseInstalledPluginIndex as t };
