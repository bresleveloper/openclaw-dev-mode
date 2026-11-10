import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as redactSensitiveArgv } from "./redact-argv-CWtUb9xr.mjs";
import { r as normalizeConfiguredMcpServers, t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-BD-xidlv.mjs";
import { i as validateConfigObjectWithPlugins } from "./validation-gzn6Bd6i.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { r as restoreRedactedValues, t as redactConfigObject } from "./redact-snapshot-D_TnZpW0.mjs";
import { g as readSourceConfigSnapshotForWrite, h as readSourceConfigSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import { t as buildConfigSchemaCore } from "./schema-r6axo63S.mjs";
//#region src/state/claw-mcp-adoption.ts
/** Records an explicit non-Claw claim through the canonical MCP owner. */
async function markClawMcpServerIndependentlyOwned(name, options = {}) {
	try {
		return await runOpenClawStateWorkerOperation(captureOpenClawStateWorkerContext(options), (scope) => scope.execute({
			type: "clawAdoption.mcp",
			input: {
				name,
				nowMs: options.nowMs ?? Date.now()
			}
		}), { existingOnly: true }) ?? 0;
	} catch {
		return 0;
	}
}
//#endregion
//#region src/config/mcp-config.ts
function normalizeToolSelectionList(value) {
	if (!value) return;
	const normalized = Array.from(new Set(value.map((entry) => entry.trim()).filter((entry) => entry.length > 0))).toSorted((a, b) => a.localeCompare(b));
	return normalized.length > 0 ? normalized : void 0;
}
function restoreMcpServerArgvSentinels(params) {
	const incomingArgs = params.incoming.args;
	if (!Array.isArray(incomingArgs)) return {
		ok: true,
		server: params.incoming
	};
	if (!incomingArgs.some((arg) => typeof arg === "string" && arg.includes("__OPENCLAW_REDACTED__"))) return {
		ok: true,
		server: params.incoming
	};
	const originalArgs = params.original?.args;
	if (!Array.isArray(originalArgs) || !originalArgs.every((arg) => typeof arg === "string") || incomingArgs.length !== originalArgs.length) return {
		ok: false,
		error: `Cannot restore MCP args containing "${REDACTED_SENTINEL}" without the same original argv shape.`
	};
	const displayedArgs = redactSensitiveArgv(originalArgs, REDACTED_SENTINEL);
	if (incomingArgs.some((arg, index) => arg !== displayedArgs[index])) return {
		ok: false,
		error: `Cannot restore MCP args containing "${REDACTED_SENTINEL}" after argv changed. Replace every redacted value explicitly before editing args.`
	};
	return {
		ok: true,
		server: {
			...params.incoming,
			args: originalArgs
		}
	};
}
function resolveConfiguredMcpServers(snapshot) {
	if (!snapshot.valid) return {
		ok: false,
		path: snapshot.path,
		error: "Config file is invalid; fix it before using MCP config commands."
	};
	const sourceConfig = snapshot.sourceConfig;
	return {
		ok: true,
		path: snapshot.path,
		config: structuredClone(sourceConfig),
		mcpServers: normalizeConfiguredMcpServers(sourceConfig.mcp?.servers),
		authoredConfig: snapshot.authoredConfig,
		runtimeConfig: snapshot.runtimeConfig,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
		baseHash: snapshot.hash
	};
}
function redactMcpServerArgsForDisplay(server) {
	if (!isRecord(server)) return server;
	if (!Array.isArray(server.args) || !server.args.every((arg) => typeof arg === "string")) return server;
	return {
		...server,
		args: redactSensitiveArgv(server.args, REDACTED_SENTINEL)
	};
}
/** Redact MCP server secrets before CLI or chat display. */
function redactMcpServersForDisplay(servers) {
	const argvRedacted = Object.fromEntries(Object.entries(servers).map(([name, server]) => [name, redactMcpServerArgsForDisplay(server)]));
	return redactConfigObject({ mcp: { servers: argvRedacted } }, buildConfigSchemaCore().uiHints).mcp.servers;
}
async function listConfiguredMcpServers() {
	return resolveConfiguredMcpServers(await readSourceConfigSnapshot());
}
async function commitConfiguredMcpServers(params) {
	const next = structuredClone(params.loaded.config);
	if (Object.keys(params.servers).length > 0) next.mcp = {
		...next.mcp,
		servers: params.servers
	};
	else if (next.mcp) {
		delete next.mcp.servers;
		if (Object.keys(next.mcp).length === 0) delete next.mcp;
	}
	const validated = validateConfigObjectWithPlugins(next);
	if (!validated.ok) {
		const issue = expectDefined(validated.issues[0], "issues entry at 0");
		return {
			ok: false,
			path: params.loaded.path,
			error: `Config invalid after MCP ${params.errorLabel} (${issue.path}: ${issue.message}).`
		};
	}
	const committed = await replaceConfigFile({
		sourceConfig: next,
		baseHash: params.loaded.baseHash,
		writeOptions: {
			...params.writeOptions,
			assertCurrent: () => {
				params.writeOptions.assertCurrent?.();
				params.assertCurrent?.();
			},
			beforeCommit: async () => {
				await params.writeOptions.beforeCommit?.();
				await params.assertCurrentAsync?.();
			}
		}
	});
	if (params.mutation?.onCommitted) {
		const previous = params.loaded.mcpServers[params.mutation.name];
		const nextServer = params.servers[params.mutation.name];
		await params.mutation.onCommitted({
			name: params.mutation.name,
			...previous ? { previous } : {},
			...nextServer ? { next: nextServer } : {}
		});
	}
	if (params.independentlyOwnedName) await markClawMcpServerIndependentlyOwned(params.independentlyOwnedName);
	return {
		ok: true,
		path: params.loaded.path,
		config: committed.nextConfig,
		mcpServers: params.servers,
		...params.success
	};
}
async function mutateConfiguredMcpServer(params, onCommitted) {
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	const { snapshot, writeOptions } = await readSourceConfigSnapshotForWrite();
	const loaded = resolveConfiguredMcpServers(snapshot);
	if (!loaded.ok) return loaded;
	const exists = Object.hasOwn(loaded.mcpServers, name);
	const successKey = params.kind === "unset" ? "removed" : "updated";
	if (params.kind !== "set" && !exists) {
		const { baseHash: _baseHash, ...unchanged } = loaded;
		return {
			...unchanged,
			[successKey]: false
		};
	}
	if (params.kind === "set" && params.createOnly && exists) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} already exists.`
	};
	const existingServer = loaded.mcpServers[name];
	if (params.kind !== "update" && params.expectedServer && (params.kind === "set" && (!exists || !existingServer) || existingServer && stableStringify(canonicalizeConfiguredMcpServer(existingServer)) !== stableStringify(canonicalizeConfiguredMcpServer(params.expectedServer)))) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} changed and was not ${successKey}.`
	};
	const servers = structuredClone(loaded.mcpServers);
	if (params.kind === "set") {
		const argvRestored = restoreMcpServerArgvSentinels({
			incoming: params.server,
			original: existingServer
		});
		if (!argvRestored.ok) return {
			ok: false,
			path: loaded.path,
			error: argvRestored.error
		};
		const restored = restoreRedactedValues({ mcp: { servers: { [name]: argvRestored.server } } }, { mcp: { servers: loaded.mcpServers } }, buildConfigSchemaCore().uiHints);
		if (!restored.ok) return {
			ok: false,
			path: loaded.path,
			error: restored.humanReadableMessage ?? "MCP server config contains an unrestorable redacted value."
		};
		const restoredServer = restored.result.mcp?.servers?.[name];
		if (!isRecord(restoredServer)) return {
			ok: false,
			path: loaded.path,
			error: "MCP server config must be a JSON object."
		};
		servers[name] = canonicalizeConfiguredMcpServer(restoredServer);
	} else if (params.kind === "unset") delete servers[name];
	else servers[name] = params.update({ ...servers[name] });
	return commitConfiguredMcpServers({
		loaded,
		writeOptions,
		servers,
		errorLabel: params.kind === "update" ? params.errorLabel : params.kind,
		success: params.kind === "set" ? void 0 : { [successKey]: true },
		independentlyOwnedName: params.kind === "unset" || params.recordIndependentOwner === false ? void 0 : name,
		assertCurrent: params.kind === "update" ? void 0 : params.assertCurrent,
		assertCurrentAsync: params.kind === "unset" ? params.assertCurrentAsync : void 0,
		mutation: {
			name,
			onCommitted
		}
	});
}
async function updateConfiguredMcpServerConfig(params) {
	return mutateConfiguredMcpServer({
		...params,
		kind: "update"
	}, params.onCommitted);
}
async function updateConfiguredMcpServerTools(params, onCommitted) {
	return updateConfiguredMcpServerConfig({
		name: params.name,
		recordIndependentOwner: params.recordIndependentOwner,
		errorLabel: "tool selection update",
		onCommitted,
		update: (server) => {
			if (params.tools === null) delete server.toolFilter;
			else {
				const include = normalizeToolSelectionList(params.tools.include);
				const exclude = normalizeToolSelectionList(params.tools.exclude);
				if (include || exclude) server.toolFilter = {
					...isRecord(server.toolFilter) ? server.toolFilter : {},
					...include ? { include } : {},
					...exclude ? { exclude } : {}
				};
				else delete server.toolFilter;
			}
			return server;
		}
	});
}
async function updateConfiguredMcpServer(params, onCommitted) {
	return updateConfiguredMcpServerConfig({
		name: params.name,
		recordIndependentOwner: params.recordIndependentOwner,
		errorLabel: "configure",
		onCommitted,
		update: (server) => canonicalizeConfiguredMcpServer(params.update(server))
	});
}
async function setConfiguredMcpServer(params, onCommitted) {
	if (!params.name.trim()) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	if (!isRecord(params.server)) return {
		ok: false,
		path: "",
		error: "MCP server config must be a JSON object."
	};
	return mutateConfiguredMcpServer({
		...params,
		kind: "set",
		server: params.server
	}, onCommitted);
}
async function unsetConfiguredMcpServer(params, onCommitted) {
	return mutateConfiguredMcpServer({
		...params,
		kind: "unset"
	}, onCommitted);
}
/** Low-level config writers; production mutations must use the agents-owned lifecycle facade. */
const mcpConfigInternal = {
	set: setConfiguredMcpServer,
	unset: unsetConfiguredMcpServer,
	update: updateConfiguredMcpServer,
	updateTools: updateConfiguredMcpServerTools
};
//#endregion
export { mcpConfigInternal as n, redactMcpServersForDisplay as r, listConfiguredMcpServers as t };
