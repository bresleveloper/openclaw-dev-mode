//#region src/cron/types.ts
function isSystemOwnedCronPayloadKind(kind) {
	return kind === "heartbeat";
}
//#endregion
export { isSystemOwnedCronPayloadKind as t };
