import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { a as normalizeStoreSessionKey, s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { m as sessionCreatorProfileId } from "./session-entry-lineage-B7Mubzwj.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { t as SessionEntryChangedDuringReadError } from "./session-entry-read-errors-Cn4uY9H4.mjs";
import { a as captureSessionEntryReadScope, s as isNativeSessionEntryRead } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { c as withSessionEntriesFromStoresInWorker, l as withSessionEntryReadOnlyInWorker, n as readSessionEntriesFromStoreInWorker, s as withSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { c as loadSessionEntryReadOnlyResultInScope } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { t as captureNativeSessionEntryCurrentRead } from "./session-entry-current-runtime-Dwzq8LTI.mjs";
import { r as escapeControlCharsVisible, t as auditSandboxToolPolicyBlock } from "./tool-policy-audit-DWI5omqZ.mjs";
import { r as resolveSandboxToolPolicyForAgent, t as classifyToolAgainstSandboxToolPolicy } from "./tool-policy-CGPJHOz_.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sandbox/runtime-status.ts
const legacySandboxReader = new AsyncLocalStorage();
/** Only deprecated synchronous SDK entry points install the compatibility reader. */
function withLegacySandboxRuntimeStatusReader(reader, read) {
	return legacySandboxReader.run(reader, read);
}
function resolveSandboxRuntimeStatus(params) {
	return resolveSandboxRuntimeStatusForClassification(params);
}
/** Classify an already selected session without reading storage. */
function resolvePreparedSandboxRuntimeStatus(params) {
	return resolveSandboxRuntimeStatusForClassification(params);
}
function resolveSandboxRuntimeStatusAsync(params) {
	if (params.preparedSessionEntry !== void 0) return Promise.resolve(resolveSandboxRuntimeStatus(params));
	return withSandboxRuntimeStatusInWorker(params, {
		env: process.env,
		cwd: process.cwd(),
		assertCurrent() {}
	}, async (status) => status);
}
/** Keep the classification read's captured owner alive through one asynchronous policy preparation. */
async function withSandboxRuntimeStatusInWorker(params, source, consume) {
	source.assertCurrent();
	const classification = resolveSandboxClassification(params);
	const prepare = (entry) => {
		source.assertCurrent();
		source.assertEntryCurrent?.(entry);
		return consume(resolveSandboxRuntimeStatusForClassification({
			...params,
			preparedSessionEntry: entry ?? null
		}, classification));
	};
	if (!classification.classificationSessionKey) {
		const result = await prepare(void 0);
		source.assertCurrent();
		return result;
	}
	const assertCurrent = () => {
		source.assertCurrent();
		if (source.readSource && typeof source.readSource.databaseIdentity === "string") assertCapturedSessionEntryReadSource(source.readSource);
	};
	assertCurrent();
	const sessionKey = resolveSqliteSessionKey(classification.comparableSessionKey, classification.classificationAgentId);
	const reader = source.reader?.logicalAgentId === classification.classificationAgentId && source.reader.sessionKey === sessionKey ? source.reader : void 0;
	const scope = {
		agentId: classification.classificationAgentId,
		sessionKey,
		storePath: source.readSource?.path ?? (reader && !params.cfg?.session?.store?.trim() ? reader.database.path : resolveSessionStorePathCore(params.cfg?.session?.store, {
			agentId: classification.classificationAgentId,
			env: source.env
		})),
		env: source.env
	};
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize() {}
	});
	if (memory) {
		const entry = readCapturedSessionActorEntry(memory, sessionKey);
		source.assertEntryCurrent?.(entry);
		const sandbox = resolveSandboxRuntimeStatusForClassification({
			...params,
			preparedSessionEntry: entry ?? null
		}, classification);
		const result = await consume(sandbox);
		assertCurrent();
		const currentEntry = readCapturedSessionActorEntry(memory, sessionKey);
		source.assertEntryCurrent?.(currentEntry);
		const current = resolveSandboxRuntimeStatusForClassification({
			...params,
			preparedSessionEntry: currentEntry ?? null
		}, classification);
		if (!isDeepStrictEqual(current, sandbox)) throw new SessionEntryChangedDuringReadError();
		source.prepareEntryConsumer?.(result)?.(currentEntry);
		return result;
	}
	if (reader) {
		const key = assertSessionEntryCohortScope(reader, scope);
		const withClassification = (consumeCurrent, includeSnapshots = false) => reader.withRead({
			sessionKeys: [key],
			snapshotFields: includeSnapshots ? void 0 : []
		}, assertCurrent, (read, assertPrepared) => {
			assertPrepared();
			const entry = read.entries.find((row) => row.sessionKey === key)?.entry;
			source.assertEntryCurrent?.(entry);
			return consumeCurrent(resolveSandboxRuntimeStatusForClassification({
				...params,
				preparedSessionEntry: entry ?? null
			}, classification), entry);
		});
		const sandbox = await withClassification((current) => current);
		assertCurrent();
		reader.assertCurrent();
		const result = await consume(sandbox);
		const consumeEntry = source.prepareEntryConsumer?.(result);
		return withClassification((current, entry) => {
			if (!isDeepStrictEqual(current, sandbox)) throw new SessionEntryChangedDuringReadError();
			consumeEntry?.(entry);
			return result;
		}, consumeEntry !== void 0);
	}
	if (isNativeSessionEntryRead(scope, scope.agentId)) return withSessionEntryReadOnlyInWorker(scope, assertCurrent, async (read) => {
		if (!read.ok) throw read.error;
		return prepare(read.value);
	});
	return withSessionEntriesFromStoreInWorker({
		...scope,
		sessionKeys: [normalizeStoreSessionKey(scope.sessionKey), ...collectSessionEntryLookupKeys(scope.sessionKey)],
		projection: "exact"
	}, async (read) => {
		assertCurrent();
		const result = await prepare(resolveSessionEntryCandidates({
			entries: read.result.entries,
			sessionKey: scope.sessionKey,
			canonicalKeys: true
		}).existing?.entry);
		assertCurrent();
		read.assertCurrent();
		return result;
	});
}
/** Read current memory policy when the durable sources reach their ordered publication. */
function withSandboxRuntimeStatusesInWorker(requests, source, consume) {
	source.assertCurrent();
	const inputs = [];
	const projections = requests.map((params) => {
		const classification = resolveSandboxClassification(params);
		const project = (entry) => resolveSandboxRuntimeStatusForClassification({
			...params,
			preparedSessionEntry: entry ?? null
		}, classification);
		if (!classification.classificationSessionKey) return () => project(void 0);
		const storePath = resolveSessionStorePathCore(params.cfg?.session?.store, {
			agentId: classification.classificationAgentId,
			env: source.env
		});
		const target = {
			agentId: classification.classificationAgentId,
			sessionKey: resolveSqliteSessionKey(classification.comparableSessionKey, classification.classificationAgentId),
			storePath,
			env: source.env
		};
		const privateSource = captureSessionActorStorageOwner(target, {
			assertCurrent: source.assertCurrent,
			authorize() {}
		});
		if (privateSource) return () => project(readCapturedSessionActorEntry(privateSource, target.sessionKey));
		const { scope } = captureSessionEntryReadScope({
			agentId: classification.classificationAgentId,
			sessionKey: resolveSqliteSessionKey(classification.comparableSessionKey, classification.classificationAgentId),
			storePath,
			env: source.env
		});
		if (isNativeSessionEntryRead(scope, scope.agentId)) {
			const native = captureNativeSessionEntryCurrentRead(scope);
			return () => {
				native.assertSourceCurrent();
				const read = loadSessionEntryReadOnlyResultInScope(scope);
				if (!read.ok) throw read.error;
				native.assertSourceCurrent();
				return project(read.value);
			};
		}
		let input = inputs.find((read) => read.agentId === scope.agentId && read.storePath === storePath);
		if (!input) {
			input = {
				agentId: classification.classificationAgentId,
				storePath,
				env: scope.env,
				sessionKeys: [],
				projection: "exact"
			};
			inputs.push(input);
		}
		input.sessionKeys.push(normalizeStoreSessionKey(scope.sessionKey), ...collectSessionEntryLookupKeys(scope.sessionKey));
		const index = inputs.indexOf(input);
		return (reads) => project(resolveSessionEntryCandidates({
			entries: reads[index].result.entries,
			sessionKey: scope.sessionKey,
			canonicalKeys: true
		}).existing?.entry);
	});
	const captures = inputs.map((input) => {
		const candidates = captureSessionStoreReadCandidates(input.storePath);
		return {
			input,
			candidates,
			identities: captureSessionStoreCandidateIdentities(candidates)
		};
	});
	return withSessionEntriesFromStoresInWorker(inputs, (reads) => {
		source.assertCurrent();
		const statuses = projections.map((project) => project(reads));
		source.assertCurrent();
		const result = consume(statuses);
		source.assertCurrent();
		for (const read of reads) read.assertCurrent();
		return result;
	}, {
		ordered: true,
		prepareSource(input, database, identity) {
			const captured = captures.find((capture) => capture.input === input);
			const expected = captured.identities.get(assertSessionStoreReadCandidate(database.path, captured.candidates));
			if (!expected || expected.key !== identity.key || expected.birthtime !== identity.birthtime) throw new Error("Sandbox classification source changed during batch preparation");
		}
	});
}
/** Classifies durable canonical keys without admitting the same store once per session. */
async function resolveSandboxRuntimeStatusesForPersistedSessions(requests) {
	const results = await Promise.all(requests.map(async (params) => params.sessionKeys.length === 0 ? { entries: [] } : readSessionEntriesFromStoreInWorker({
		agentId: params.agentId,
		env: params.env,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
			agentId: params.agentId,
			env: params.env
		}),
		projection: "list",
		sessionKeys: params.sessionKeys.map((sessionKey) => canonicalizeMainSessionAlias({
			...params,
			sessionKey
		}))
	})));
	return requests.map((params, index) => {
		const result = expectDefined(results[index], "sandbox session read result");
		const byKey = new Map(result.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
		return params.sessionKeys.map((sessionKey) => {
			const classification = resolveSandboxClassification({
				...params,
				sessionKey
			});
			return resolveSandboxRuntimeStatusForClassification({
				...params,
				sessionKey,
				preparedSessionEntry: byKey.get(classification.comparableSessionKey) ?? null
			}, classification);
		});
	});
}
function resolveSandboxClassification(params) {
	const sessionKey = params.sessionKey?.trim() ?? "";
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: params.cfg,
		agentId: params.agentId
	});
	const classificationSessionKey = params.classificationSessionKey?.trim() || sessionKey;
	const classificationAgentId = resolveSessionAgentId({
		sessionKey: classificationSessionKey,
		config: params.cfg,
		agentId: params.classificationAgentId,
		fallbackAgentId: classificationSessionKey === sessionKey ? agentId : void 0
	});
	const cfg = params.cfg;
	return {
		sessionKey,
		agentId,
		classificationSessionKey,
		classificationAgentId,
		cfg,
		sandboxCfg: resolveSandboxConfigForAgent(cfg, classificationAgentId),
		mainSessionKey: cfg?.session?.scope === "global" ? "global" : resolveAgentMainSessionKey({
			cfg,
			agentId: classificationAgentId
		}),
		comparableSessionKey: canonicalizeMainSessionAlias({
			cfg,
			agentId: classificationAgentId,
			sessionKey: resolveSqliteSessionKey(classificationSessionKey, classificationAgentId)
		})
	};
}
function readLegacySandboxSession(scope) {
	const reader = legacySandboxReader.getStore();
	if (!reader) throw new Error("Sandbox session policy requires asynchronous preparation");
	return reader(scope);
}
function resolveSandboxRuntimeStatusForClassification(params, classification = resolveSandboxClassification(params)) {
	const { sessionKey, agentId, classificationSessionKey, classificationAgentId, cfg, sandboxCfg, mainSessionKey, comparableSessionKey } = classification;
	const privateSource = params.preparedSessionEntry === void 0 && classificationSessionKey ? captureSessionActorStorageOwner({
		agentId: classificationAgentId,
		sessionKey: comparableSessionKey,
		storePath: cfg?.session?.store ? resolveSessionStorePathCore(cfg.session.store, { agentId: classificationAgentId }) : void 0
	}, {
		assertCurrent() {},
		authorize() {}
	}) : void 0;
	const session = privateSource ? {
		existing: readCapturedSessionActorEntry(privateSource, comparableSessionKey),
		normalizedKey: comparableSessionKey
	} : params.preparedSessionEntry !== void 0 ? {
		existing: params.preparedSessionEntry ?? void 0,
		normalizedKey: comparableSessionKey
	} : classificationSessionKey ? {
		existing: readLegacySandboxSession({
			agentId: classificationAgentId,
			sessionKey: comparableSessionKey,
			storePath: resolveSessionStorePathCore(cfg?.session?.store, { agentId: classificationAgentId })
		}),
		normalizedKey: comparableSessionKey
	} : void 0;
	const sandboxRequired = session?.existing?.sandbox === "required";
	const profileId = sessionCreatorProfileId(session?.existing?.createdActor)?.trim();
	const isolation = sandboxRequired ? {
		sandboxRequired: true,
		createdActor: session.existing?.createdActor,
		isolationSubject: profileId ? {
			kind: "profile",
			profileId
		} : {
			kind: "session",
			sessionKey: session.normalizedKey
		},
		workspaceAccess: sandboxCfg.workspaceAccess === "rw" ? "ro" : sandboxCfg.workspaceAccess
	} : { sandboxRequired: false };
	const sandboxed = Boolean(classificationSessionKey) && (sandboxRequired || session?.existing?.sandboxMode !== "off" && sandboxCfg.mode !== "off" && (sandboxCfg.mode === "all" || comparableSessionKey.trim() !== mainSessionKey.trim()));
	return {
		agentId,
		sessionKey,
		classificationAgentId,
		classificationSessionKey,
		mainSessionKey,
		mode: sandboxCfg.mode,
		...isolation,
		sandboxed,
		toolPolicy: resolveSandboxToolPolicyForAgent(cfg, classificationAgentId)
	};
}
function redactSessionKey(value) {
	const trimmed = value.trim();
	if (!trimmed) return "(unknown)";
	if (trimmed.length <= 12) return "(redacted)";
	return `${escapeControlCharsVisible(truncateUtf16Safe(trimmed, 6))}…${escapeControlCharsVisible(sliceUtf16Safe(trimmed, -6))}`;
}
function shellEscapeSingleArg(value) {
	return `'${value.replaceAll("'", `'\\''`)}'`;
}
function formatSandboxToolPolicyBlockedMessage(params) {
	const tool = normalizeOptionalLowercaseString(params.toolName);
	if (!tool) return;
	const runtime = params.preparedRuntimeStatus;
	if (!runtime.sandboxed) return;
	const { blockedByDeny, blockedByAllow } = classifyToolAgainstSandboxToolPolicy(tool, runtime.toolPolicy);
	if (!blockedByDeny && !blockedByAllow) return;
	const blockingSource = blockedByDeny ? runtime.toolPolicy.sources.deny : runtime.toolPolicy.sources.allow;
	if (params.audit === true) auditSandboxToolPolicyBlock({
		toolName: tool,
		ruleType: blockedByDeny ? "deny" : "allow",
		ruleSource: blockingSource.source,
		configKey: blockingSource.key,
		policy: runtime.toolPolicy,
		mode: runtime.mode
	});
	const reasons = [];
	const fixes = [];
	if (blockedByDeny) {
		reasons.push("deny list");
		fixes.push(`Remove "${tool}" from ${runtime.toolPolicy.sources.deny.key}.`);
	}
	if (blockedByAllow) {
		reasons.push("allow list");
		fixes.push(`Add "${tool}" to ${runtime.toolPolicy.sources.allow.key} (or set it to [] to allow all).`);
	}
	const lines = [];
	lines.push(`Tool "${tool}" blocked by sandbox tool policy (mode=${runtime.mode}).`);
	lines.push(`Session: ${redactSessionKey(runtime.sessionKey)}`);
	lines.push(`Reason: ${reasons.join(" + ")}`);
	lines.push("Fix:");
	lines.push(runtime.sandboxRequired ? "- This session requires a sandbox; create a new session under an authorized role." : "- agents.defaults.sandbox.mode=off (disable sandbox)");
	for (const fix of fixes) lines.push(`- ${fix}`);
	if (runtime.mode === "non-main" && !runtime.sandboxRequired) lines.push("- Use the agent main session instead of a non-main session.");
	const explainCommand = runtime.sessionKey && !containsAsciiControlCharacter(runtime.sessionKey) ? `openclaw sandbox explain --session ${shellEscapeSingleArg(runtime.sessionKey)} --agent ${runtime.agentId}` : `openclaw sandbox explain --agent ${runtime.agentId}`;
	lines.push(`- See: ${formatCliCommand(explainCommand)}`);
	return lines.join("\n");
}
//#endregion
export { resolveSandboxRuntimeStatusesForPersistedSessions as a, withSandboxRuntimeStatusesInWorker as c, resolveSandboxRuntimeStatusAsync as i, resolvePreparedSandboxRuntimeStatus as n, withLegacySandboxRuntimeStatusReader as o, resolveSandboxRuntimeStatus as r, withSandboxRuntimeStatusInWorker as s, formatSandboxToolPolicyBlockedMessage as t };
