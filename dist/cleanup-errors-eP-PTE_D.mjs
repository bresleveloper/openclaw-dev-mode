//#region src/node-host/cleanup-errors.ts
/** Preserve a sole cleanup failure; aggregate independent failures without changing their order. */
function throwNodeHostCleanupErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, message);
}
//#endregion
export { throwNodeHostCleanupErrors as t };
