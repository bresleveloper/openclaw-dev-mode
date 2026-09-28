import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import "./utils-aKqR_F_U.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { r as normalizeConfiguredMcpServers, t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as redactSensitiveArgv } from "./redact-argv-C8i2jYjd.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { r as restoreRedactedValues } from "./redact-snapshot-uX3ICFnt.mjs";
import { o as validateConfigObjectWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { g as readSourceConfigSnapshotForWrite, h as readSourceConfigSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { r as replaceConfigFile } from "./mutate-CdmDoEFy.mjs";
import { t as buildConfigSchemaCore } from "./schema-RpXu-eUV.mjs";
import { existsSync } from "node:fs";
//#region src/state/claw-mcp-adoption.ts
/** Records an explicit non-Claw claim through the canonical MCP owner. */
function markClawMcpServerIndependentlyOwned(name, options = {}) {
	const databasePath = options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env);
	if (!existsSync(databasePath)) return 0;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_mcp_server_refs").set({
				independent_owner: 1,
				updated_at_ms: options.nowMs ?? Date.now()
			}).where("name", "=", name).where("independent_owner", "!=", 1));
			return Number(result.numAffectedRows);
		}, options);
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
	const sourceConfig = snapshot.sourceConfig ?? snapshot.resolved;
	return {
		ok: true,
		path: snapshot.path,
		config: structuredClone(sourceConfig),
		mcpServers: normalizeConfiguredMcpServers(sourceConfig.mcp?.servers),
		baseHash: snapshot.hash
	};
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
	if (params.independentlyOwnedName) markClawMcpServerIndependentlyOwned(params.independentlyOwnedName);
	return {
		ok: true,
		path: params.loaded.path,
		config: committed.nextConfig,
		mcpServers: params.servers,
		...params.success
	};
}
async function updateConfiguredMcpServerConfig(params) {
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	const { snapshot, writeOptions } = await readSourceConfigSnapshotForWrite();
	const loaded = resolveConfiguredMcpServers(snapshot);
	if (!loaded.ok) return loaded;
	if (!Object.hasOwn(loaded.mcpServers, name)) {
		const { baseHash: _baseHash, ...unchanged } = loaded;
		return {
			...unchanged,
			updated: false
		};
	}
	const servers = normalizeConfiguredMcpServers(loaded.config.mcp?.servers);
	servers[name] = params.update({ ...servers[name] });
	return commitConfiguredMcpServers({
		loaded,
		writeOptions,
		servers,
		errorLabel: params.errorLabel,
		success: { updated: true },
		independentlyOwnedName: params.recordIndependentOwner === false ? void 0 : name,
		mutation: {
			name,
			onCommitted: params.onCommitted
		}
	});
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
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	if (!isRecord(params.server)) return {
		ok: false,
		path: "",
		error: "MCP server config must be a JSON object."
	};
	const { snapshot, writeOptions } = await readSourceConfigSnapshotForWrite();
	const loaded = resolveConfiguredMcpServers(snapshot);
	if (!loaded.ok) return loaded;
	if (params.createOnly && Object.hasOwn(loaded.mcpServers, name)) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} already exists.`
	};
	const existingServer = loaded.mcpServers[name];
	if (params.expectedServer && (!Object.hasOwn(loaded.mcpServers, name) || !existingServer || stableStringify(canonicalizeConfiguredMcpServer(existingServer)) !== stableStringify(canonicalizeConfiguredMcpServer(params.expectedServer)))) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} changed and was not updated.`
	};
	const argvRestored = restoreMcpServerArgvSentinels({
		incoming: params.server,
		original: loaded.mcpServers[name]
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
	const servers = normalizeConfiguredMcpServers(loaded.config.mcp?.servers);
	servers[name] = canonicalizeConfiguredMcpServer(restoredServer);
	return commitConfiguredMcpServers({
		loaded,
		writeOptions,
		servers,
		errorLabel: "set",
		independentlyOwnedName: params.recordIndependentOwner === false ? void 0 : name,
		assertCurrent: params.assertCurrent,
		mutation: {
			name,
			onCommitted
		}
	});
}
async function unsetConfiguredMcpServer(params, onCommitted) {
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	const { snapshot, writeOptions } = await readSourceConfigSnapshotForWrite();
	const loaded = resolveConfiguredMcpServers(snapshot);
	if (!loaded.ok) return loaded;
	if (!Object.hasOwn(loaded.mcpServers, name)) {
		const { baseHash: _baseHash, ...unchanged } = loaded;
		return {
			...unchanged,
			removed: false
		};
	}
	const loadedServer = loaded.mcpServers[name];
	if (params.expectedServer && loadedServer && stableStringify(canonicalizeConfiguredMcpServer(loadedServer)) !== stableStringify(canonicalizeConfiguredMcpServer(params.expectedServer))) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} changed and was not removed.`
	};
	const servers = normalizeConfiguredMcpServers(loaded.config.mcp?.servers);
	delete servers[name];
	return commitConfiguredMcpServers({
		loaded,
		writeOptions,
		servers,
		errorLabel: "unset",
		success: { removed: true },
		assertCurrent: params.assertCurrent,
		mutation: {
			name,
			onCommitted
		}
	});
}
/** Low-level config writers; production mutations must use the agents-owned lifecycle facade. */
const mcpConfigInternal = {
	set: setConfiguredMcpServer,
	unset: unsetConfiguredMcpServer,
	update: updateConfiguredMcpServer,
	updateTools: updateConfiguredMcpServerTools
};
//#endregion
export { mcpConfigInternal as n, listConfiguredMcpServers as t };
