//#region src/infra/private-directory-creation.ts
const refusedCreations = /* @__PURE__ */ new WeakSet();
/** Record a completed native refusal without replacing its code, errno, or identity. */
function markPrivateDirectoryCreationRefused(error) {
	if (error !== null && typeof error === "object") refusedCreations.add(error);
	return error;
}
function isPrivateDirectoryCreationRefused(error) {
	return error !== null && typeof error === "object" && refusedCreations.has(error);
}
//#endregion
export { markPrivateDirectoryCreationRefused as n, isPrivateDirectoryCreationRefused as t };
