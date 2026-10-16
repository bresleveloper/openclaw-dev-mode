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
//#endregion
export { isGatewayNativeApprovalMethod as n, GATEWAY_NATIVE_APPROVAL_METHODS as t };
