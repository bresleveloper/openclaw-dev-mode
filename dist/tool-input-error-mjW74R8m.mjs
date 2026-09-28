//#region src/agents/tool-input-error.ts
const trustedToolInputErrors = /* @__PURE__ */ new WeakSet();
var ToolInputError = class extends Error {
	constructor(message) {
		super(message);
		this.status = 400;
		this.name = "ToolInputError";
		trustedToolInputErrors.add(this);
	}
};
var ToolAuthorizationError = class extends ToolInputError {
	constructor(message) {
		super(message);
		this.status = 403;
		this.name = "ToolAuthorizationError";
	}
};
function isTrustedToolInputError(error) {
	return typeof error === "object" && error !== null && trustedToolInputErrors.has(error);
}
//#endregion
export { ToolInputError as n, isTrustedToolInputError as r, ToolAuthorizationError as t };
