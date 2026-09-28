import { o as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D1f0LUdT.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-DXvBb18D.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DLqBlq9x.mjs";
import { n as HostedCatalogSignedFeedMonotonicityError } from "./official-external-plugin-catalog-source-D_PnrId8.mjs";
import { existsSync } from "node:fs";
//#region src/plugins/official-external-plugin-catalog-snapshot-store.ts
/** Persists hosted official plugin catalog snapshots through the shared-state worker. */
function resolveDatabaseOptions(options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	if (options.stateDir) env.OPENCLAW_STATE_DIR = options.stateDir;
	return {
		env,
		path: options.stateDatabasePath || resolveOpenClawStateSqlitePath(env)
	};
}
function captureSnapshot(snapshot) {
	const { metadata, trust, monotonic } = snapshot;
	return {
		body: snapshot.body,
		metadata: {
			url: metadata.url,
			status: metadata.status,
			etag: metadata.etag,
			lastModified: metadata.lastModified,
			checksum: metadata.checksum
		},
		savedAt: snapshot.savedAt,
		...trust ? { trust: {
			mode: trust.mode,
			signedBy: trust.signedBy,
			signatureCount: trust.signatureCount,
			threshold: trust.threshold,
			verifiedAt: trust.verifiedAt
		} } : {},
		...monotonic ? { monotonic: {
			mode: monotonic.mode,
			sequence: monotonic.sequence,
			generatedAt: monotonic.generatedAt
		} } : {}
	};
}
/** Creates a snapshot store backed by the shared `state/openclaw.sqlite` database. */
function createSqliteHostedOfficialExternalPluginCatalogSnapshotStore(options = {}) {
	return {
		async read(url) {
			const databaseOptions = resolveDatabaseOptions(options);
			if (!existsSync(databaseOptions.path)) return null;
			const context = captureOpenClawStateWorkerContext(databaseOptions);
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-D687LGQf.mjs");
			return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "plugins.catalogSnapshot.read",
				input: { url }
			}), { existingOnly: true }) ?? null;
		},
		async write(snapshot) {
			const now = Date.now();
			const prepared = captureSnapshot(snapshot);
			const context = captureOpenClawStateWorkerContext(resolveDatabaseOptions(options));
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-D687LGQf.mjs");
			const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "plugins.catalogSnapshot.write",
				input: {
					snapshot: prepared,
					now
				}
			}));
			if (!result.ok) throw new HostedCatalogSignedFeedMonotonicityError(result.message);
		}
	};
}
//#endregion
export { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore };
