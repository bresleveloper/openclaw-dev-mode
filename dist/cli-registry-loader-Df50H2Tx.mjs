import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-CuVhdCBs.mjs";
import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as getCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { c as collectUniqueCommandDescriptors } from "./manifest-BXjFCp0F.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-BPH6mLZF.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-BSuk9I48.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-C14NFDc3.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-D0pq-oeY.mjs";
import { p as normalizeOperatorScopeList } from "./operator-scopes-DsrPoRc4.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-Dz1QBmPR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { n as buildPluginRuntimeLoadOptions, r as createPluginRuntimeLoaderLogger } from "./load-context-Bf_u2yr8.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-C3He8u8Z.mjs";
import { t as getCliPluginInvocationResources } from "./runtime-cleanup-scope-BktLDe8P.mjs";
import { n as loadPluginRegistryHandle, t as loadOpenClawPluginCliRegistry } from "./loader-vjZ2aI5b.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-CXTPIuAJ.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/cli-gateway-nodes-runtime.ts
/** Provides plugin CLI node APIs by forwarding calls to the Gateway. */
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-CWvmXO5x.mjs"));
/** Adds Gateway timer grace for plugin CLI node invoke calls. */
function resolvePluginCliNodeInvokeGatewayTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? addTimerTimeoutGraceMs(timeoutMs) : void 0;
}
function canPluginCliRuntimeRequestScopes() {
	const scope = getPluginRuntimeGatewayRequestScope();
	return Boolean(scope?.pluginId && (scope.pluginOrigin === "bundled" || scope.pluginTrustedOfficialInstall === true));
}
function resolvePluginCliRuntimeNodeInvokeScopes(scopes) {
	const normalizedScopes = normalizeOperatorScopeList(scopes);
	return normalizedScopes && canPluginCliRuntimeRequestScopes() ? normalizedScopes : void 0;
}
/** Creates the `runtime.nodes` implementation exposed to CLI plugin code. */
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
			const scopes = resolvePluginCliRuntimeNodeInvokeScopes(params.scopes);
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
				timeoutMs: resolvePluginCliNodeInvokeGatewayTimeoutMs(params.timeoutMs),
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
	let revision = getCurrentPluginMetadataSnapshotState().revision;
	let current;
	const assertOpen = () => {
		if (closed) throw new Error("Plugin CLI preparation is closed; start a new registration operation.");
	};
	const refreshRevision = () => {
		assertOpen();
		const next = getCurrentPluginMetadataSnapshotState().revision;
		if (next !== revision) {
			revision = next;
			current = void 0;
		}
	};
	const assertRevision = (captured) => {
		assertOpen();
		if (captured !== getCurrentPluginMetadataSnapshotState().revision) throw new Error("Plugin CLI preparation was invalidated; start a new registration operation.");
	};
	return {
		resources,
		withCache,
		readConfig: async (read) => {
			refreshRevision();
			const captured = revision;
			const result = await withCache(read);
			assertRevision(captured);
			return result;
		},
		close: () => {
			closed = true;
			current = void 0;
		},
		resolve: (params) => withCache(() => {
			refreshRevision();
			const config = params.cfg ?? getRuntimeConfig();
			const activationSourceConfig = resolvePluginActivationSourceConfig({ config });
			const env = params.env ?? process.env;
			const inputKey = () => stableStringify([
				config,
				resolvePluginActivationSourceConfig({ config }),
				env,
				resolvePluginControlPlaneWorkspace({
					config,
					env
				}),
				resolvePluginMetadataEnvFingerprint(env),
				resolveStateDir(env),
				params.primaryCommand
			]);
			const key = inputKey();
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
			const context = resolvePluginRuntimeLoadContext({
				config,
				activationSourceConfig,
				env: preparedEnv,
				workspaceDir,
				metadataSnapshot,
				logger: params.logger ?? createPluginRuntimeLoaderLogger()
			});
			const captured = revision;
			const prepared = {
				context,
				withCache,
				resources,
				assertCurrent() {
					assertRevision(captured);
					if (current?.prepared !== prepared || key !== inputKey() || params.cfg !== void 0 && params.cfg !== config || (params.env ?? process.env) !== env || activationSourceConfig !== resolvePluginActivationSourceConfig({ config }) || current.sdk !== params.loaderOptions?.pluginSdkResolution || current.logger !== params.logger) throw new Error("Plugin CLI preparation inputs changed; start a new registration operation.");
				}
			};
			current = {
				key,
				sdk,
				logger: params.logger,
				env,
				prepared
			};
			prepared.assertCurrent();
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
	prepared.assertCurrent();
	const { context } = prepared;
	const normalizedPrimary = normalizeLowercaseStringOrEmpty(primaryCommand);
	if (!normalizedPrimary) return;
	const manifestPluginIds = resolvePrimaryCommandManifestPluginIds(context, normalizedPrimary);
	if (manifestPluginIds && manifestPluginIds.length > 0) return manifestPluginIds;
	const registry = await loadPluginCliMetadataRegistryWithContext(prepared, normalizedPrimary, loaderOptions);
	prepared.assertCurrent();
	return uniqueStrings(registry.cliRegistrars.filter((entry) => pluginCliRegistrarOwnsRoot(entry, normalizedPrimary)).map((entry) => entry.pluginId));
}
async function loadPluginCliMetadataRegistryWithContext(prepared, primaryCommand, loaderOptions) {
	const onlyPluginIds = resolvePrimaryCommandManifestPluginIds(prepared.context, primaryCommand);
	prepared.assertCurrent();
	const registry = await (prepared.metadataRegistry ??= prepared.withCache(() => {
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
	prepared.assertCurrent();
	return registry;
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
		prepared.assertCurrent();
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
				prepared.assertCurrent();
			}
		}));
	};
	const entries = mode === "metadata" ? buildEntries(await loadPluginCliMetadataRegistryWithContext(prepared, params.primaryCommand, params.loaderOptions)) : await (prepared.entries ??= loadPluginCliCommandRegistryWithContext({
		prepared,
		primaryCommand: params.primaryCommand,
		loaderOptions: params.loaderOptions
	}).then(buildEntries));
	prepared.assertCurrent();
	return entries;
}
async function resolvePluginCliRootOwnerIds(params) {
	const primaryCommand = normalizeLowercaseStringOrEmpty(params.primaryCommand);
	if (!primaryCommand) return null;
	const prepared = resolvePreparedPluginCliLoad(params);
	const ownerIds = await resolvePrimaryCommandPluginIds(prepared, primaryCommand, params.loaderOptions);
	prepared.assertCurrent();
	return ownerIds ?? null;
}
//#endregion
export { resolvePluginCliRootOwnerIds as i, loadPluginCliDescriptors as n, loadPluginCliRegistrationEntriesWithDefaults as r, createPluginCliLoadSession as t };
