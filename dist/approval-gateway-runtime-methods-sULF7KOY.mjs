//#region src/infra/approval-gateway-runtime-methods.ts
const GATEWAY_NATIVE_APPROVAL_METHODS = [
	"approval.resolve",
	"exec.approval.get",
	"exec.approval.list",
	"exec.approval.resolve",
	"plugin.approval.list",
	"plugin.approval.resolve",
	"openclaw.approval.list"
];
const gatewayNativeApprovalMethods = new Set(GATEWAY_NATIVE_APPROVAL_METHODS);
function isGatewayNativeApprovalMethod(method) {
	return gatewayNativeApprovalMethods.has(method);
}
const gatewayWorkerApprovalMethods = /* @__PURE__ */ new Set([
	...GATEWAY_NATIVE_APPROVAL_METHODS,
	"approval.get",
	"approval.history",
	"exec.approval.request",
	"exec.approval.waitDecision",
	"exec.approval.grants.list",
	"exec.approval.grants.revoke",
	"plugin.approval.request",
	"plugin.approval.waitDecision"
]);
function isGatewayWorkerApprovalMethod(method) {
	return gatewayWorkerApprovalMethods.has(method);
}
//#endregion
export { isGatewayNativeApprovalMethod as n, isGatewayWorkerApprovalMethod as r, GATEWAY_NATIVE_APPROVAL_METHODS as t };
