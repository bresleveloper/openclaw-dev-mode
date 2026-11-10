import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-CkhMiRw8.mjs";
import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { m as collectUniqueCommandDescriptors } from "./manifest-gUPkNRN0.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-mS6HujHb.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-DDlhnyCt.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-DZuGS_2S.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-d5S6zg8U.mjs";
import { p as normalizeOperatorScopeList } from "./operator-scopes-BO7_XQCg.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-vHcoMR69.mjs";
import "./config-B3oiWDlr.mjs";
import { t as getCliPluginInvocationResources } from "./runtime-cleanup-scope-Dv2f28xK.mjs";
import { n as buildPluginRuntimeLoadOptions, r as createPluginRuntimeLoaderLogger } from "./load-context-YqkPeFye.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-DzFljQbT.mjs";
import { n as loadPluginRegistryHandle, t as loadOpenClawPluginCliRegistry } from "./loader-B8PRFJEU.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-BVnuTwnE.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/cli-gateway-nodes-runtime.ts
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-BvbeEASg.mjs"));
function createPluginCliGatewayNodesRuntime() {
	return {
		async list(params) {
			const { callGateway } = await gatewayCallModuleLoader.load();
			const payload = await callGateway({
				method: "node.list",
				params: {},
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI
			});
			const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
			return { nodes: params?.connected === true ? nodes.filter((node) => node !== null && typeof node === "object" && node.connected === true) : nodes };
		},
		async invoke(params) {
			const { callGateway } = await gatewayCallModuleLoader.load();
			const normalizedScopes = normalizeOperatorScopeList(params.scopes);
			const scope = normalizedScopes ? getPluginRuntimeGatewayRequestScope() : void 0;
			const scopes = scope?.pluginId && (scope.pluginOrigin === "bundled" || scope.pluginTrustedOfficialInstall === true) ? normalizedScopes : void 0;
			return await callGateway({
				method: "node.invoke",
				params: {
					nodeId: params.nodeId,
					command: params.command,
					...params.params !== void 0 && { params: params.params },
					timeoutMs: params.timeoutMs,
					idempotencyKey: params.idempotencyKey || randomUUID(),
					...params.sessionKey ? { sessionKey: params.sessionKey } : {}
				},
				timeoutMs: typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? addTimerTimeoutGraceMs(params.timeoutMs) : void 0,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI,
				...scopes ? { scopes } : {},
				...params.signal ? { signal: params.signal } : {}
			});
		},
		async openDuplex() {
			throw new Error("Node duplex is unavailable in the CLI; run this plugin inside the Gateway.");
		}
	};
}
//#endregion
//#region src/plugins/cli-registry-loader.ts
/** Loads plugin CLI registrations lazily for the command tree and plugin-owned subcommands. */
const log = createSubsystemLogger("plugins/cli-registry-loader");
/** Invocation authority closes before actions; its package generation lives through them. */
function createPluginCliLoadSession(cache = createPluginCache(), ownership = { resources: getCliPluginInvocationResources() }) {
	const { resources } = ownership;
	const withCache = (run) => withPluginCache(cache, run);
	let closed = false;
	let current;
	const assertOpen = () => {
		if (closed) throw new Error("Plugin CLI preparation is closed; start a new registration operation.");
	};
	return {
		resources,
		withCache,
		readConfig: async (read) => {
			assertOpen();
			const result = await withCache(read);
			assertOpen();
			return result;
		},
		close: () => {
			closed = true;
			current = void 0;
		},
		resolve: (params) => withCache(() => {
			assertOpen();
			const config = params.cfg ?? readRuntimeConfig();
			const activationSourceConfig = resolvePluginActivationSourceConfig({ config });
			const env = params.env ?? process.env;
			const key = stableStringify([
				config,
				activationSourceConfig,
				env,
				resolvePluginControlPlaneWorkspace({
					config,
					env
				}),
				resolvePluginMetadataEnvFingerprint(env),
				resolveStateDir(env),
				params.primaryCommand
			]);
			const sdk = params.loaderOptions?.pluginSdkResolution;
			if (current?.key === key && current.logger === params.logger && current.env === env && current.sdk === sdk && current.prepared.context.rawConfig === config && current.prepared.context.activationSourceConfig === activationSourceConfig) return current.prepared;
			const preparedEnv = cloneEnvWithPlatformSemantics(env);
			const { workspaceDir } = resolvePluginControlPlaneWorkspace({
				config,
				env: preparedEnv
			});
			const metadataSnapshot = resolvePluginMetadataSnapshot({
				config,
				env: preparedEnv,
				workspaceDir,
				allowCurrent: false
			});
			const prepared = {
				context: resolvePluginRuntimeLoadContext({
					config,
					activationSourceConfig,
					env: preparedEnv,
					workspaceDir,
					metadataSnapshot,
					logger: params.logger ?? createPluginRuntimeLoaderLogger()
				}),
				withCache,
				resources,
				assertCurrent: assertOpen
			};
			current = {
				key,
				sdk,
				logger: params.logger,
				env,
				prepared
			};
			return prepared;
		})
	};
}
function resolvePreparedPluginCliLoad(params) {
	return (params.session ?? createPluginCliLoadSession()).resolve(params);
}
function resolvePrimaryCommandManifestPluginIds(context, primaryCommand) {
	const normalizedPrimary = normalizeLowercaseStringOrEmpty(primaryCommand);
	if (!normalizedPrimary) return;
	return resolveManifestActivationPluginIds({
		trigger: {
			kind: "command",
			command: normalizedPrimary
		},
		config: context.activationSourceConfig,
		workspaceDir: context.workspaceDir,
		env: context.env,
		manifestRecords: context.manifestRegistry?.plugins
	});
}
function pluginCliRegistrarOwnsRoot(entry, primaryCommand) {
	const parentPath = entry.parentPath ?? [];
	return (parentPath.length > 0 ? [parentPath[0]] : [...entry.commands, ...entry.descriptors.map((descriptor) => descriptor.name)]).includes(primaryCommand);
}
async function resolvePrimaryCommandPluginIds(prepared, primaryCommand, loaderOptions) {
	const { context } = prepared;
	const normalizedPrimary = normalizeLowercaseStringOrEmpty(primaryCommand);
	if (!normalizedPrimary) return;
	const manifestPluginIds = resolvePrimaryCommandManifestPluginIds(context, normalizedPrimary);
	if (manifestPluginIds && manifestPluginIds.length > 0) return manifestPluginIds;
	const registry = await loadPluginCliMetadataRegistryWithContext(prepared, normalizedPrimary, loaderOptions);
	return uniqueStrings(registry.cliRegistrars.filter((entry) => pluginCliRegistrarOwnsRoot(entry, normalizedPrimary)).map((entry) => entry.pluginId));
}
async function loadPluginCliMetadataRegistryWithContext(prepared, primaryCommand, loaderOptions) {
	const onlyPluginIds = resolvePrimaryCommandManifestPluginIds(prepared.context, primaryCommand);
	prepared.assertCurrent();
	return await (prepared.metadataRegistry ??= prepared.withCache(() => {
		const options = buildPluginRuntimeLoadOptions(prepared.context, {
			...loaderOptions,
			cache: false,
			...onlyPluginIds && onlyPluginIds.length > 0 ? { onlyPluginIds } : {}
		});
		return prepared.resources ? prepared.resources.acquire(() => acquirePluginRegistryForInspection({
			...options,
			mode: "cli-metadata"
		})) : loadOpenClawPluginCliRegistry(options);
	}));
}
async function loadPluginCliCommandRegistryWithContext(params) {
	const { context } = params.prepared;
	let onlyPluginIds;
	try {
		onlyPluginIds = await resolvePrimaryCommandPluginIds(params.prepared, params.primaryCommand, params.loaderOptions);
	} catch {
		onlyPluginIds = resolvePrimaryCommandManifestPluginIds(context, params.primaryCommand);
	}
	params.prepared.assertCurrent();
	if (onlyPluginIds && onlyPluginIds.length === 0) return createEmptyPluginRegistry();
	const options = buildPluginRuntimeLoadOptions(context, {
		...params.loaderOptions,
		...onlyPluginIds && onlyPluginIds.length > 0 ? { onlyPluginIds } : {},
		cache: false,
		channelPluginLoadIntent: "full",
		runtimeOptions: { nodes: createPluginCliGatewayNodesRuntime() }
	});
	const resources = params.prepared.resources;
	return params.prepared.withCache(() => resources ? resources.acquire(() => acquirePluginRegistryForInspection(options)) : loadPluginRegistryHandle(options));
}
async function loadPluginCliDescriptors(params) {
	try {
		const registry = await loadPluginCliMetadataRegistryWithContext(resolvePreparedPluginCliLoad(params), params.primaryCommand, params.loaderOptions);
		return collectUniqueCommandDescriptors(registry.cliRegistrars.filter((entry) => (entry.parentPath ?? []).length === 0).map((entry) => entry.descriptors));
	} catch (error) {
		log.warn(`plugin CLI descriptor load failed: ${String(error)}`);
		return [];
	}
}
async function loadPluginCliRegistrationEntriesWithDefaults(params, mode = "runtime") {
	const prepared = resolvePreparedPluginCliLoad(params);
	const buildEntries = (registry) => {
		const primary = mode === "metadata" && normalizeLowercaseStringOrEmpty(params.primaryCommand);
		const registrars = primary ? registry.cliRegistrars.filter((entry) => pluginCliRegistrarOwnsRoot(entry, primary)) : registry.cliRegistrars;
		const { config, workspaceDir, logger } = prepared.context;
		return registrars.map((entry) => ({
			pluginId: entry.pluginId,
			parentPath: entry.parentPath ?? [],
			placeholders: entry.descriptors,
			names: entry.commands,
			register: async (program) => {
				prepared.assertCurrent();
				const register = () => prepared.withCache(() => entry.register({
					program,
					parentPath: entry.parentPath ?? [],
					config,
					workspaceDir,
					logger
				}));
				await (prepared.resources ? prepared.resources.run(register) : register());
			}
		}));
	};
	return mode === "metadata" ? buildEntries(await loadPluginCliMetadataRegistryWithContext(prepared, params.primaryCommand, params.loaderOptions)) : await (prepared.entries ??= loadPluginCliCommandRegistryWithContext({
		prepared,
		primaryCommand: params.primaryCommand,
		loaderOptions: params.loaderOptions
	}).then(buildEntries));
}
async function resolvePluginCliRootOwnerIds(params) {
	const primaryCommand = normalizeLowercaseStringOrEmpty(params.primaryCommand);
	if (!primaryCommand) return null;
	return await resolvePrimaryCommandPluginIds(resolvePreparedPluginCliLoad(params), primaryCommand, params.loaderOptions) ?? null;
}
//#endregion
export { resolvePluginCliRootOwnerIds as i, loadPluginCliDescriptors as n, loadPluginCliRegistrationEntriesWithDefaults as r, createPluginCliLoadSession as t };
