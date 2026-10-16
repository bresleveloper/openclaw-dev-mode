import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as updateFailureSchema } from "./triage-update-CAZSHikj.mjs";
//#region src/infra/update-repair-protocol.ts
const updateRepairBudgetSchema = object({
	maxTurns: number().int().nonnegative().default(3),
	wallClockMs: number().int().positive().max(2147483647).default(6e5),
	perTurnMs: number().int().positive().max(2147483647).default(3e5),
	maxToolCalls: number().int().nonnegative().default(40)
});
const updateRepairValidationSchema = object({
	ok: boolean(),
	score: number().finite(),
	summary: string(),
	stopReason: string().max(1024).optional()
});
const text = string().max(1024);
const wireValidation = updateRepairValidationSchema.extend({ summary: text });
const status = _enum([
	"repaired",
	"improved",
	"unrepaired",
	"unavailable",
	"aborted"
]);
const turn = number().int().positive();
const attempt = object({
	turn,
	model: text,
	provider: text,
	durationMs: number().nonnegative(),
	toolCalls: number().int().nonnegative(),
	validation: wireValidation,
	summary: text
});
const event = discriminatedUnion("type", [
	object({
		type: literal("route-selected"),
		model: text,
		provider: text
	}),
	object({
		type: literal("turn-started"),
		turn,
		model: text,
		provider: text
	}),
	attempt.extend({ type: literal("turn-finished") }),
	object({
		type: literal("validation"),
		turn: number().int().nonnegative(),
		validation: wireValidation
	}),
	object({
		type: literal("stopped"),
		status,
		reason: text.optional()
	})
]);
const repairTarget = object({
	stateDir: string(),
	configPath: string(),
	workspaceDir: string(),
	installRoot: string(),
	environment: record(string(), string().optional()).optional()
});
const requester = object({
	channel: text.optional(),
	accountId: text.optional(),
	senderId: text.optional(),
	authorizationSource: text.optional()
}).optional();
const turnResult = discriminatedUnion("status", [object({
	status: literal("completed"),
	model: text,
	provider: text,
	toolCalls: number().int().nonnegative(),
	summary: text,
	timedOut: boolean()
}), object({
	status: _enum(["unavailable", "aborted"]),
	reason: text
})]);
discriminatedUnion("type", [
	object({
		type: literal("ready"),
		candidateRehearsal: literal(true).optional(),
		repairTurns: literal(true).optional(),
		executorDelegation: literal("pid-start-v1").optional()
	}),
	object({
		type: literal("turn-result"),
		result: turnResult
	}),
	object({
		type: literal("validate"),
		id: turn
	}),
	object({
		type: literal("cancel-validation"),
		id: turn
	}),
	object({
		type: literal("event"),
		event
	}),
	object({
		type: literal("result"),
		result: object({
			status,
			attempts: array(attempt),
			finalValidation: wireValidation,
			reason: text.optional()
		})
	})
]);
const updateRepairParentMessageSchema = discriminatedUnion("type", [
	object({
		type: literal("start"),
		runId: text.optional(),
		requester,
		target: repairTarget,
		failure: updateFailureSchema,
		context: object({
			phase: _enum(["validating", "verifying"]).optional(),
			beforeVersion: text.optional(),
			targetVersion: text.optional(),
			symptoms: array(text).max(20).optional()
		}),
		budget: updateRepairBudgetSchema
	}),
	object({
		type: literal("turn"),
		runId: text.min(1),
		requester,
		target: repairTarget,
		executor: record(string(), unknown()),
		prompt: string().max(8192),
		wallClockMs: updateRepairBudgetSchema.shape.wallClockMs,
		timeoutMs: updateRepairBudgetSchema.shape.perTurnMs,
		maxToolCalls: updateRepairBudgetSchema.shape.maxToolCalls
	}),
	object({
		type: literal("validation-result"),
		id: turn,
		validation: wireValidation
	}),
	object({
		type: literal("validation-error"),
		id: turn,
		reason: text
	}),
	object({
		type: literal("cancel"),
		reason: text
	})
]);
const UPDATE_REPAIR_IPC_MAX_BYTES = 65536;
//#endregion
export { updateRepairValidationSchema as i, updateRepairBudgetSchema as n, updateRepairParentMessageSchema as r, UPDATE_REPAIR_IPC_MAX_BYTES as t };
