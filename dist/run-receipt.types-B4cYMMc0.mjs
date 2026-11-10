//#region src/cron/store/run-receipt.types.ts
var CronRunReceiptRevisionError = class extends Error {
	constructor(receiptId, message = "cron run configuration changed", reason = "revision-changed") {
		super(message);
		this.receiptId = receiptId;
		this.reason = reason;
		this.name = "CronRunReceiptRevisionError";
	}
};
//#endregion
export { CronRunReceiptRevisionError as t };
