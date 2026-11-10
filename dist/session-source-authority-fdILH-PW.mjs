import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-source-authority.ts
const publishedSourceAdmissions = /* @__PURE__ */ new WeakMap();
/** Bind the existing owner's live publication without copying authority into another cache. */
function bindPublishedSessionSourceAdmission(predicate, admit) {
	publishedSourceAdmissions.set(predicate, admit);
}
/** Each durable operation admits anew; later disclosure and execution keep their live checks. */
function admitPublishedSessionSource(predicate) {
	const admit = publishedSourceAdmissions.get(predicate);
	if (!admit) return false;
	admit();
	return true;
}
function sessionEntryCommitGuardOptions(source) {
	return source?.nativeSource ? { assertCommitAllowed: source } : { workerGuard: { source } };
}
/** Install transaction facts before composed host assertions recheck their live alternatives. */
function acceptSessionSourceValidation(source, validation) {
	const refused = validation?.refusedSource;
	if (refused) {
		source.checks[refused.index]?.refuse(refused.facts);
		throw new Error("Session source refusal omitted its prepared assertion");
	}
	for (const [index, check] of source.checks.entries()) {
		if (!check.acceptConversationMatches) continue;
		const matched = validation?.conversationMatches.find((entry) => entry.index === index);
		if (!matched || matched.alternatives.some((alternative) => !Number.isSafeInteger(alternative) || alternative < 0 || alternative >= (check.predicate.conversationAlternatives?.length ?? 0))) throw new Error("Session source validation omitted its matching alternatives");
		matched.acceptedAlternatives = check.acceptConversationMatches(matched.alternatives);
	}
}
const sessionSourceScopes = new AsyncLocalStorage();
/** Classify request/SDK callbacks before adapters compose them with prepared internal authority. */
function captureExternalSessionCommitGuard(guard) {
	return guard && !guard.prepareSessionSource ? Object.assign(() => guard(), {
		nativeSource: true,
		opaqueCommitGuard: true
	}) : guard;
}
async function releaseSessionSourceAuthorities(sources, priorErrors = []) {
	const errors = [...priorErrors];
	for (const source of sources.toReversed()) try {
		await source.release?.();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Session source cleanup failed");
}
async function prepareSessionSourceAuthority(assertion) {
	return assertion?.prepareSessionSource ? assertion.prepareSessionSource() : {
		assertCurrent: () => assertion?.(),
		checks: [],
		nativeSource: assertion?.nativeSource,
		opaqueCommitGuard: assertion?.opaqueCommitGuard
	};
}
/** Bootstrap grants consume prepared liveness, never opaque or native source reads. */
function assertPreparedSessionSourceCurrent(source) {
	if (source.assertPreparedCurrent) source.assertPreparedCurrent();
	else if (!source.nativeSource) source.assertCurrent();
}
async function prepareSessionSourceScope(assertion) {
	return assertion?.prepareSessionSourceScope?.();
}
/** A fence owns its live source predicates until all work inside that scope settles. */
async function runWithSessionSourceScope(assertion, run, options = {}) {
	const prepared = assertion?.prepareSessionSourceScope ? await prepareSessionSourceScope(assertion) : void 0;
	if (!assertion || !prepared) {
		assertion?.assertScopeCurrent?.();
		const result = await run();
		if (options.checkAfter !== false) assertion?.assertScopeCurrent?.();
		return result;
	}
	const scopes = new Map([...sessionSourceScopes.getStore() ?? [], ...prepared.scopedSources ?? []]);
	scopes.set(assertion, prepared);
	const errors = [];
	try {
		return await sessionSourceScopes.run(scopes, async () => {
			(prepared.assertPreparedCurrent ?? prepared.assertCurrent)();
			const result = await run();
			if (options.checkAfter !== false) (prepared.assertPreparedCurrent ?? prepared.assertCurrent)();
			return result;
		});
	} catch (error) {
		errors.push(error);
		throw error;
	} finally {
		await releaseSessionSourceAuthorities([prepared], errors);
	}
}
/** A live selector may advance between operations, never during one prepared write. */
function createDynamicSessionSourceAssertion(select, refuse) {
	const prepareSelected = (prepare) => {
		const selected = select();
		return prepare(composeSessionSourceAssertion([selected], (assertSource) => {
			if (select() !== selected) refuse();
			assertSource();
		}));
	};
	const assertion = Object.assign(() => {
		const scoped = sessionSourceScopes.getStore()?.get(assertion);
		return scoped ? scoped.assertCurrent() : select()?.();
	}, {
		onSessionCompactionCommitted: (transition, entry) => select()?.onSessionCompactionCommitted?.(transition, entry),
		prepareSessionSource: () => prepareSelected(prepareSessionSourceAuthority),
		prepareSessionSourceScope: () => prepareSelected(prepareSessionSourceScope)
	});
	return Object.defineProperty(assertion, "nativeSource", {
		enumerable: true,
		get: () => select()?.nativeSource
	});
}
/** Preserve each owner's error/lifetime wrapper while preparing its storage-dependent sources. */
function composeSessionSourceAssertion(sources, check = (assertSources) => assertSources(), options) {
	async function prepare(scoped = false) {
		const prepared = [];
		const scopedSources = /* @__PURE__ */ new Map();
		const release = () => releaseSessionSourceAuthorities(prepared);
		const assertPreparedSources = () => {
			for (const source of prepared) assertPreparedSessionSourceCurrent(source);
		};
		try {
			for (const source of sources) {
				const value = scoped ? await prepareSessionSourceScope(source) : await prepareSessionSourceAuthority(source);
				if (scoped && value && source) {
					for (const [assertion, nested] of value.scopedSources ?? []) scopedSources.set(assertion, nested);
					scopedSources.set(source, value);
				}
				prepared.push(value ?? {
					assertCurrent: () => source?.(),
					...scoped ? { assertPreparedCurrent: () => source?.assertScopeCurrent?.() } : {},
					checks: [],
					nativeSource: source?.nativeSource,
					opaqueCommitGuard: source?.opaqueCommitGuard
				});
			}
			if (scoped && scopedSources.size === 0) return;
			return {
				nativeSource: prepared.some((source) => source.nativeSource),
				opaqueCommitGuard: prepared.some((source) => source.opaqueCommitGuard),
				hasOpaqueCheck: options?.hasOpaqueCheck || prepared.some((source) => source.hasOpaqueCheck),
				assertCurrent: () => check(() => prepared.forEach((source) => source.assertCurrent())),
				assertPreparedCurrent: () => (options?.preparedCheck ?? check)(assertPreparedSources),
				...scoped ? { scopedSources } : {},
				checks: prepared.flatMap((source, index) => source.checks.map(({ refuse, ...preparedCheck }) => ({
					...preparedCheck,
					refuse: (facts) => {
						check(() => {
							prepared.slice(0, index).forEach((previous) => previous.assertCurrent());
							refuse(facts);
						});
						throw new Error("Source authority refusal was suppressed");
					}
				}))),
				release
			};
		} catch (error) {
			let failure = error;
			try {
				(scoped ? options?.preparedCheck ?? check : check)(() => {
					if (scoped) assertPreparedSources();
					else prepared.forEach((source) => source.assertCurrent());
					throw error;
				});
			} catch (translatedError) {
				failure = translatedError;
			}
			await releaseSessionSourceAuthorities(prepared, [failure]);
			throw failure;
		}
	}
	const assertion = Object.assign(() => {
		const scoped = sessionSourceScopes.getStore()?.get(assertion);
		return scoped ? scoped.assertCurrent() : check(() => sources.forEach((source) => source?.()));
	}, {
		onSessionCompactionCommitted: (transition, entry) => {
			for (const source of new Set(sources)) source?.onSessionCompactionCommitted?.(transition, entry);
		},
		prepareSessionSource: () => prepare(),
		prepareSessionSourceScope: () => prepare(true)
	});
	if (sources.some((source) => source?.retain)) Object.assign(assertion, { retain: () => {
		try {
			var _usingCtx$1 = _usingCtx();
			const acquired = _usingCtx$1.u(new DisposableStack());
			for (const source of sources) {
				const release = source?.retain?.();
				if (release) acquired.defer(release);
			}
			const retained = acquired.move();
			return () => retained.dispose();
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} });
	return Object.defineProperty(assertion, "nativeSource", {
		enumerable: true,
		get: () => sources.some((source) => source?.nativeSource)
	});
}
//#endregion
export { captureExternalSessionCommitGuard as a, prepareSessionSourceAuthority as c, runWithSessionSourceScope as d, sessionEntryCommitGuardOptions as f, bindPublishedSessionSourceAdmission as i, prepareSessionSourceScope as l, admitPublishedSessionSource as n, composeSessionSourceAssertion as o, assertPreparedSessionSourceCurrent as r, createDynamicSessionSourceAssertion as s, acceptSessionSourceValidation as t, releaseSessionSourceAuthorities as u };
