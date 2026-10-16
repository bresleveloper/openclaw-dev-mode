//#region extensions/qwen/failover.ts
/** DashScope uses the same quota code for temporary limits and exhausted free credits. */
const classifyQwenFailoverReason = (context) => {
	if (context.status !== 429) return;
	const codes = [context.code, context.errorType].map((code) => code?.trim().toLowerCase());
	if (codes.some((code) => code === "prepaidbilloverdue" || code === "postpaidbilloverdue")) return "billing";
	if (!codes.some((code) => code === "insufficient_quota" || code === "throttling.allocationquota")) return;
	if (/\bfree allocated quota exceeded\b/i.test(context.errorMessage)) return "billing";
	if (/\ballocated quota exceeded, please increase your quota limit\b/i.test(context.errorMessage) || /\byou exceeded your current quota, please check your plan and billing details\b/i.test(context.errorMessage)) return "rate_limit";
};
//#endregion
export { classifyQwenFailoverReason };
