import { h as resolveDefaultSecretProviderAlias } from "./ref-contract-Bfd9_-Lp.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DOYceNvb.mjs";
import { i as setPathExistingStrict, n as getPath } from "./path-utils-aDSU1mEq.mjs";
import "./target-registry-CSb4wosA.mjs";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-zYfMjC8g.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-e2Ic4b-n.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { t as classifyConfigSecretTarget } from "./config-secret-target-C-POk-vR.mjs";
import { randomBytes } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/channels/plugin-config-persistence.ts
async function persistChannelPluginConfig(params) {
	const { setup } = params;
	let sourceConfig = params.cfg;
	const storedNames = [];
	try {
		if (setup) {
			for (const target of discoverConfigSecretTargets(sourceConfig)) {
				if (target.pathSegments[0] !== "channels" || target.entry.secretShape !== "secret_input" || isDeepStrictEqual(target.value, getPath(setup.previousConfig, target.pathSegments)) || !classifyConfigSecretTarget(sourceConfig, target).plaintext) continue;
				const name = `CHANNEL_SETUP_${randomBytes(16).toString("hex").toUpperCase()}`;
				const value = typeof target.value === "string" ? target.value : JSON.stringify(target.value);
				await setup.beforePersistentEffect?.();
				await runWithLocalStateOwner({
					method: "secrets.store.set",
					params: {
						name,
						value,
						kind: "secret"
					},
					target: target.path,
					assertTargetCurrent: setup.assertCurrent,
					runLocal: async ({ env, assertCurrent }) => {
						const { writeSecretStoreEntry } = await import("./secret-store-DgsUJeG_.mjs");
						await writeSecretStoreEntry({
							scope: { kind: "team" },
							name,
							value,
							kind: "secret",
							updatedBy: "channel-setup",
							database: { env },
							assertCurrent
						});
					}
				});
				storedNames.push(name);
				if (sourceConfig === params.cfg) sourceConfig = structuredClone(sourceConfig);
				setPathExistingStrict(sourceConfig, target.pathSegments, {
					source: "store",
					provider: resolveDefaultSecretProviderAlias(sourceConfig, "store", { preferFirstProviderForSource: true }),
					id: name
				});
			}
			await setup.beforePersistentEffect?.();
			setup.assertCurrent?.();
		}
		const committed = await commitConfigWithPendingPluginInstalls({
			sourceConfig,
			baseHash: params.baseHash,
			writeOptions: params.writeOptions
		});
		if (committed.movedInstallRecords || params.pluginInstalled) await refreshPluginRegistryAfterConfigMutation({
			reason: "source-changed",
			logger: { warn: (message) => params.runtime.log(message) }
		});
		return committed;
	} catch (error) {
		if (storedNames.length > 0) params.runtime.log(`Channel setup did not complete. Protected credentials remain in the secret store: ${storedNames.join(", ")}. Inspect the config before retrying or removing unused entries.`);
		throw error;
	}
}
//#endregion
export { persistChannelPluginConfig as t };
