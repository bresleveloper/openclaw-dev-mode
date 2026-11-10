import { t as captureSecretRedactionRegistrySnapshot } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { a as resolveProviderModelRoutes, t as createProviderModelCatalogIdNormalizer } from "./provider-model-routes-CmpBxrCV.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { g as resolveProviderConfigSecretInput } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { t as resolveSecretRefString } from "./resolve-D1-YVpS6.mjs";
import { t as withJobSecretEgress } from "./job-egress-DLYaI5Gi.mjs";
import { StringDecoder } from "node:string_decoder";
//#region src/logging/redacting-stream.ts
function createRedactingStreamWriter(target, redactValues) {
	const decoder = new StringDecoder("utf8");
	const values = redactValues.filter(Boolean).toSorted((left, right) => right.length - left.length);
	const firstCharacters = new Set(values.map((value) => value.charAt(0)));
	let pending = "";
	const emit = (ending) => {
		let output = "";
		let cursor = 0;
		while (cursor < pending.length) {
			const value = firstCharacters.has(pending.charAt(cursor)) ? values.find((candidate) => pending.startsWith(candidate, cursor) || !ending && pending.length - cursor < candidate.length && candidate.startsWith(pending.slice(cursor))) : void 0;
			if (!value) {
				output += pending[cursor];
				cursor += 1;
			} else if (cursor + value.length > pending.length) break;
			else {
				output += "<redacted>";
				cursor += value.length;
			}
		}
		pending = pending.slice(cursor);
		return !output || target.write(output);
	};
	return {
		write: (chunk) => {
			pending += decoder.write(chunk);
			return emit(false);
		},
		flush: () => {
			pending += decoder.end();
			emit(true);
		}
	};
}
//#endregion
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
	params.signal?.throwIfAborted();
	const selection = resolveModelEgressSelection(params);
	const apiKey = await resolveSecretRefString(selection.ref, { config: params.config });
	params.signal?.throwIfAborted();
	return withJobSecretEgress({
		secrets: [{
			envName: "OPENAI_API_KEY",
			name: `${selection.provider} model API key`,
			value: apiKey,
			allowedHosts: selection.allowedHosts
		}],
		signal: params.signal,
		allowedHosts: selection.allowedHosts
	}, async (egress) => {
		try {
			var _usingCtx$1 = _usingCtx();
			const resources = _usingCtx$1.a(new AsyncDisposableStack());
			const values = [...captureSecretRedactionRegistrySnapshot().values, egress.hostEnv.HTTPS_PROXY];
			const output = (stream) => createRedactingStreamWriter({ write(text) {
				params.onOutput?.(text, stream);
				return true;
			} }, values);
			const stdout = output("stdout");
			const stderr = output("stderr");
			resources.defer(stdout.flush);
			resources.defer(stderr.flush);
			const result = await run({
				sentinel: egress.remoteEnv.OPENAI_API_KEY,
				baseUrl: selection.baseUrl,
				model: selection.model,
				allowedHosts: selection.allowedHosts,
				hostEnv: egress.hostEnv,
				caBundle: egress.caBundle,
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
	});
}
//#endregion
export { withConfiguredModelEgress };
