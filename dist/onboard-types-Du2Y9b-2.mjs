//#region src/commands/onboard-types.ts
const NODE_MANAGER_CHOICES = [
	"npm",
	"pnpm",
	"bun"
];
const ONBOARD_FLOWS = [
	"quickstart",
	"advanced",
	"manual",
	"import"
];
function isNodeManagerChoice(value) {
	return NODE_MANAGER_CHOICES.some((choice) => choice === value);
}
function isOnboardFlow(value) {
	return ONBOARD_FLOWS.some((flow) => flow === value);
}
//#endregion
export { isOnboardFlow as n, isNodeManagerChoice as t };
