import path from "node:path";
//#region src/daemon/systemd-unit-load-paths.ts
/** Paths systemd can load user and system units from. */
const DEFAULT_SYSTEMD_SYSTEM_UNIT_DIRS = [
	"/etc/systemd/system",
	"/usr/lib/systemd/system",
	"/lib/systemd/system"
];
function resolveSystemdUnitLoadPaths(env, home, uid) {
	const runtimeRoots = [...new Set([uid === void 0 ? void 0 : `/run/user/${uid}`, env.XDG_RUNTIME_DIR].filter((value) => Boolean(value)))];
	const configHome = env.XDG_CONFIG_HOME || path.posix.join(home, ".config");
	const dataHome = env.XDG_DATA_HOME || path.posix.join(home, ".local/share");
	const userRoots = [
		path.posix.join(home, ".config"),
		configHome,
		dataHome,
		...(env.XDG_CONFIG_DIRS || "/etc/xdg").split(":"),
		...(env.XDG_DATA_DIRS || "/usr/local/share:/usr/share").split(":"),
		"/etc",
		"/run",
		"/usr/local/lib",
		"/usr/lib",
		"/lib"
	];
	return {
		runtimeRoots,
		userRoots: [...new Set(userRoots)],
		systemRoots: [
			"/etc",
			"/run",
			"/usr/local/lib",
			"/usr/lib",
			"/lib"
		]
	};
}
function resolveSystemdUnitLoadDirectories(env, home, uid) {
	const { runtimeRoots, userRoots, systemRoots } = resolveSystemdUnitLoadPaths(env, home, uid);
	const roots = [
		...runtimeRoots,
		...userRoots,
		...systemRoots
	];
	const unitDirs = (sources, kinds) => sources.filter((root) => path.posix.isAbsolute(root)).flatMap((root) => kinds.map((kind) => path.posix.join(root, "systemd", kind)));
	const generatedDirs = (sources) => unitDirs(sources, [
		"transient",
		"generator.early",
		"generator",
		"generator.late"
	]);
	return {
		userDirs: [...unitDirs([.../* @__PURE__ */ new Set([...runtimeRoots, ...userRoots])], [
			"user",
			"user.control",
			"user.attached"
		]), ...generatedDirs(runtimeRoots)],
		systemDirs: [...unitDirs(systemRoots, [
			"system",
			"system.control",
			"system.attached"
		]), ...generatedDirs(["/run"])],
		complete: uid !== void 0 && !env.SYSTEMD_UNIT_PATH && roots.every(path.posix.isAbsolute)
	};
}
//#endregion
export { resolveSystemdUnitLoadDirectories as n, resolveSystemdUnitLoadPaths as r, DEFAULT_SYSTEMD_SYSTEM_UNIT_DIRS as t };
