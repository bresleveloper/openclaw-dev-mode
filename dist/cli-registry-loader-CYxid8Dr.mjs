import { a as addTimerTimeoutGraceMs } from "./number-coercion-CLj0HTDM.mjs";
import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as getCliPluginInvocationResources } from "./runtime-cleanup-scope-C0g6_AIJ.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { r as getCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { c as collectUniqueCommandDescriptors } from "./manifest-DHkEL08H.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-CYA0dErq.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-KhFe5dXK.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-CtJXavAS.mjs";
import { f as normalizeOperatorScopeList } from "./operator-scopes-D-CL26h0.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CpKxe5XX.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-XbrcYJWd.mjs";
import { n as createPluginRuntimeLoaderLogger, t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { n as loadOpenClawPluginCliRegistry, r as loadPluginRegistryHandle } from "./loader-Vq3hhSQk.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-DBcPAExA.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/cli-gateway-nodes-runtime.ts
/** Provides plugin CLI node APIs by forwarding calls to the Gateway. */
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-bfuNQIMk.mjs"));
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
				logger: params.logger ?? createPluginCliLogger()
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
/** Creates the default plugin CLI logger shared with runtime loading. */
function createPluginCliLogger() {
	return createPluginRuntimeLoaderLogger();
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
function listPluginCliRootOwnerIds(registry, primaryCommand) {
	const normalizedPrimary = normalizeLowercaseStringOrEmpty(primaryCommand);
	if (!normalizedPrimary) return [];
	return uniqueStrings(registry.cliRegistrars.filter((entry) => {
		const parentPath = entry.parentPath ?? [];
		return (parentPath.length > 0 ? [parentPath[0]] : [...entry.commands, ...entry.descriptors.map((descriptor) => descriptor.name)]).includes(normalizedPrimary);
	}).map((entry) => entry.pluginId));
}
async function resolvePrimaryCommandPluginIds(prepared, primaryCommand, loaderOptions) {
	prepared.assertCurrent();
	const { context } = prepared;
	const normalizedPrimary = normalizeLowercaseStringOrEmpty(primaryCommand);
	if (!normalizedPrimary) return;
	const manifestPluginIds = resolvePrimaryCommandManifestPluginIds(context, normalizedPrimary);
	if (manifestPluginIds && manifestPluginIds.length > 0) return manifestPluginIds;
	const registry = await loadPluginCliMetadataRegistryWithContext(prepared, { primaryCommand: normalizedPrimary }, loaderOptions);
	prepared.assertCurrent();
	return listPluginCliRootOwnerIds(registry, normalizedPrimary);
}
async function loadPluginCliMetadataRegistryWithContext(prepared, params, loaderOptions) {
	const onlyPluginIds = resolvePrimaryCommandManifestPluginIds(prepared.context, params?.primaryCommand);
	prepared.assertCurrent();
	const registry = await (prepared.metadataRegistry ??= prepared.withCache(() => loadOpenClawPluginCliRegistry(buildPluginRuntimeLoadOptions(prepared.context, {
		...loaderOptions,
		cache: false,
		...onlyPluginIds && onlyPluginIds.length > 0 ? { onlyPluginIds } : {}
	}))));
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
function buildPluginCliCommandGroupEntries(params) {
	return params.registry.cliRegistrars.map((entry) => ({
		pluginId: entry.pluginId,
		parentPath: entry.parentPath ?? [],
		placeholders: entry.descriptors,
		names: entry.commands,
		register: async (program) => {
			params.assertCurrent();
			const register = () => params.withCache(() => entry.register({
				program,
				parentPath: entry.parentPath ?? [],
				config: params.config,
				workspaceDir: params.workspaceDir,
				logger: params.logger
			}));
			await (params.resources ? params.resources.run(register) : register());
			params.assertCurrent();
		}
	}));
}
async function loadPluginCliDescriptors(params) {
	try {
		const registry = await loadPluginCliMetadataRegistryWithContext(resolvePreparedPluginCliLoad(params), { primaryCommand: params.primaryCommand }, params.loaderOptions);
		return collectUniqueCommandDescriptors(registry.cliRegistrars.filter((entry) => (entry.parentPath ?? []).length === 0).map((entry) => entry.descriptors));
	} catch (error) {
		log.warn(`plugin CLI descriptor load failed: ${String(error)}`);
		return [];
	}
}
async function loadPluginCliRegistrationEntriesWithDefaults(params) {
	const prepared = resolvePreparedPluginCliLoad(params);
	const entries = await (prepared.entries ??= loadPluginCliCommandRegistryWithContext({
		prepared,
		primaryCommand: params.primaryCommand,
		loaderOptions: params.loaderOptions
	}).then((registry) => {
		prepared.assertCurrent();
		return buildPluginCliCommandGroupEntries({
			...prepared.context,
			registry,
			assertCurrent: prepared.assertCurrent,
			withCache: prepared.withCache,
			resources: prepared.resources
		});
	}));
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
export { resolvePluginCliRootOwnerIds as a, loadPluginCliRegistrationEntriesWithDefaults as i, createPluginCliLogger as n, loadPluginCliDescriptors as r, createPluginCliLoadSession as t };
