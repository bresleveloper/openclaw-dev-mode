//#region src/config/sessions/goals-operations.types.ts
const SESSION_GOAL_OPERATION_ERROR_CODES = [
	"expired",
	"operation-conflict",
	"session-rebound",
	"goal-rebound",
	"capacity",
	"receipt-invalid",
	"invalid"
];
var SessionGoalOperationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SessionGoalOperationError";
	}
};
//#endregion
export { SessionGoalOperationError as n, SESSION_GOAL_OPERATION_ERROR_CODES as t };
