import { c as sanitizeHostExecEnv, t as inspectHostExecEnvOverrides } from "./host-env-security-D0hvR517.mjs";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
//#region src/agents/agent-bundle-lsp-env.ts
/** Bundle LSP server environment: allowlisted base plus withheld-name diagnostics. */
const LSP_ENV_PASSTHROUGH_DOCS_URL = "https://docs.openclaw.ai/plugins/bundles#lsp-server-environment";
const LSP_INHERITED_ENV_KEYS = /* @__PURE__ */ new Set([
	"LANG",
	"LANGUAGE",
	"TZ",
	"TMPDIR",
	"TMP",
	"TEMP",
	"XDG_CACHE_HOME",
	"XDG_CONFIG_HOME",
	"XDG_DATA_HOME",
	"XDG_STATE_HOME",
	"XDG_RUNTIME_DIR",
	"XDG_CONFIG_DIRS",
	"XDG_DATA_DIRS",
	"GOROOT",
	"GOMODCACHE",
	"GOBIN",
	"RUSTUP_HOME",
	"RUSTUP_TOOLCHAIN",
	"JAVA_HOME"
]);
const COMMONLY_NEEDED_LSP_ENV_NAMES = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"NO_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy",
	"no_proxy",
	"SSL_CERT_FILE",
	"SSL_CERT_DIR",
	"NODE_EXTRA_CA_CERTS",
	"REQUESTS_CA_BUNDLE",
	"CURL_CA_BUNDLE",
	"VIRTUAL_ENV",
	"CONDA_PREFIX",
	"PYTHONPATH",
	"NODE_OPTIONS",
	"NODE_PATH",
	"GOPATH",
	"GOFLAGS",
	"GOPRIVATE",
	"GOPROXY",
	"GONOPROXY",
	"GONOSUMDB",
	"CARGO_HOME",
	"CARGO_TARGET_DIR",
	"GRADLE_USER_HOME",
	"MAVEN_HOME",
	"M2_HOME",
	"DOTNET_ROOT",
	"ANDROID_HOME",
	"ANDROID_SDK_ROOT"
];
const SECRET_LOOKING_ENV_NAME = /TOKEN|KEY|SECRET|PASSWORD|PASSWD|CREDENTIAL|AUTH|COOKIE|SESSION/i;
function envLookupName(key) {
	return process.platform === "win32" ? key.toUpperCase() : key;
}
/** Bundle LSP base env: the MCP stdio defaults plus toolchain locations, never Gateway secrets. */
function resolveLspBaseEnv(parentEnv) {
	const env = getDefaultEnvironment();
	for (const [key, value] of Object.entries(parentEnv)) {
		const name = envLookupName(key);
		if (value !== void 0 && (name.startsWith("LC_") || LSP_INHERITED_ENV_KEYS.has(name))) env[key] = value;
	}
	return env;
}
/** Child env for a bundle LSP server: allowlisted base, then the server's own `env`. */
function resolveLspServerEnv(serverEnv, parentEnv = process.env) {
	return sanitizeHostExecEnv({
		baseEnv: resolveLspBaseEnv(parentEnv),
		overrides: serverEnv ?? null
	});
}
/** Names of commonly needed, non-secret parent variables missing from a server's child env. */
function collectWithheldLspEnvNames(params) {
	const candidates = new Set(COMMONLY_NEEDED_LSP_ENV_NAMES.map(envLookupName));
	const childNames = new Set(Object.keys(params.childEnv).map(envLookupName));
	const withheld = /* @__PURE__ */ new Set();
	for (const [key, value] of Object.entries(params.parentEnv)) {
		const name = envLookupName(key);
		if (value?.trim() && candidates.has(name) && !childNames.has(name) && !SECRET_LOOKING_ENV_NAME.test(name)) withheld.add(key);
	}
	const result = {
		configurable: [],
		refused: []
	};
	for (const name of [...withheld].toSorted()) {
		const { rejectedOverrideBlockedKeys } = inspectHostExecEnvOverrides({ overrides: { [name]: "" } });
		(rejectedOverrideBlockedKeys.length > 0 ? result.refused : result.configurable).push(name);
	}
	return result;
}
/** One line per category; empty when nothing commonly needed was withheld. */
function formatWithheldLspEnvHints(withheld) {
	const lines = [];
	if (withheld.configurable.length > 0) lines.push(`${withheld.configurable.join(", ")}: add to the server's "env" in its bundle .lsp.json if it needs them.`);
	if (withheld.refused.length > 0) lines.push(`${withheld.refused.join(", ")}: refused by the host exec env policy, also in "env"; a server that needs them must set them itself (for example, a wrapper script as its "command").`);
	return lines;
}
//#endregion
export { resolveLspServerEnv as i, collectWithheldLspEnvNames as n, formatWithheldLspEnvHints as r, LSP_ENV_PASSTHROUGH_DOCS_URL as t };
