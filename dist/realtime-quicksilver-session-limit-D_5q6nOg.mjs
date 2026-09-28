//#region extensions/openai/realtime-quicksilver-session-limit.ts
const OPENAI_QUICKSILVER_MAX_SESSIONS = 8;
const REALTIME_MAX_SESSIONS_PER_OWNER = 2;
const reservations = /* @__PURE__ */ new Map();
function reserveOpenAIQuicksilverSession(owner, opts) {
	const now = Date.now();
	for (const [reservedOwner, { expiresAtMs }] of reservations) if (expiresAtMs !== void 0 && expiresAtMs <= now) reservations.delete(reservedOwner);
	const existing = reservations.get(owner);
	if (existing) {
		existing.expiresAtMs = opts?.expiresAtMs;
		return;
	}
	if (opts?.ownerConnId && Array.from(reservations.values()).filter((entry) => entry.ownerConnId === opts.ownerConnId).length >= REALTIME_MAX_SESSIONS_PER_OWNER) throw new Error("Too many concurrent OpenAI realtime sessions for this client");
	if (reservations.size >= OPENAI_QUICKSILVER_MAX_SESSIONS) throw new Error("Too many concurrent OpenAI GPT-Live sessions; try again in a minute");
	reservations.set(owner, { ...opts });
}
function releaseOpenAIQuicksilverSession(owner) {
	reservations.delete(owner);
}
//#endregion
export { reserveOpenAIQuicksilverSession as n, releaseOpenAIQuicksilverSession as t };
