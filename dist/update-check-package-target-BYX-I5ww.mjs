import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-umfRGZ-E.mjs";
import "./http-body-CgfQBa7S.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BoUn0ffV.mjs";
import "./npm-install-env-CROOzau_.mjs";
//#region src/infra/update-check-package-target.ts
function parseNpmPackageTargetMetadata(raw, packageName) {
	let parsed;
	try {
		parsed = JSON.parse(raw.trim());
	} catch (err) {
		throw new Error(`npm view returned invalid JSON: ${String(err)}`, { cause: err });
	}
	const entry = Array.isArray(parsed) && parsed.length === 1 ? parsed[0] : parsed;
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {
		version: null,
		nodeEngine: null
	};
	const rec = entry;
	const engines = rec.engines && typeof rec.engines === "object" ? rec.engines : null;
	const nodeEngine = normalizeNullableString(rec["engines.node"]) ?? (engines ? normalizeNullableString(engines.node) : null);
	const schemaVersions = parsePackageOpenClawSchemaVersions({
		name: packageName,
		version: rec.version,
		openclaw: Object.hasOwn(rec, "openclaw.schemaVersions") ? { schemaVersions: rec["openclaw.schemaVersions"] } : rec.openclaw
	});
	return {
		version: normalizeNullableString(rec.version),
		nodeEngine,
		...schemaVersions ? { schemaVersions } : {}
	};
}
function formatNpmViewError(res) {
	const raw = (res.stderr.trim() || res.stdout.trim()).split("\n").slice(-3).join("\n");
	return raw ? `npm view failed: ${raw}` : "npm view failed";
}
function packageTargetSpec(params) {
	return params.spec?.trim() || `openclaw@${params.target.trim() || "latest"}`;
}
const PUBLIC_NPM_REGISTRY_URL = "https://registry.npmjs.org/";
const PUBLIC_NPM_PACKAGE_NAME = "openclaw";
var NpmRegistryHttpError = class extends Error {};
/** Reads one registry document, retaining the deadline until its body is consumed. */
async function fetchRegistryPackageDocument(params) {
	const registry = params.registryUrl ?? PUBLIC_NPM_REGISTRY_URL;
	const packageName = params.packageName ?? PUBLIC_NPM_PACKAGE_NAME;
	const url = new URL(`${encodeURIComponent(packageName)}/${encodeURIComponent(params.target)}`, registry.endsWith("/") ? registry : `${registry}/`).toString();
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: Math.max(1, params.timeoutMs ?? 3e5),
		signal: params.signal,
		operation: params.operation ?? "npm-registry-update-check",
		url
	});
	let res;
	try {
		res = await fetch(url, { signal });
		if (!res.ok) throw new NpmRegistryHttpError(`HTTP ${res.status}`);
		return await readProviderJsonResponse(res, params.label ?? "npm package target status", params.bodyTimeoutMs === void 0 ? void 0 : {
			signal,
			chunkTimeoutMs: params.bodyTimeoutMs
		});
	} finally {
		await cancelUnreadResponseBody(res);
		cleanup();
	}
}
async function fetchNpmPackageTargetStatus(params) {
	const timeoutMs = params.timeoutMs ?? 3e5;
	try {
		if (!params.command && !params.runCommand) {
			const json = await fetchRegistryPackageDocument(params);
			const schemaVersions = parsePackageOpenClawSchemaVersions({
				...json,
				name: params.packageName ?? PUBLIC_NPM_PACKAGE_NAME
			});
			return {
				version: normalizeNullableString(json.version),
				nodeEngine: normalizeNullableString(json.engines?.node),
				...schemaVersions ? { schemaVersions } : {}
			};
		}
		const runCommand = params.runCommand ?? runCommandWithTimeout;
		const spec = packageTargetSpec(params);
		const res = await runCommand([
			params.command ?? "npm",
			"view",
			spec,
			"version",
			"engines.node",
			"openclaw.schemaVersions",
			"--json",
			"--global"
		], {
			timeoutMs: Math.max(1, timeoutMs),
			cwd: params.cwd,
			env: params.env,
			maxOutputBytes: 1048576
		});
		if (res.code !== 0) return {
			version: null,
			nodeEngine: null,
			error: formatNpmViewError(res)
		};
		return { ...parseNpmPackageTargetMetadata(res.stdout, spec === "openclaw" || /^openclaw@[^:/]+$/.test(spec) ? "openclaw" : "") };
	} catch (err) {
		return {
			version: null,
			nodeEngine: null,
			error: err instanceof NpmRegistryHttpError ? err.message : String(err)
		};
	}
}
//#endregion
export { fetchRegistryPackageDocument as n, fetchNpmPackageTargetStatus as t };
