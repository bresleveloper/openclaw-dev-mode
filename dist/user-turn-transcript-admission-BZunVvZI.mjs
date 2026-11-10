//#region src/sessions/user-turn-transcript-admission.ts
const admissionOwners = /* @__PURE__ */ new WeakMap();
function registerUserTurnTranscriptAdmissionOwner(recorder, owner) {
	admissionOwners.set(recorder, owner);
}
function getUserTurnTranscriptAdmissionOwner(recorder) {
	return admissionOwners.get(recorder);
}
function bindUserTurnPromptReactionSource(recorder, source) {
	const owner = admissionOwners.get(recorder);
	if (!owner) throw new Error("Prompt reaction source requires its native recorder owner");
	owner.promptReactionSource = source;
}
function readUserTurnPromptReactionSource(recorder) {
	return recorder ? admissionOwners.get(recorder)?.promptReactionSource : void 0;
}
/** Collection carries only same-session authenticated custody, never runner defaults. */
function inheritUserTurnPromptReactionSource(recorder, sources) {
	if (!sources?.length) return;
	const inherited = [];
	for (const sourceRecorder of sources) {
		const source = readUserTurnPromptReactionSource(sourceRecorder);
		if (!source) return;
		inherited.push(source);
	}
	const latest = inherited.at(-1);
	if (!latest || inherited.some((source) => source.agentId !== latest.agentId || source.sessionKey !== latest.sessionKey)) return;
	bindUserTurnPromptReactionSource(recorder, {
		...latest,
		prepare: async () => {
			await Promise.all(inherited.flatMap((source) => source.prepare ? [source.prepare()] : []));
		},
		assertCurrent: () => inherited.forEach((source) => source.assertCurrent())
	});
}
function readWithdrawnUserTurnInputId(recorder) {
	return recorder && admissionOwners.get(recorder)?.withdrawnInputId();
}
/** Snapshot only the factory-owned input that has not crossed its foreground model boundary. */
function readPendingUserTurnTranscriptAdmission(recorder) {
	const owner = recorder ? admissionOwners.get(recorder) : void 0;
	if (!owner || owner.blocked() || owner.sentToProvider()) return;
	const receipt = owner.receipt();
	return receipt ? { ...receipt } : void 0;
}
//#endregion
export { readUserTurnPromptReactionSource as a, readPendingUserTurnTranscriptAdmission as i, getUserTurnTranscriptAdmissionOwner as n, readWithdrawnUserTurnInputId as o, inheritUserTurnPromptReactionSource as r, registerUserTurnTranscriptAdmissionOwner as s, bindUserTurnPromptReactionSource as t };
