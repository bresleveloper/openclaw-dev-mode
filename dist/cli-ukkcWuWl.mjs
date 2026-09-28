import { t as mutateConfigFile } from "./mutate-CdmDoEFy.mjs";
import "./config-mutation-CCgack0N.mjs";
import { n as createChannelPairingController } from "./channel-pairing-xxFGpirY.mjs";
import { a as parseReefRelayUrl, n as ReefChannelConfigSchema } from "./config-schema-CDfLULtN.mjs";
import { C as generateAndStoreKeys, F as clearReefSetupSession, H as reserveReefIdentityBinding, I as finalizeReefIdentityBinding, L as loadReefIdentityBinding, P as assertReefIdentityBinding, R as loadReefSetupSession, U as saveReefSetupSession, V as releaseReefIdentityReservation, l as openReefTrustStore, ot as fingerprint, w as loadKeys } from "./doctor-state-paths-DpN9dGtt.mjs";
import { d as isReefOwnershipRejection, n as assertLegacyReefKeysMigrated, r as ReefFriendManager, s as ReefTransportClient, u as isDefinitiveReefRegistrationFailure } from "./legacy-key-guard-B3TGaYxU.mjs";
import { t as ReefAutonomySchema } from "./friend-types-DKK2gCV4.mjs";
import { i as getReefRuntime } from "./runtime-CEUOPcIW.mjs";
//#region extensions/reef/src/cli.ts
const HANDLE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,62}$/;
const GUARD_DEFAULTS = {
	openai: {
		pinnedModel: "gpt-5.6-terra",
		apiKeyEnv: "REEF_GUARD_OPENAI_KEY"
	},
	anthropic: {
		pinnedModel: "claude-haiku-4-5-20251001",
		apiKeyEnv: "REEF_GUARD_ANTHROPIC_KEY"
	}
};
function emit(output, payload, lines) {
	if (output.json) {
		process.stdout.write(`${JSON.stringify(payload)}\n`);
		return;
	}
	for (const line of lines) process.stdout.write(`${line}\n`);
}
async function fail(output, message) {
	const stream = output.json ? process.stdout : process.stderr;
	const text = output.json ? `${JSON.stringify({ error: message })}\n` : `${message}\n`;
	await new Promise((resolve) => {
		stream.write(text, () => resolve());
	});
	process.exit(1);
}
function reefCliAction(run) {
	return async (...args) => {
		const optionsIndex = args.length - 2;
		const options = args[optionsIndex];
		const positional = args.slice(0, optionsIndex);
		const output = { json: options.json };
		try {
			await run(output, options, ...positional);
		} catch (error) {
			await fail(output, error instanceof Error ? error.message : String(error));
		}
	};
}
async function loadOrCreateKeys(createMissing, legacyStateDir) {
	const runtime = getReefRuntime();
	try {
		return await loadKeys(runtime);
	} catch (error) {
		if (createMissing && error.code === "ENOENT") {
			await assertLegacyReefKeysMigrated(legacyStateDir);
			return await generateAndStoreKeys(runtime);
		}
		throw error;
	}
}
function currentReefConfig() {
	const raw = getReefRuntime().config.current().channels?.reef;
	if (!raw) return;
	const parsed = ReefChannelConfigSchema.safeParse(raw);
	return parsed.success ? parsed.data : void 0;
}
async function loadConfiguredManager(output) {
	const config = currentReefConfig();
	if (!config?.handle) return await fail(output, "Reef is not configured. Run `openclaw reef register` first.");
	const keys = await loadOrCreateKeys(false);
	const runtime = getReefRuntime();
	const relayUrl = parseReefRelayUrl(config.relayUrl);
	await assertReefIdentityBinding(runtime, {
		handle: config.handle,
		relayUrl
	});
	const transport = new ReefTransportClient(relayUrl, config.handle, keys);
	const pairing = createChannelPairingController({
		core: runtime,
		channel: "reef",
		accountId: "default"
	});
	return {
		config,
		keys,
		manager: new ReefFriendManager(transport, openReefTrustStore(runtime, config), {
			list: pairing.readAllowFromStore,
			remove: async (peer) => {
				return (await pairing.removeAllowFromStoreEntry(peer)).changed;
			}
		})
	};
}
async function writeReefRegistration(candidate) {
	await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate(draft) {
			draft.channels = {
				...draft.channels,
				reef: candidate
			};
		}
	});
}
async function writeReefMigrationStateDir(stateDir) {
	await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate(draft) {
			const existing = draft.channels?.reef;
			draft.channels = {
				...draft.channels,
				reef: {
					...existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {},
					stateDir
				}
			};
		}
	});
}
async function runRegister(output, options) {
	if (!options.email.includes("@")) return await fail(output, "A valid --email is required.");
	const provider = options.guardProvider;
	const guardDefaults = GUARD_DEFAULTS[provider];
	if (!guardDefaults) return await fail(output, "--guard-provider must be one of: anthropic, openai.");
	const relayUrl = parseReefRelayUrl(options.relay);
	const legacyStateDir = options.stateDir ?? currentReefConfig()?.stateDir;
	const explicitHandle = options.handle?.toLowerCase();
	const runtime = getReefRuntime();
	const identity = await loadReefIdentityBinding(runtime);
	if (identity?.handle && (identity.relayUrl !== relayUrl || explicitHandle !== void 0 && identity.handle !== explicitHandle)) return await fail(output, `This OpenClaw state already holds the Reef identity @${identity.handle} on ${identity.relayUrl}. Re-register the same handle and relay.`);
	const requestedHandle = explicitHandle ?? identity?.handle;
	let keys;
	try {
		keys = await loadOrCreateKeys(true, legacyStateDir);
	} catch (error) {
		if (options.stateDir && error.code === "REEF_LEGACY_KEYS_PENDING") try {
			await writeReefMigrationStateDir(options.stateDir);
		} catch (writeError) {
			throw new Error("Failed to save the Reef legacy state directory for Doctor", { cause: writeError });
		}
		throw error;
	}
	const bootstrap = new ReefTransportClient(relayUrl, requestedHandle ?? "pending", keys);
	const stored = await loadReefSetupSession(runtime);
	const token = options.token?.trim();
	const storedSession = !options.session?.trim() && stored?.relayUrl === relayUrl && stored?.email === options.email ? stored.session : void 0;
	const session = options.session?.trim() || storedSession;
	if (!session && !token) {
		const started = await bootstrap.authStart(options.email);
		emit(output, {
			status: "email_sent",
			email: options.email,
			...started.magicLink ? { magicLink: started.magicLink } : {},
			next: "Open the magic link, copy the token from the URL fragment, then rerun the exact same command with --token <token> added (or --session from the welcome page)."
		}, [
			`Sign-in link sent to ${options.email}.`,
			...started.magicLink ? [`Development magic link: ${started.magicLink}`] : [],
			"Open the link, copy the token from the URL fragment, then rerun the exact",
			"same command with --token <token> added."
		]);
		return;
	}
	const handle = requestedHandle;
	if (!handle || !HANDLE_PATTERN.test(handle)) return await fail(output, "A valid --handle is required (lowercase letters, digits, - or _).");
	const guard = {
		provider,
		pinnedModel: options.guardModel ?? guardDefaults.pinnedModel,
		apiKeyEnv: options.guardEnv ?? guardDefaults.apiKeyEnv,
		policyVersion: options.guardPolicy,
		timeoutMs: 3e4
	};
	const provisional = {
		enabled: true,
		relayUrl,
		handle,
		email: options.email,
		requestPolicy: options.policy,
		...legacyStateDir ? { stateDir: legacyStateDir } : {},
		guard
	};
	ReefChannelConfigSchema.parse(provisional);
	const reservation = await reserveReefIdentityBinding(runtime, {
		handle,
		relayUrl
	});
	let resolvedSession = session;
	if (!resolvedSession) {
		try {
			resolvedSession = (await bootstrap.authComplete(token ?? "")).session;
		} catch (error) {
			if (isDefinitiveReefRegistrationFailure(error)) await releaseReefIdentityReservation(runtime, reservation);
			else await finalizeReefIdentityBinding(runtime, reservation);
			throw error;
		}
		try {
			await saveReefSetupSession(runtime, {
				session: resolvedSession,
				relayUrl,
				email: options.email
			});
		} catch (error) {
			await releaseReefIdentityReservation(runtime, reservation);
			throw error;
		}
	}
	const transport = new ReefTransportClient(relayUrl, handle, keys);
	let effectivePolicy = options.policy;
	try {
		await transport.createHandle(resolvedSession, options.policy);
	} catch (error) {
		const unavailable = error instanceof Error && error.message.includes("handle_unavailable");
		let owned = false;
		if (unavailable) try {
			await transport.listFriends();
			owned = true;
		} catch (verificationError) {
			if (isReefOwnershipRejection(verificationError)) await releaseReefIdentityReservation(runtime, reservation);
			else await finalizeReefIdentityBinding(runtime, reservation);
			throw verificationError;
		}
		if (!owned) {
			if (isDefinitiveReefRegistrationFailure(error)) await releaseReefIdentityReservation(runtime, reservation);
			else await finalizeReefIdentityBinding(runtime, reservation);
			throw error;
		}
		await finalizeReefIdentityBinding(runtime, reservation);
		const { handles } = await transport.listOwnHandles(resolvedSession);
		const existingHandle = handles.find((entry) => entry.handle === handle);
		if (!existingHandle) return await fail(output, `Handle @${handle} is owned by this claw's keys, but the supplied session belongs to a different relay account. Use a session for the account that registered the handle.`);
		effectivePolicy = existingHandle.request_policy;
	}
	await finalizeReefIdentityBinding(runtime, reservation);
	const candidate = ReefChannelConfigSchema.parse({
		...provisional,
		requestPolicy: effectivePolicy
	});
	try {
		await writeReefRegistration(candidate);
	} catch (error) {
		await fail(output, `Handle @${handle} is claimed, but writing the local config failed: ${error instanceof Error ? error.message : String(error)}. Fix the local issue and rerun the exact same command — the retry reuses the stored session and recognizes the existing claim.`);
	}
	await clearReefSetupSession(runtime);
	const printed = fingerprint(keys.signing.publicKey, keys.encryption.publicKey);
	emit(output, {
		status: "registered",
		handle,
		relayUrl,
		fingerprint: printed
	}, [
		`Registered @${handle} on ${relayUrl}.`,
		`Safety fingerprint (share out of band): ${printed}`,
		"Restart the gateway to connect: openclaw gateway restart"
	]);
}
function registerReefCli({ program }) {
	const reef = program.command("reef").description("Register on a Reef relay and manage guarded claw-to-claw friendships");
	reef.command("register").description("Claim a handle and configure the Reef channel without the wizard").requiredOption("--email <email>", "Owner email registered with the relay").option("--handle <handle>", "Unlisted handle for this claw").option("--session <session>", "Setup session from the relay welcome page").option("--token <token>", "Magic-link token to exchange for a session").option("--relay <url>", "Relay origin URL", "https://reefwire.ai").option("--policy <policy>", "Inbound friend-request policy", "code-only").option("--state-dir <dir>", "Legacy Reef file directory for Doctor import").option("--guard-provider <provider>", "Guard provider (anthropic|openai)", "openai").option("--guard-model <model>", "Immutable guard model id (default depends on provider)").option("--guard-env <name>", "Env var holding the guard API key (default depends on provider)").option("--guard-policy <version>", "Guard policy version", "reef-v1").option("--json", "Emit JSON", false).action(reefCliAction(runRegister));
	reef.command("status").description("Show Reef configuration and relay-side friendships").option("--json", "Emit JSON", false).action(reefCliAction(async (output) => {
		const { config, keys, manager } = await loadConfiguredManager(output);
		const friends = await manager.list();
		const printed = fingerprint(keys.signing.publicKey, keys.encryption.publicKey);
		emit(output, {
			handle: config.handle,
			relayUrl: config.relayUrl,
			requestPolicy: config.requestPolicy,
			guard: {
				provider: config.guard?.provider,
				pinnedModel: config.guard?.pinnedModel
			},
			fingerprint: printed,
			friends: friends.map((friend) => ({
				peer: friend.peer,
				status: friend.status,
				autonomy: friend.autonomy ?? null,
				fingerprint: friend.fingerprint
			}))
		}, [
			`@${config.handle} on ${config.relayUrl} (policy ${config.requestPolicy})`,
			`Guard: ${config.guard?.provider}/${config.guard?.pinnedModel}`,
			`Fingerprint: ${printed}`,
			...friends.map((friend) => `- @${friend.peer}: ${friend.status}${friend.autonomy ? ` (${friend.autonomy})` : ""}`),
			...friends.length === 0 ? ["No friendships yet."] : []
		]);
	}));
	const friend = reef.command("friend").description("Manage Reef friendships");
	friend.command("code").description("Mint a short-lived code a friend can use to request pairing").option("--json", "Emit JSON", false).action(reefCliAction(async (output) => {
		const { manager } = await loadConfiguredManager(output);
		const minted = await manager.mintCode();
		const expires = (/* @__PURE__ */ new Date(minted.expires * 1e3)).toISOString();
		emit(output, {
			code: minted.code,
			expires
		}, [`Friend code: ${minted.code} (expires ${expires})`]);
	}));
	friend.command("autonomy <handle> <tier>").description("Set a trusted friend's autonomy tier").option("--json", "Emit JSON", false).action(reefCliAction(async (output, _options, handle, tier) => {
		const { manager } = await loadConfiguredManager(output);
		const peer = handle.replace(/^@/, "").toLowerCase();
		const autonomy = ReefAutonomySchema.parse(tier);
		await manager.setAutonomy(peer, autonomy);
		emit(output, {
			peer,
			autonomy
		}, [`Set @${peer} autonomy to ${autonomy}.`]);
	}));
	friend.command("request <handle>").description("Request a friendship (adopted automatically once accepted)").option("--code <code>", "Friend code minted by the recipient").option("--json", "Emit JSON", false).action(reefCliAction(async (output, options, handle) => {
		const { manager } = await loadConfiguredManager(output);
		const peer = handle.replace(/^@/, "").toLowerCase();
		const result = await manager.request(peer, options.code);
		emit(output, {
			peer,
			status: result.status
		}, [`Friend request to @${peer}: ${result.status}. Adopted automatically once the peer accepts.`]);
	}));
	friend.command("list").description("List relay-side friendships with local autonomy").option("--json", "Emit JSON", false).action(reefCliAction(async (output) => {
		const { manager } = await loadConfiguredManager(output);
		const friends = await manager.list();
		emit(output, { friends: friends.map((entry) => ({
			peer: entry.peer,
			status: entry.status,
			autonomy: entry.autonomy ?? null,
			keyEpoch: entry.key_epoch,
			fingerprint: entry.fingerprint
		})) }, friends.length ? friends.map((entry) => `@${entry.peer} ${entry.status} epoch=${entry.key_epoch} fingerprint=${entry.fingerprint}${entry.autonomy ? ` autonomy=${entry.autonomy}` : ""}`) : ["No friendships yet."]);
	}));
	friend.command("remove <handle>").description("Remove or block a friendship").option("--json", "Emit JSON", false).action(reefCliAction(async (output, _options, handle) => {
		const { manager } = await loadConfiguredManager(output);
		const peer = handle.replace(/^@/, "").toLowerCase();
		await manager.remove(peer);
		emit(output, {
			peer,
			status: "removed"
		}, [`Removed @${peer}.`]);
	}));
}
//#endregion
export { registerReefCli };
