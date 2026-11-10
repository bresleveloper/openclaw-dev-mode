import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { u as sealSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { r as assertSecretStoreValue } from "./secret-store-validation-DdnAIClg.mjs";
import { s as readSelectedSecretStoreEntries } from "./secret-store-d5UF_g7X.mjs";
import { t as startSecretEgressProxyWorker } from "./proxy-worker-BaJ6snaw.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/secrets/job-egress.ts
function assertJobEnvName(name) {
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(name)) throw new Error("Setup egress environment names must be valid POSIX names");
}
/** One owner for standalone jobs' proxy, grants, cancellation, and CA cleanup. */
async function withJobSecretEgress(params, run) {
	try {
		var _usingCtx$1 = _usingCtx();
		params.signal?.throwIfAborted();
		const remoteEnv = {};
		const bindings = params.secrets.map((secret) => {
			assertJobEnvName(secret.envName);
			assertSecretStoreValue(secret.value, "secret", secret.name);
			const sentinel = sealSecretSentinel(secret.value, { label: `job-egress:${secret.name}` });
			remoteEnv[secret.envName] = sentinel;
			return {
				name: secret.name,
				sentinel,
				allowedHosts: secret.allowedHosts
			};
		});
		const resources = _usingCtx$1.a(new AsyncDisposableStack());
		const caDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-job-egress-"));
		resources.defer(() => fs.rm(caDir, {
			recursive: true,
			force: true
		}));
		params.signal?.throwIfAborted();
		const proxy = await startSecretEgressProxyWorker({
			caDir,
			allowedHosts: params.allowedHosts,
			onAudit: () => {}
		});
		resources.defer(() => proxy.stop());
		params.signal?.throwIfAborted();
		const grant = await proxy.registerProcess(bindings);
		resources.defer(() => {
			grant.revoke();
			params.signal?.removeEventListener("abort", grant.revoke);
		});
		params.signal?.addEventListener("abort", grant.revoke, { once: true });
		params.signal?.throwIfAborted();
		const caBundle = await fs.readFile(grant.env.NODE_EXTRA_CA_CERTS, "utf8");
		params.signal?.throwIfAborted();
		const result = await run({
			remoteEnv,
			hostEnv: grant.env,
			caBundle,
			revoke: grant.revoke
		});
		params.signal?.throwIfAborted();
		return result;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Reads only selected protected store rows and binds their destination policy to one job. */
async function withSetupSecretEgress(params, run) {
	params.signal.throwIfAborted();
	const selection = Object.entries(params.secrets).map(([envName, ref]) => {
		assertJobEnvName(envName);
		if (ref.source !== "store") throw new Error("Setup egress requires shared-store SecretRefs");
		return {
			envName,
			name: ref.id
		};
	});
	const entries = await readSelectedSecretStoreEntries({
		names: selection.map((secret) => secret.name),
		assertCurrent: () => params.signal.throwIfAborted()
	});
	const byName = new Map(entries.map((entry) => [entry.name, entry]));
	return withJobSecretEgress({
		secrets: selection.map(({ envName, name }) => {
			const entry = byName.get(name);
			if (!entry) throw new Error(`Setup egress secret "${name}" was not found as a protected shared-store entry`);
			if (!entry.allowedHosts.length) throw new Error(`Setup secret "${name}" has no destination bindings; run openclaw secrets store set ${name} --allow-host <host> before retrying`);
			return {
				envName,
				name: entry.name,
				value: entry.value,
				allowedHosts: entry.allowedHosts
			};
		}),
		signal: params.signal
	}, run);
}
//#endregion
export { withSetupSecretEgress as n, withJobSecretEgress as t };
