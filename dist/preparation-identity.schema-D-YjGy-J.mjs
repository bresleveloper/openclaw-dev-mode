import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Un as record, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { createHash } from "node:crypto";
import JSON5 from "json5";
//#region src/gateway/worker-environments/environment-recipe.ts
const ProcessString = string().refine((value) => !value.includes("\0"), "Must not contain NUL");
const Command = union([ProcessString, array(ProcessString).min(1).refine((args) => Boolean(args[0]?.length), "Executable must not be empty")]);
const Lifecycle = union([Command, record(string(), Command)]);
const Blob = string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u);
const SecretName = string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u);
const SecretRequests = record(SecretName, object({
	description: string().optional(),
	documentationUrl: string().optional()
}).passthrough()).refine((value) => Object.keys(value).length <= 16, "At most 16 setup secrets may be requested");
const Environment = record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u), ProcessString);
const EnvironmentRecipeSchema = object({
	source: _enum([
		"devcontainer",
		"script",
		"detected",
		"none"
	]),
	identity: Blob.optional(),
	inputs: record(string(), Blob),
	env: record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u), ProcessString.nullable()),
	secretNames: array(SecretName).max(16).optional(),
	ignoredPropertiesNote: string().optional(),
	onCreate: Lifecycle.optional(),
	updateContent: Lifecycle.optional(),
	postCreate: Lifecycle.optional(),
	postStart: Lifecycle.optional(),
	detectedInstall: Lifecycle.optional()
}).strict();
const Devcontainer = object({
	onCreateCommand: Lifecycle.optional(),
	updateContentCommand: Lifecycle.optional(),
	postCreateCommand: Lifecycle.optional(),
	postStartCommand: Lifecycle.optional(),
	secrets: SecretRequests.optional(),
	containerEnv: Environment.optional(),
	remoteEnv: record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u), ProcessString.nullable()).optional()
}).passthrough();
const supportedProperties = /* @__PURE__ */ new Set([
	"onCreateCommand",
	"updateContentCommand",
	"postCreateCommand",
	"postStartCommand",
	"containerEnv",
	"secrets",
	"remoteEnv",
	"name",
	"$schema"
]);
const enableCorepack = "mkdir -p \"$HOME/.local/bin\" && corepack enable --install-directory \"$HOME/.local/bin\" && PATH=\"$HOME/.local/bin:$PATH\"";
function parseDevcontainer(entry, file) {
	if (entry.content === void 0) throw new Error(`Cannot read committed cloud environment file ${file}`);
	const parsed = Devcontainer.safeParse(JSON5.parse(entry.content));
	if (!parsed.success) throw new Error(`Invalid cloud environment file ${file}: ${parsed.error.message}`);
	const config = parsed.data;
	const ignored = Object.keys(config).filter((property) => !supportedProperties.has(property)).toSorted();
	return {
		source: "devcontainer",
		identity: entry.blob,
		inputs: { [file]: entry.blob },
		env: {
			...config.containerEnv,
			...config.remoteEnv
		},
		secretNames: Object.keys(config.secrets ?? {}).toSorted(),
		...ignored.length ? { ignoredPropertiesNote: `devcontainer ${ignored.join(", ")} ignored on cloud machines` } : {},
		...config.onCreateCommand !== void 0 ? { onCreate: config.onCreateCommand } : {},
		...config.updateContentCommand !== void 0 ? { updateContent: config.updateContentCommand } : {},
		...config.postCreateCommand !== void 0 ? { postCreate: config.postCreateCommand } : {},
		...config.postStartCommand !== void 0 ? { postStart: config.postStartCommand } : {}
	};
}
/** Repository declarations request operator-approved names, never grant secret access. */
function assertEnvironmentRecipeSecretsMapped(recipe, setupSecrets) {
	const missing = recipe?.secretNames?.filter((name) => !isRecord(setupSecrets) || !Object.hasOwn(setupSecrets, name));
	if (missing?.length) throw new Error(`Cloud environment requests unmapped setup secrets: ${missing.join(", ")}. Configure these names in the profile's settings.setupSecrets with protected store SecretRefs and allowed hosts before starting a session.`);
}
function yarnMajor(packageEntry) {
	if (!packageEntry?.content) return;
	try {
		const value = JSON.parse(packageEntry.content);
		const parsed = object({ packageManager: string().optional() }).safeParse(value);
		const match = parsed.success ? parsed.data.packageManager?.match(/^yarn@(\d+)(?:[.+-]|$)/u) : null;
		return match ? Number(match[1]) : void 0;
	} catch {
		return;
	}
}
/** Only committed inputs participate; uncommitted setup never enters a shared image. */
async function resolveEnvironmentRecipe(readEntry) {
	for (const file of [".devcontainer/devcontainer.json", ".devcontainer.json"]) {
		const entry = await readEntry(file);
		if (entry) return parseDevcontainer(entry, file);
	}
	const scriptFile = ".openclaw/worktree-setup.sh";
	const script = await readEntry(scriptFile);
	if (script?.executable) return {
		source: "script",
		identity: script.blob,
		inputs: { [scriptFile]: script.blob },
		env: {},
		onCreate: ["./.openclaw/worktree-setup.sh"]
	};
	for (const file of [
		"pnpm-lock.yaml",
		"yarn.lock",
		"package-lock.json",
		"bun.lock",
		"bun.lockb"
	]) {
		const lockfile = await readEntry(file);
		if (!lockfile) continue;
		const inputs = { [file]: lockfile.blob };
		const packageEntry = await readEntry("package.json");
		if (packageEntry) inputs["package.json"] = packageEntry.blob;
		let detectedInstall;
		if (file === "pnpm-lock.yaml") detectedInstall = `${enableCorepack} pnpm install --frozen-lockfile`;
		else if (file === "yarn.lock") {
			const yarnConfig = await readEntry(".yarnrc.yml");
			if (yarnConfig) inputs[".yarnrc.yml"] = yarnConfig.blob;
			const major = yarnMajor(packageEntry);
			detectedInstall = `${enableCorepack} yarn install ${(major !== void 0 ? major >= 2 : yarnConfig !== void 0) ? "--immutable" : "--frozen-lockfile"}`;
		} else if (file === "package-lock.json") detectedInstall = ["npm", "ci"];
		else detectedInstall = "if command -v bun >/dev/null 2>&1; then bun install --frozen-lockfile; else printf \"%s\\n\" \"OpenClaw: bun install skipped because bun is not on PATH\" >&2; fi";
		return {
			source: "detected",
			identity: createHash("sha256").update(JSON.stringify({
				version: 2,
				inputs: Object.entries(inputs).toSorted(([left], [right]) => left.localeCompare(right, "en"))
			})).digest("hex"),
			inputs,
			env: file === "pnpm-lock.yaml" || file === "yarn.lock" ? {
				COREPACK_ENABLE_AUTO_PIN: "0",
				COREPACK_ENABLE_DOWNLOAD_PROMPT: "0"
			} : {},
			detectedInstall
		};
	}
	return {
		source: "none",
		inputs: {},
		env: {}
	};
}
//#endregion
//#region src/gateway/worker-environments/preparation-identity.schema.ts
const Digest = string().regex(/^[a-f0-9]{64}$/u);
const WorkerPreparationArtifactsSchema = object({
	nodeBootstrapSha256: Digest,
	enabledPluginIds: array(string().min(1).max(256)).max(256),
	workerBundleHash: Digest,
	workerArchiveSha256: Digest,
	openclawVersion: string().min(1).max(128),
	protocolFeatures: array(string().min(1).max(128)).max(64)
}).strict();
const WorkerPreparationTargetSchema = object({
	machineClass: string().min(1).max(256),
	platform: string().min(1).max(64),
	arch: string().min(1).max(64).optional(),
	profileKey: Digest.optional()
}).strict();
const Preparation = object({
	key: Digest,
	cacheKey: Digest,
	contractVersion: union([literal(1), literal(2)]),
	setupRecipe: string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u).optional(),
	runSetupScript: boolean().optional(),
	recipe: EnvironmentRecipeSchema.optional(),
	target: WorkerPreparationTargetSchema,
	artifacts: WorkerPreparationArtifactsSchema
}).strict();
const EmptyPreparation = Preparation.omit({
	setupRecipe: true,
	runSetupScript: true,
	recipe: true
}).extend({ source: literal("empty") });
/** Immutable artifact facts are separate from the reserve's demand/expiry/consumption tuple. */
function readWorkerProjectPreparation(project) {
	if (!isRecord(project) || project.preparation === void 0) return;
	const parsed = Preparation.safeParse(project.preparation);
	if (!parsed.success) throw new Error("Worker project preparation identity is invalid");
	return parsed.data;
}
function readWorkerPreparation(profile) {
	if (profile.runtimePreparation === void 0) return readWorkerProjectPreparation(profile.project);
	const parsed = EmptyPreparation.safeParse(profile.runtimePreparation);
	if (!parsed.success || profile.project !== void 0) throw new Error("Worker runtime preparation identity is invalid");
	return parsed.data;
}
function workerPreparationSourceKey(profile) {
	if (profile.runtimePreparation !== void 0) {
		readWorkerPreparation(profile);
		return "empty";
	}
	return isRecord(profile.project) ? Digest.parse(profile.project.key) : void 0;
}
//#endregion
export { assertEnvironmentRecipeSecretsMapped as a, workerPreparationSourceKey as i, readWorkerPreparation as n, resolveEnvironmentRecipe as o, readWorkerProjectPreparation as r, WorkerPreparationTargetSchema as t };
