import { $ as ZodPipe, Et as _enum, Fn as object, G as ZodNever, I as ZodIntersection, Jn as string, Lt as boolean, Pn as number, Un as record, Z as ZodObject, it as ZodRecord, n as ZodArray, sr as unknown, vt as ZodUnion } from "./schemas-BOYIvvln.mjs";
import { c as isSecretRef, p as isValidSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CR94ndkx.mjs";
import { t as configUiMetadata } from "./zod-schema.sensitive-3bxjhHYT.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
//#region src/config/schema.walk.ts
/** Visit schema wrappers and their fields in config path order, preserving array/wildcard paths. */
function walkConfigSchema(schema, path, visit) {
	const walk = (node, fieldPath) => {
		let current = node;
		while (true) {
			visit(current, fieldPath);
			if (!isUnwrappable(current)) break;
			current = current.unwrap();
		}
		if (current instanceof ZodPipe) walk(current.out, fieldPath);
		else if (current instanceof ZodObject) {
			for (const key in current.shape) walk(current.shape[key], fieldPath ? `${fieldPath}.${key}` : key);
			const catchall = current.def.catchall;
			if (catchall && !(catchall instanceof ZodNever)) walk(catchall, fieldPath ? `${fieldPath}.*` : "*");
		} else if (current instanceof ZodArray) walk(current.element, fieldPath ? `${fieldPath}[]` : "[]");
		else if (current instanceof ZodRecord) walk(current.def.valueType, fieldPath ? `${fieldPath}.*` : "*");
		else if (current instanceof ZodUnion) for (const option of current.options) walk(option, fieldPath);
		else if (current instanceof ZodIntersection) {
			walk(current.def.left, fieldPath);
			walk(current.def.right, fieldPath);
		}
	};
	walk(schema, path);
}
function isUnwrappable(schema) {
	return "unwrap" in schema && typeof schema.unwrap === "function" && !(schema instanceof ZodArray);
}
//#endregion
//#region src/config/schema.field-metadata.ts
/** Derive documented paths from the schema instead of maintaining a second field inventory. */
function projectConfigFieldMetadata(schema, path) {
	const labels = {};
	const help = {};
	walkConfigSchema(schema, path, (fieldSchema, fieldPath) => {
		const metadata = configUiMetadata.get(fieldSchema);
		if (typeof metadata?.label === "string") labels[fieldPath] ??= metadata.label;
		if (typeof metadata?.help === "string") help[fieldPath] ??= metadata.help;
	});
	return {
		labels,
		help
	};
}
//#endregion
//#region src/config/zod-schema.cloud-workers.ts
function validateCloudWorkerProfileSettings(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value) || !isPluginJsonValue(value)) return "Worker profile settings must be bounded finite JSON";
	const visit = (entry) => {
		if (Array.isArray(entry)) return entry.map(visit).find((error) => error !== void 0);
		if (typeof entry !== "object" || entry === null) return;
		for (const [key, child] of Object.entries(entry)) {
			const baseKey = key.replace(/ref$/i, "");
			if (key.toLowerCase() === "keyref" || isSensitiveConfigPath(key) || baseKey !== key && isSensitiveConfigPath(baseKey)) {
				if (!isSecretRef(child) || !isValidSecretRef(child)) return `Worker profile ${key} must use a SecretRef`;
				continue;
			}
			const error = visit(child);
			if (error) return error;
		}
	};
	return visit(value);
}
const CloudWorkerSettingsSchema = record(string(), unknown()).superRefine((value, ctx) => {
	const message = validateCloudWorkerProfileSettings(value);
	if (message) ctx.addIssue({
		code: "custom",
		message
	});
});
const CloudWorkerProfileShape = {
	provider: string().trim().min(1).register(configUiMetadata, {
		label: "Cloud Worker Provider",
		help: "Worker provider id registered by a plugin. The configured plugin must expose this id before the gateway can provision environments from the profile."
	}),
	install: _enum(["bundle", "npm"]).optional().default("bundle").register(configUiMetadata, {
		label: "Cloud Worker Install Method",
		help: "Worker installation method: \"bundle\" (default) transfers the gateway's content-hashed installed build and supports released, development, and unreleased versions; \"npm\" installs the exact gateway version and is available only when that version is released."
	}),
	suspendAfter: string().refine((value) => {
		try {
			return /(?:ms|s|m|h|d)$/i.test(value) && parseDurationMs(value) >= 6e4;
		} catch {
			return false;
		}
	}, "Worker profile suspendAfter must be a duration of at least 1m").optional().register(configUiMetadata, {
		label: "Cloud Worker Idle Suspend Duration",
		help: "Automatically reclaims an idle cloud worker after this duration, such as 45m or 2h; the next message provisions a replacement. Minimum: 1m. Leave unset to keep workers running."
	}),
	readyWorkers: number().int().nonnegative().optional().register(configUiMetadata, {
		label: "Cloud Worker Ready Reserve Target",
		help: "Target unassigned prepared workers per eligible project using this profile (default: 1), subject to the Gateway-wide prepared pool cap. Set 0 to disable this profile's reserves while preserving snapshot reuse. Preparing workers and unconfirmed reserve cleanup count toward the target."
	}),
	settings: CloudWorkerSettingsSchema.optional().register(configUiMetadata, {
		label: "Cloud Worker Provider Settings",
		help: "Provider-owned settings validated by the selected plugin. Use SecretRef objects for secret-bearing values; opaque settings do not gain automatic secret resolution."
	})
};
const CloudWorkerProfileSchema = object(CloudWorkerProfileShape).strict().register(configUiMetadata, {
	label: "Cloud Worker Profile",
	help: "One cloud worker profile selected by name when creating an environment. Keep provider credentials in supported references rather than embedding secret material in this block."
});
const CloudWorkerProfileIdSchema = string().min(1).refine((value) => value === value.trim(), "Worker profile ids must not contain outer whitespace");
const CloudWorkerProjectKeySchema = string().min(1).refine((value) => normalizeCloudRepo(`https://${value}`) === value, "Project profile keys must use lowercase host/owner/repo identities without trailing .git");
const CloudWorkerProjectProfileSchema = CloudWorkerProfileIdSchema.register(configUiMetadata, {
	label: "Cloud Worker Project Profile",
	help: "Cloud worker profile name used by default when a session worktree's origin matches this repository identity."
});
const CloudWorkerPreparedPoolShape = { maxTotal: number().int().nonnegative().optional().register(configUiMetadata, {
	label: "Cloud Worker Ready Reserve Cap",
	help: "Gateway-wide cap on unassigned prepared cloud workers across projects and profiles (default: 4). Preparing workers and unconfirmed reserve cleanup count toward the cap. Set 0 to drain unassigned reserves and disable replenishment while preserving snapshot reuse and active sessions."
}) };
const CloudWorkersConfigShape = {
	desktop: boolean().optional().register(configUiMetadata, {
		label: "Cloud Worker Desktop (Labs)",
		help: "Enables the experimental worker.desktop.observe surface and Control UI Desktop panel for desktop-capable cloud worker environments."
	}),
	preparedPool: object(CloudWorkerPreparedPoolShape).strict().optional().register(configUiMetadata, {
		label: "Cloud Worker Prepared Pool",
		help: "Limits for prepared cloud workers kept ready for later sessions. Reserves incur running-machine charges until provider cleanup completes; their fixed expiry follows actual project demand and the provider's existing idle policy."
	}),
	projectProfiles: record(CloudWorkerProjectKeySchema, CloudWorkerProjectProfileSchema).optional().register(configUiMetadata, {
		label: "Cloud Worker Project Profiles",
		help: "Default cloud worker profile names keyed by normalized lowercase repository identity (host/owner/repo). Explicit dispatch profile ids take precedence."
	}),
	profiles: record(CloudWorkerProfileIdSchema, CloudWorkerProfileSchema).optional().register(configUiMetadata, {
		label: "Cloud Worker Profiles",
		help: "Named cloud worker profiles. Each profile selects a worker provider registered by a plugin and carries provider-owned settings."
	})
};
const CloudWorkersConfigSchema = object(CloudWorkersConfigShape).strict().optional();
const { labels: CLOUD_WORKER_FIELD_LABELS, help: CLOUD_WORKER_FIELD_HELP } = projectConfigFieldMetadata(CloudWorkersConfigSchema, "cloudWorkers");
//#endregion
export { projectConfigFieldMetadata as a, validateCloudWorkerProfileSettings as i, CLOUD_WORKER_FIELD_LABELS as n, walkConfigSchema as o, CloudWorkersConfigSchema as r, CLOUD_WORKER_FIELD_HELP as t };
