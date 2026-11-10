import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { s as capturePreparedToolAuthorityReads } from "./host-private-capabilities-eTr803c9.mjs";
import { a as bindMessageInjectionAdmission, o as createLegacyMessageInjectionAuthority } from "./message-injection-authority-Mu3hgByB.mjs";
//#region src/agents/harness/tool-authority-preparation.ts
/** Keep receipt reads out of the compatibility guards shared with question grants. */
function assertLegacyPreparedToolAuthority(preparation, reads) {
	preparation.assertCurrent();
	preparation.compatAssertCurrent();
	for (const read of reads) read.assertLegacyCurrent();
	preparation.assertCurrent();
}
/** Capture while the caller holds FIFO custody; check again at the legacy sink invocation. */
function createLegacyToolAuthorityQueuePreflight(preparation) {
	let reads;
	return {
		prepareQueueMessage: async () => {
			reads = (await capturePreparedToolAuthorityReads(preparation)).reads;
		},
		assertQueueCurrent: () => {
			if (!reads) throw new Error("Legacy message injection requires tool-authority preparation");
			assertLegacyPreparedToolAuthority(preparation, reads);
		}
	};
}
function bindMessageInjectionV2(guarded, assertCurrent, authorityKind, getPreparation, legacy) {
	const assertFinalCurrent = legacy ? createLegacyMessageInjectionAuthority(assertCurrent, legacy.assertQueueCurrent) : assertCurrent;
	return {
		prepareQueueMessage: legacy?.prepareQueueMessage,
		queueMessage: (text, options) => {
			if (getPreparation && guarded.queueMessageAsync) return guarded.queueMessageAsync(text, options, getPreparation(), authorityKind);
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "ReplyBackendMessageInjectionV2.queueMessage",
				replacement: "queueMessageAsync with awaited authority preparation"
			});
			legacy?.assertQueueCurrent();
			return guarded.queueMessage(text, options, assertFinalCurrent, authorityKind);
		},
		claimPendingUserInputAnswer: getPreparation && guarded.claimPendingUserInputAnswerAsync ? (text, options) => guarded.claimPendingUserInputAnswerAsync(text, options, getPreparation(), authorityKind) : guarded.claimPendingUserInputAnswer ? (text, options) => {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "ReplyBackendMessageInjectionV2.claimPendingUserInputAnswer",
				replacement: "claimPendingUserInputAnswerAsync with awaited authority preparation"
			});
			return guarded.claimPendingUserInputAnswer(text, options, assertCurrent, authorityKind);
		} : void 0,
		cancelPendingUserInput: getPreparation && guarded.cancelPendingUserInputAsync ? (resolvedBy) => guarded.cancelPendingUserInputAsync(resolvedBy, getPreparation(), authorityKind) : guarded.cancelPendingUserInput ? (resolvedBy) => {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "ReplyBackendMessageInjectionV2.cancelPendingUserInput",
				replacement: "cancelPendingUserInputAsync with awaited authority preparation"
			});
			return guarded.cancelPendingUserInput(resolvedBy, assertCurrent, authorityKind);
		} : void 0
	};
}
/** Bind the complete preparation to its synchronous effect, including reads added by wrappers. */
function bindPreparedToolAuthority(preparation) {
	bindMessageInjectionAdmission(preparation.prepareCurrent, async (consume) => {
		const captured = await capturePreparedToolAuthorityReads(preparation);
		if (captured.assertCompatibility) {
			assertLegacyPreparedToolAuthority(preparation, captured.reads);
			return consume();
		}
		return withSessionEntriesFromStoresInWorker(captured.reads.flatMap((read) => read.reads), (reads) => {
			preparation.assertCurrent();
			let offset = 0;
			for (const read of captured.reads) {
				read.assertPrepared(reads.slice(offset, offset + read.reads.length));
				offset += read.reads.length;
			}
			preparation.assertCurrent();
			return consume();
		}, { ordered: true });
	});
	return preparation;
}
//#endregion
export { createLegacyToolAuthorityQueuePreflight as i, bindMessageInjectionV2 as n, bindPreparedToolAuthority as r, assertLegacyPreparedToolAuthority as t };
