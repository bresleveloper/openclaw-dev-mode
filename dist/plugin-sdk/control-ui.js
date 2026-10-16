//#region src/plugin-sdk/control-ui-session-link.ts
/** A plugin-owned accessory with the standard header link appearance and direct navigation. */
function createSessionHeaderLink(resolve) {
	return (container, initialContext) => {
		const link = document.createElement("a");
		link.className = "plugin-session-header-link";
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		link.dataset.linkReaderExternal = "";
		let disposed = false;
		const dispose = () => {
			disposed = true;
			link.removeAttribute("href");
			link.remove();
		};
		const update = (context) => {
			if (disposed) return;
			const destination = context.presented && !context.signal.aborted && context.props.session ? resolve(context.props.session) : void 0;
			const url = destination ? URL.parse(destination.url) : null;
			if (!destination || !url || url.protocol !== "https:" && url.protocol !== "http:") {
				link.removeAttribute("href");
				link.remove();
				return;
			}
			link.href = url.href;
			link.textContent = `${destination.label} ↗`;
			if (link.parentNode !== container) container.append(link);
		};
		initialContext.signal.addEventListener("abort", dispose, { once: true });
		update(initialContext);
		return {
			update,
			dispose() {
				initialContext.signal.removeEventListener("abort", dispose);
				dispose();
			}
		};
	};
}
//#endregion
//#region src/plugin-sdk/control-ui.ts
function defineControlUiPlugin(plugin) {
	return plugin;
}
//#endregion
export { createSessionHeaderLink, defineControlUiPlugin };
