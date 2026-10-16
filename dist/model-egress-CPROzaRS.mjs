import { t as captureSecretRedactionRegistrySnapshot } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as findConfiguredProviderModel } from "./model-provider-config-C5LPYz3z.mjs";
import { a as resolveProviderModelRoutes, t as createProviderModelCatalogIdNormalizer } from "./provider-model-routes-BXIDiDZZ.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { u as sealSecretSentinel } from "./sentinel-D8TyDpFw.mjs";
import { _ as resolveProviderConfigSecretInput } from "./model-auth-provider-config-U8dA4bob.mjs";
import { t as startSecretEgressProxyServer } from "./proxy-server-CWrSvdJC.mjs";
import { t as resolveSecretRefString } from "./resolve-DDYPuZjk.mjs";
import { t as createRedactingStreamWriter } from "./redacting-stream-Bv1XNn85.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/secrets/model-egress.ts
function hasEntries(value) {
	return value !== void 0 && Object.keys(value).length > 0;
}
function resolveModelEgressSelection(params) {
	const provider = normalizeProviderId(params.provider);
	const model = params.model.trim();
	if (!provider || !model) throw new Error("Model egress requires an explicit provider and model");
	const { providerConfig, ref } = resolveProviderConfigSecretInput(params.config, provider);
	if (!providerConfig) throw new Error("Model egress requires a configured provider");
	if (!ref || providerConfig.auth !== void 0 && providerConfig.auth !== "api-key") throw new Error("Model egress requires a configured API-key SecretRef; auth profiles and OAuth are unsupported");
	const configuredModel = findConfiguredProviderModel(providerConfig, provider, model, createProviderModelCatalogIdNormalizer(provider));
	if (hasEntries(providerConfig.headers) || hasEntries(configuredModel?.headers) || hasEntries(providerConfig.request) || providerConfig.authHeader === false || providerConfig.localService !== void 0) throw new Error("Model egress does not support custom request headers, authentication, proxy, TLS, or local-service configuration");
	const resolution = resolveProviderModelRoutes({
		provider,
		modelId: model,
		config: params.config
	});
	if (resolution?.kind === "incompatible") throw new Error(resolution.message);
	const route = resolution ? resolution.kind === "routes" ? resolution.routes.find((candidate) => candidate.authRequirement === "api-key") : void 0 : {
		api: configuredModel?.api ?? providerConfig.api,
		baseUrl: configuredModel?.baseUrl ?? providerConfig.baseUrl
	};
	if (!route?.baseUrl || route.api !== "openai-responses" && route.api !== "openai-completions") throw new Error("Model egress requires an OpenAI-compatible API-key model route");
	let url;
	try {
		url = new URL(route.baseUrl);
	} catch {
		throw new Error("Model egress requires a valid HTTPS model base URL");
	}
	if (url.protocol !== "https:" || url.port || url.username || url.password || url.search || url.hash) throw new Error("Model egress requires an HTTPS model base URL on port 443 without credentials, query, or fragment");
	return {
		provider,
		model,
		ref,
		baseUrl: url.href,
		allowedHosts: [normalizeExactAllowedHost(url.hostname)]
	};
}
/** Owns one explicit CLI job's protected model credential and its revocable egress path. */
async function withConfiguredModelEgress(params, run) {
	try {
		var _usingCtx$1 = _usingCtx();
		params.signal?.throwIfAborted();
		const selection = resolveModelEgressSelection(params);
		const apiKey = await resolveSecretRefString(selection.ref, { config: params.config });
		params.signal?.throwIfAborted();
		if (Buffer.byteLength(apiKey) > 65536) throw new Error("Model egress API key exceeds the protected credential size limit");
		const sentinel = sealSecretSentinel(apiKey, { label: `model-egress:${selection.provider}` });
		const resources = _usingCtx$1.a(new AsyncDisposableStack());
		const caDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-model-egress-"));
		resources.defer(() => fs.rm(caDir, {
			recursive: true,
			force: true
		}));
		params.signal?.throwIfAborted();
		const proxy = await startSecretEgressProxyServer({
			caDir,
			allowedHosts: selection.allowedHosts,
			onAudit: () => {}
		});
		resources.defer(() => proxy.stop());
		params.signal?.throwIfAborted();
		const grant = proxy.registerProcess([{
			name: `${selection.provider} model API key`,
			sentinel,
			allowedHosts: selection.allowedHosts
		}]);
		resources.defer(() => {
			grant.revoke();
			params.signal?.removeEventListener("abort", grant.revoke);
		});
		params.signal?.addEventListener("abort", grant.revoke, { once: true });
		params.signal?.throwIfAborted();
		const caBundle = await fs.readFile(grant.env.NODE_EXTRA_CA_CERTS, "utf8");
		params.signal?.throwIfAborted();
		const values = [...captureSecretRedactionRegistrySnapshot().values, grant.env.HTTPS_PROXY];
		const output = (stream) => createRedactingStreamWriter({ write(text) {
			params.onOutput?.(text, stream);
			return true;
		} }, values);
		const stdout = output("stdout");
		const stderr = output("stderr");
		resources.defer(stdout.flush);
		resources.defer(stderr.flush);
		const result = await run({
			sentinel,
			baseUrl: selection.baseUrl,
			model: selection.model,
			allowedHosts: selection.allowedHosts,
			hostEnv: grant.env,
			caBundle,
			onOutputChunk: params.onOutput ? (chunk, stream) => {
				(stream === "stdout" ? stdout : stderr).write(chunk);
			} : void 0
		});
		params.signal?.throwIfAborted();
		return result;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { withConfiguredModelEgress };
