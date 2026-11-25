import { i as setMatrixRuntime } from "./.setup/runtime-Ck8TjD7L.mjs";
import { a as resolveConfiguredMatrixAccountIds, i as requiresExplicitMatrixDefaultAccount, n as findMatrixAccountEntry, o as resolveMatrixChannelConfig, p as resolveMatrixAccountStringValues, s as resolveMatrixDefaultOrOnlyAccountId } from "./.setup/account-selection-Cow3TMFO.mjs";
import { n as listMatrixEnvAccountIds, r as resolveMatrixEnvAccountToken, t as getMatrixScopedEnvVarNames } from "./.setup/env-vars-Bh1iOXJ1.mjs";
import { a as resolveMatrixCredentialsFilename, i as resolveMatrixCredentialsDir, l as sanitizeMatrixPathSegment, o as resolveMatrixCredentialsPath, r as resolveMatrixAccountStorageRoot, s as resolveMatrixHomeserverKey, t as hashMatrixAccessToken } from "./.setup/storage-paths-e_Vq6cvw.mjs";
import { f as setMatrixThreadBindingMaxAgeBySessionKey, l as setMatrixThreadBindingIdleTimeoutBySessionKey, p as setMatrixThreadBindingMaxAgeBySessionKeyAsync, u as setMatrixThreadBindingIdleTimeoutBySessionKeyAsync } from "./.setup/thread-bindings-shared-DEAGGuDA.mjs";
import { n as ensureMatrixSdkInstalled, r as isMatrixSdkAvailable } from "./.setup/deps-CVPT2Ros.mjs";
import { chunkTextForOutbound as chunkTextForOutbound$1 } from "openclaw/plugin-sdk/text-chunking";
import { assertHttpUrlTargetsPrivateNetwork, closeDispatcher, createPinnedDispatcher, resolvePinnedHostnameWithPolicy, ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "openclaw/plugin-sdk/ssrf-runtime";
import { formatZonedTimestamp } from "openclaw/plugin-sdk/time-runtime";
import { writeJsonFileAtomically } from "openclaw/plugin-sdk/json-store";
// extensions/matrix/runtime-api.ts
function chunkTextForOutbound(text, limit) {
	if (text.length === 0 || limit <= 0) return [text];
	if (Number.isFinite(limit) && limit > 0 && !Number.isInteger(limit)) return chunkTextForOutbound$1(text, limit);
	const chunks = [];
	let remaining = text;
	while (remaining.length > limit) {
		const window = remaining.slice(0, limit);
		const splitAt = Math.max(window.lastIndexOf("\n"), window.lastIndexOf(" "));
		const breakAt = splitAt > 0 ? splitAt : limit;
		chunks.push(remaining.slice(0, breakAt).trimEnd());
		remaining = remaining.slice(breakAt).trimStart();
	}
	if (remaining.length > 0) chunks.push(remaining);
	return chunks;
}
export { assertHttpUrlTargetsPrivateNetwork, chunkTextForOutbound, closeDispatcher, createPinnedDispatcher, ensureMatrixSdkInstalled, findMatrixAccountEntry, formatZonedTimestamp, getMatrixScopedEnvVarNames, hashMatrixAccessToken, isMatrixSdkAvailable, listMatrixEnvAccountIds, requiresExplicitMatrixDefaultAccount, resolveConfiguredMatrixAccountIds, resolveMatrixAccountStorageRoot, resolveMatrixAccountStringValues, resolveMatrixChannelConfig, resolveMatrixCredentialsDir, resolveMatrixCredentialsFilename, resolveMatrixCredentialsPath, resolveMatrixDefaultOrOnlyAccountId, resolveMatrixEnvAccountToken, resolveMatrixHomeserverKey, resolvePinnedHostnameWithPolicy, sanitizeMatrixPathSegment, setMatrixRuntime, setMatrixThreadBindingIdleTimeoutBySessionKey, setMatrixThreadBindingIdleTimeoutBySessionKeyAsync, setMatrixThreadBindingMaxAgeBySessionKey, setMatrixThreadBindingMaxAgeBySessionKeyAsync, ssrfPolicyFromDangerouslyAllowPrivateNetwork, writeJsonFileAtomically };
