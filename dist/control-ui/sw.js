const CACHE_PREFIX = "openclaw-control-";
const EMBEDDED_CACHE_VERSION = "2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z";
const URL_CACHE_VERSION = new URL(self.location.href).searchParams
  .get("v")
  ?.replace(/[^a-zA-Z0-9._-]/g, "-");
const CACHE_VERSION =
  (EMBEDDED_CACHE_VERSION !== "__OPENCLAW_CONTROL_UI_BUILD_ID__"
    ? EMBEDDED_CACHE_VERSION
    : URL_CACHE_VERSION) || "dev";
// Replaced by Vite with generic HTML and its measured, integrity-bound boot graph.
const OFFLINE_BOOT = {"html":"<!doctype html>\n<html data-openclaw-control-ui-build-id=\"2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b\" lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content\"\n    />\n    <title>OpenClaw Control</title>\n    <meta name=\"color-scheme\" content=\"dark light\" />\n    <!-- These mirror the claw theme's --bg tokens for first paint; runtime theme application keeps them synchronized. -->\n    <meta name=\"theme-color\" media=\"(prefers-color-scheme: light)\" content=\"#faf9f7\" />\n    <meta name=\"theme-color\" media=\"(prefers-color-scheme: dark)\" content=\"#0e1015\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"./favicon.svg\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"./favicon-32.png\" />\n    <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"./apple-touch-icon.png\" />\n    <link rel=\"manifest\" href=\"./manifest.webmanifest\" crossorigin=\"use-credentials\" />\n    <script data-cfasync=\"false\">\n      // Configure Zod before module evaluation so its JIT probe cannot violate strict CSP.\n      globalThis.__zod_globalConfig ??= {};\n      globalThis.__zod_globalConfig.jitless = true;\n\n      (function () {\n        var THEMES = {\n          claw: 1,\n          knot: 1,\n          dash: 1,\n          absolutely: 1,\n          tide: 1,\n          beacon: 1,\n          phosphor: 1,\n          crt: 1,\n          manuscript: 1,\n          rose: 1,\n          miami: 1,\n        };\n        var MODES = { system: 1, light: 1, dark: 1 };\n        var LEGACY = {\n          dark: \"claw:dark\",\n          light: \"claw:light\",\n          openknot: \"knot:dark\",\n          fieldmanual: \"dash:dark\",\n          clawdash: \"dash:light\",\n          system: \"claw:system\",\n        };\n        try {\n          var keys = Object.keys(localStorage);\n          var raw;\n          for (var i = 0; i < keys.length; i++) {\n            if (keys[i].indexOf(\"openclaw.control.settings.v1\") === 0) {\n              raw = localStorage.getItem(keys[i]);\n              if (raw) break;\n            }\n          }\n          var s = raw ? JSON.parse(raw) : null;\n          var t = s && s.theme;\n          var m = s && s.themeMode;\n          if (typeof t !== \"string\") t = \"\";\n          if (typeof m !== \"string\") m = \"\";\n          var legacy = LEGACY[t];\n          var theme = THEMES[t] ? t : legacy ? legacy.split(\":\")[0] : \"claw\";\n          var mode = MODES[m] ? m : legacy ? legacy.split(\":\")[1] : \"system\";\n          if (mode === \"system\") {\n            mode = window.matchMedia(\"(prefers-color-scheme: light)\").matches ? \"light\" : \"dark\";\n          }\n          // family -> [dark, light] resolved names. Kept in lockstep with\n          // resolveTheme() in app/theme.ts and the files in public/themes.\n          var FAMILIES = {\n            knot: [\"openknot\", \"openknot-light\"],\n            dash: [\"dash\", \"dash-light\"],\n            absolutely: [\"absolutely\", \"absolutely-light\"],\n            tide: [\"tide\", \"tide-light\"],\n            beacon: [\"beacon\", \"beacon-light\"],\n            phosphor: [\"phosphor\", \"phosphor-light\"],\n            crt: [\"crt\", \"crt-light\"],\n            manuscript: [\"manuscript\", \"manuscript-light\"],\n            rose: [\"rose\", \"rose-light\"],\n            miami: [\"miami\", \"miami-light\"],\n          };\n          var pair = FAMILIES[theme];\n          var resolved = pair\n            ? pair[mode === \"light\" ? 1 : 0]\n            : mode === \"light\"\n              ? \"light\"\n              : \"dark\";\n          if (pair) {\n            // Script-created links need explicit render blocking before first paint.\n            // The gateway stamps the mount prefix and asset version before this runs.\n            var base =\n              document.documentElement.getAttribute(\"data-openclaw-control-ui-base-path\") || \"\";\n            var buildId = document.documentElement.getAttribute(\n              \"data-openclaw-control-ui-build-id\",\n            );\n            var version = buildId ? \"?v=\" + encodeURIComponent(buildId) : \"\";\n            var palette = document.createElement(\"link\");\n            palette.rel = \"stylesheet\";\n            palette.setAttribute(\"blocking\", \"render\");\n            palette.id = \"openclaw-theme-palette-\" + theme;\n            palette.onerror = function () {\n              palette.remove();\n            };\n            palette.href = base + \"/themes/\" + theme + \".css\" + version;\n            document.head.appendChild(palette);\n          }\n          document.documentElement.setAttribute(\"data-theme\", resolved);\n          var resolvedMode = resolved.includes(\"light\") ? \"light\" : \"dark\";\n          document.documentElement.setAttribute(\"data-theme-mode\", resolvedMode);\n          // Plugin semantic styles select on [data-theme-resolved]; keep in lockstep.\n          document.documentElement.setAttribute(\"data-theme-resolved\", resolvedMode);\n        } catch (e) {}\n      })();\n    </script>\n    <style>html,body{min-height:100%}html{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark;background:#0e1015}html[data-theme-mode=light]{--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light;background:#faf9f7}html[data-theme=openknot]{background:#080808}html[data-theme=openknot-light]{background:#f9f9fb}html[data-theme=dash]{background:#1a1210}html[data-theme=dash-light]{background:#f7f2ec}html[data-theme=absolutely]{background:#1c1c1a}html[data-theme=absolutely-light]{background:#faf9f5}html[data-theme=tide]{background:#10151b}html[data-theme=tide-light]{background:#f7f9fb}html[data-theme=beacon]{background:#000}html[data-theme=beacon-light]{background:#fff}html[data-theme=phosphor]{background:#0a0f0a}html[data-theme=phosphor-light]{background:#f4f7f4}html[data-theme=crt]{background:#090a09}html[data-theme=crt-light]{background:#f5f5f4}html[data-theme=manuscript]{background:#211e18}html[data-theme=manuscript-light]{background:#f6f1e4}html[data-theme=rose]{background:#191724}html[data-theme=rose-light]{background:#faf4ed}html[data-theme=miami]{background:#140f1e}html[data-theme=miami-light]{background:#f7f3f6}body{background:inherit;min-height:100%;color-scheme:inherit;margin:0}body.openclaw-mount-fallback-active{--mount-fallback-bg:var(--bg,#0e1015);--mount-fallback-card:var(--card,#161920);--mount-fallback-text:var(--text-strong,#f4f4f5);--mount-fallback-muted:var(--muted,#8b8b94);--mount-fallback-link:var(--link,#ff7070);--mount-fallback-ring:var(--ring,#ff5c5c);color:var(--mount-fallback-text);background:var(--mount-fallback-bg);font-family:var(--font-body,ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif);-webkit-font-smoothing:antialiased;margin:0}body.openclaw-mount-fallback-active openclaw-app{display:none}.mount-fallback{box-sizing:border-box;height:100dvh;padding:max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));place-items:safe center;overflow-y:auto}.mount-fallback:not([hidden]){display:grid}.mount-fallback__panel{box-sizing:border-box;border:1px solid color-mix(in srgb, var(--mount-fallback-text) 7%, transparent);background:var(--mount-fallback-card);width:min(100%,560px);box-shadow:var(--shadow-lg,0 12px 32px #0003);border-radius:20px;padding:32px}.mount-fallback__panel .mount-fallback__eyebrow{color:var(--mount-fallback-muted);letter-spacing:.08em;text-transform:uppercase;margin:0 0 16px;font-size:.78rem;font-weight:700}.mount-fallback__panel h1{color:inherit;letter-spacing:-.02em;margin:0;font-size:clamp(1.375rem,3vw,1.625rem);font-weight:650;line-height:1.25}.mount-fallback__panel p{color:var(--mount-fallback-muted);margin:12px 0 0;font-size:.9375rem;line-height:1.55}.mount-fallback__panel ul{color:var(--mount-fallback-muted);margin:18px 0 0;padding-left:1.2rem;font-size:.875rem;line-height:1.55}.mount-fallback__panel li+li{margin-top:8px}.mount-fallback__panel a{color:var(--mount-fallback-link);text-underline-offset:.18em;text-decoration-thickness:.08em}.mount-fallback__actions{flex-wrap:wrap;gap:10px;margin-top:24px;display:flex}.mount-fallback__button{appearance:none;min-height:44px;color:inherit;background:color-mix(in srgb, var(--mount-fallback-text) 8%, var(--mount-fallback-card));font:inherit;cursor:default;border:0;border-radius:10px;padding:10px 16px;font-size:.875rem;font-weight:600;line-height:1.4;transition:background .12s}@media (hover:hover){.mount-fallback__button:hover{background:color-mix(in srgb, var(--mount-fallback-text) 12%, var(--mount-fallback-card))}}.mount-fallback__button:active{background:color-mix(in srgb, var(--mount-fallback-text) 16%, var(--mount-fallback-card))}.mount-fallback__button--primary{color:var(--primary-foreground,#fff);background:var(--primary,#d13c3c)}.mount-fallback__button--primary:active{background:var(--primary-hover,#c22e2e)}@media (hover:hover){.mount-fallback__button--primary:hover{background:var(--primary-hover,#c22e2e)}}.mount-fallback__panel:focus{outline:none}.mount-fallback__button:focus-visible,.mount-fallback__panel a:focus-visible{outline:2px solid var(--mount-fallback-ring);outline-offset:3px}html[data-theme-mode=light] body.openclaw-mount-fallback-active{--mount-fallback-bg:var(--bg,#faf9f7);--mount-fallback-card:var(--card,#fff);--mount-fallback-text:var(--text-strong,#18181b);--mount-fallback-muted:var(--muted,#64646e);--mount-fallback-link:var(--link,#b91c1c);--mount-fallback-ring:var(--ring,#dc2626)}html[data-theme-mode=light] .mount-fallback__panel{box-shadow:var(--shadow-lg,0 12px 32px #0f172a14)}@media (width<=560px){.mount-fallback__panel{padding:24px}}@media (prefers-reduced-motion:reduce){.mount-fallback__button{transition:none}}</style>\n    <script data-cfasync=\"false\" type=\"module\" crossorigin src=\"./assets/index-Djebye3r.js\"></script>\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/rolldown-runtime-8BhlS34s.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/lit-runtime-DyST807n.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/gateway-runtime-FZ6mX2RY.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/control-ui-core-DNh4McGE.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/session-snapshot-database-DFlfztRJ.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/control-ui-core-bJHyI7AF.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"./assets/ui-DeikvIdP.js\">\n    <link rel=\"stylesheet\" crossorigin href=\"./assets/control-ui-core-yIvVj14Y.css\">\n    <template data-openclaw-route-preloads=\"chat\">      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-BvOXILEY.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-BRpXgwOq.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-CE7ueCxh.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-DsSYH3B6.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-ChxHeQUn.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-BgJI8jW3.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-C9uJ732w.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-C1PHuQAX.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-Dg7r4uLq.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/config-runtime-BecGLziM.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-styles-BaQ2sAfZ.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-styles-DKyMAG_6.css\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-CXHNz0Bh.css\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/chat-attachment-image.worker-P4E63gj9.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/markdown-runtime-ORQpioyT.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/sidebar-update-runtime-CVvIs9jq.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/sidebar-update-runtime-ah7rgQE7.css\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/plugin-contracts-runtime-CWHgryFQ.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-CG50uxir.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-C0fpkn8t.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-HWH89scD.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-DfNf0poH.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-CdE8XLfM.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/chat-transcript-styles-Dzr3t9kA.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/chat-transcript-styles-B_dd5Ueo.css\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-styles-BRrYkFSc.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-styles-C_Ls1c0m.css\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-mLz7NUiY.css\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-chat-Dh5vtL-G.css\">\n</template>\n    <template data-openclaw-route-preloads=\"new\">      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-new-rmJmUTpH.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-CE7ueCxh.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-BRpXgwOq.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-BgJI8jW3.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-ChxHeQUn.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/config-runtime-BecGLziM.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-Dg7r4uLq.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-DsSYH3B6.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-C9uJ732w.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-C1PHuQAX.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-styles-BaQ2sAfZ.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-styles-DKyMAG_6.css\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-shared-CXHNz0Bh.css\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/chat-attachment-image.worker-P4E63gj9.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/markdown-runtime-ORQpioyT.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/sidebar-update-runtime-CVvIs9jq.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/sidebar-update-runtime-ah7rgQE7.css\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/plugin-contracts-runtime-CWHgryFQ.js\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/chat-transcript-styles-Dzr3t9kA.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/chat-transcript-styles-B_dd5Ueo.css\">\n      <link rel=\"modulepreload\" crossorigin=\"\" href=\"./assets/control-ui-boot-new-styles-Bb6Ub5D3.js\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-new-styles-u1aN_ui5.css\">\n      <link rel=\"preload\" as=\"style\" crossorigin=\"\" href=\"./assets/control-ui-boot-new-D-SpiTTi.css\">\n</template>\n  </head>\n  <body>\n    <openclaw-app></openclaw-app>\n    <section\n      id=\"openclaw-mount-fallback\"\n      class=\"mount-fallback\"\n      data-openclaw-mount-timeout-ms=\"12000\"\n      role=\"alert\"\n      aria-labelledby=\"openclaw-mount-fallback-title\"\n      hidden\n    >\n      <div class=\"mount-fallback__panel\" tabindex=\"-1\">\n        <p class=\"mount-fallback__eyebrow\">OpenClaw Control UI</p>\n        <h1 id=\"openclaw-mount-fallback-title\">Control UI did not start</h1>\n        <p id=\"openclaw-mount-fallback-summary\">\n          The browser loaded the static page, but the app bundle did not start. The gateway may be\n          restarting, or this page may reference assets from a different OpenClaw version.\n        </p>\n        <ul>\n          <li>If startup fails, OpenClaw will retry the current app bundle automatically.</li>\n          <li>If this persists, reload or try a clean browser profile.</li>\n          <li>\n            See\n            <a\n              href=\"https://docs.openclaw.ai/web/control-ui#blank-control-ui-page\"\n              target=\"_blank\"\n              rel=\"noopener noreferrer\"\n              >Control UI troubleshooting</a\n            >.\n          </li>\n        </ul>\n        <div class=\"mount-fallback__actions\">\n          <button\n            type=\"button\"\n            id=\"openclaw-mount-retry\"\n            class=\"mount-fallback__button mount-fallback__button--primary\"\n          >\n            Try again\n          </button>\n          <button type=\"button\" id=\"openclaw-mount-wait\" class=\"mount-fallback__button\">\n            Keep waiting\n          </button>\n        </div>\n      </div>\n    </section>\n    <script data-cfasync=\"false\">\n      (function () {\n        var app = document.querySelector(\"openclaw-app\");\n        var fallback = document.getElementById(\"openclaw-mount-fallback\");\n        if (!app || !fallback) return;\n\n        var panel = fallback.querySelector(\".mount-fallback__panel\");\n        var title = document.getElementById(\"openclaw-mount-fallback-title\");\n        var summary = document.getElementById(\"openclaw-mount-fallback-summary\");\n        var failureSummary = summary.textContent;\n        var retry = document.getElementById(\"openclaw-mount-retry\");\n        var wait = document.getElementById(\"openclaw-mount-wait\");\n        var rawDelay = Number(fallback.getAttribute(\"data-openclaw-mount-timeout-ms\"));\n        var delay = Number.isFinite(rawDelay) && rawDelay > 0 ? rawDelay : 12000;\n        var maxRecoveryAttempts = 6;\n        var timer;\n        var recoveryTimer;\n        var recoveryAttempt = 0;\n        var recoveryNavigation = false;\n        var appStarted = false;\n        var documentLoaded = document.readyState === \"complete\";\n        var recoveryController;\n\n        // The recovery page cannot import the app's drag helper when its bundle failed.\n        fallback.addEventListener(\"mousedown\", function (event) {\n          if (event.button !== 0 || event.defaultPrevented || event.target !== fallback) return;\n          var drag = window.webkit?.messageHandlers?.openclawWindowDrag;\n          if (!drag) return;\n          try {\n            drag.postMessage({ type: \"window-drag\" });\n            event.preventDefault();\n          } catch (e) {}\n        });\n\n        try {\n          var initialUrl = new URL(window.location.href);\n          recoveryNavigation = initialUrl.searchParams.has(\"openclaw_mount_recovery\");\n          if (recoveryNavigation) {\n            initialUrl.searchParams.delete(\"openclaw_mount_recovery\");\n            window.history.replaceState(null, \"\", initialUrl.href);\n          }\n        } catch (e) {}\n\n        function hideFallback() {\n          fallback.hidden = true;\n          document.body.classList.remove(\"openclaw-mount-fallback-active\");\n        }\n\n        function setSummary(text) {\n          if (summary) summary.textContent = text;\n        }\n\n        function cancelRecovery() {\n          window.clearTimeout(recoveryTimer);\n          if (recoveryController) recoveryController.abort();\n          recoveryController = undefined;\n        }\n\n        function scheduleRecovery() {\n          window.clearTimeout(recoveryTimer);\n          if (appStarted || recoveryAttempt >= maxRecoveryAttempts) return;\n          var retryDelay = Math.min(delay, 1000 * Math.pow(2, recoveryAttempt));\n          recoveryTimer = window.setTimeout(retryCurrentDocument, retryDelay);\n        }\n\n        function finishRecoveryAttempt() {\n          recoveryController = undefined;\n          if (appStarted) return;\n          if (recoveryAttempt >= maxRecoveryAttempts) {\n            setSummary(\n              \"The gateway is still unavailable. Try again, then check the troubleshooting guide if the problem persists.\",\n            );\n            return;\n          }\n          setSummary(\n            \"The gateway is not reachable yet. OpenClaw will keep retrying while it restarts.\",\n          );\n          scheduleRecovery();\n        }\n\n        function unregisterServiceWorkers() {\n          if (!navigator.serviceWorker?.getRegistrations) return;\n          // Recovery must not depend on a possibly broken worker. Navigations bypass it,\n          // so a reload can self-heal after the registrations are removed.\n          void navigator.serviceWorker\n            .getRegistrations()\n            .then(function (registrations) {\n              return Promise.all(\n                registrations.map(function (registration) {\n                  return registration.unregister();\n                }),\n              );\n            })\n            .catch(function () {});\n        }\n\n        function retryCurrentDocument() {\n          if (\n            appStarted ||\n            recoveryController ||\n            recoveryAttempt >= maxRecoveryAttempts ||\n            typeof window.fetch !== \"function\"\n          )\n            return;\n          var documentUrl = new URL(window.location.href);\n          if (recoveryNavigation) {\n            setSummary(\n              \"A fresh page still could not start the Control UI. Try again, then check the troubleshooting guide if the problem persists.\",\n            );\n            return;\n          }\n          recoveryAttempt += 1;\n          documentUrl.searchParams.set(\"openclaw_mount_recovery\", String(Date.now()));\n          var controller = new AbortController();\n          recoveryController = controller;\n          var requestTimer = window.setTimeout(function () {\n            controller.abort();\n          }, delay);\n          window\n            .fetch(documentUrl.href, {\n              cache: \"no-store\",\n              credentials: \"same-origin\",\n              signal: controller.signal,\n            })\n            .then(function (response) {\n              if (!response.ok) throw new Error(\"gateway unavailable\");\n              if (!appStarted && recoveryController === controller)\n                window.location.replace(documentUrl.href);\n            })\n            .catch(function () {\n              if (recoveryController !== controller) return;\n              unregisterServiceWorkers();\n              finishRecoveryAttempt();\n            })\n            .finally(function () {\n              window.clearTimeout(requestTimer);\n            });\n        }\n\n        function showFallback() {\n          if (appStarted) return;\n          title.textContent = documentLoaded\n            ? \"Control UI did not start\"\n            : \"Control UI is still loading\";\n          fallback.setAttribute(\"role\", documentLoaded ? \"alert\" : \"status\");\n          setSummary(\n            documentLoaded\n              ? failureSummary\n              : \"The browser is still loading the app. OpenClaw will keep waiting without interrupting the download.\",\n          );\n          if (documentLoaded) retryCurrentDocument();\n          fallback.hidden = false;\n          document.body.classList.add(\"openclaw-mount-fallback-active\");\n          if (documentLoaded && panel && typeof panel.focus === \"function\") {\n            try {\n              panel.focus({ preventScroll: true });\n            } catch (e) {\n              panel.focus();\n            }\n          }\n        }\n\n        function armFallbackTimer() {\n          window.clearTimeout(timer);\n          timer = window.setTimeout(showFallback, delay);\n        }\n\n        armFallbackTimer();\n\n        // Deferred module graphs settle before DOMContentLoaded. A slow download\n        // is not a failed bootstrap: replacing the document would cancel it.\n        document.addEventListener(\n          \"DOMContentLoaded\",\n          function () {\n            documentLoaded = true;\n            if (!fallback.hidden) showFallback();\n          },\n          { once: true },\n        );\n\n        window.addEventListener(\n          \"openclaw-control-ui-rendered\",\n          function () {\n            appStarted = true;\n            window.clearTimeout(timer);\n            cancelRecovery();\n            hideFallback();\n          },\n          { once: true },\n        );\n\n        if (retry) {\n          retry.addEventListener(\"click\", function () {\n            cancelRecovery();\n            unregisterServiceWorkers();\n            window.location.reload();\n          });\n        }\n        if (wait) {\n          wait.addEventListener(\"click\", function () {\n            hideFallback();\n            cancelRecovery();\n            recoveryAttempt = 0;\n            armFallbackTimer();\n          });\n        }\n      })();\n    </script>\n  </body>\n</html>\n","assets":[{"path":"assets/absolutely-dark-BCt4vgFE.webp","integrity":"sha256-rSPipzuBCsT2lSZojO1ya548/OVr6FIbpnRCijQJqIo="},{"path":"assets/absolutely-light-CraDJas4.webp","integrity":"sha256-gdW28LJCwqDpc78Kqd+2zwa2J/5NvWunVMxTKFr1W/E="},{"path":"assets/beacon-dark-BUxx3gLL.webp","integrity":"sha256-4jvjQrT20HQX3GykGKRmfxvZX+xrn2MIGl0zHWFoih0="},{"path":"assets/beacon-light-C8Uuyhzu.webp","integrity":"sha256-9DmGw2K/IBauSgURM9x0rlxIVaVBZjIQEGxzExaRNdA="},{"path":"assets/chat-attachment-image.worker-P4E63gj9.js","integrity":"sha256-e1wINw3zK9ewIstPTnDgEoYQZso6LEPQXcDjUzrzKh4="},{"path":"assets/chat-transcript-styles-B_dd5Ueo.css","integrity":"sha256-DkhmH/tReVpypbfC3TtXOQO42JjykCetKBbqc8JWY6E="},{"path":"assets/chat-transcript-styles-Dzr3t9kA.js","integrity":"sha256-C/x16WkXmcaqgDOUQ5Htyczy1h250twTFFxfS1L2KLU="},{"path":"assets/claw-dark-DPmO9vJN.webp","integrity":"sha256-DSVckAlB9vnvO1DeldLMnr4edpyIfjS0uplolX1wEWI="},{"path":"assets/claw-light-crdey3iy.webp","integrity":"sha256-0Xgp8cAxnjl4gJa+wk7MJBJzLB9xuOFD/Y7hXaoy24A="},{"path":"assets/config-runtime-BecGLziM.js","integrity":"sha256-6c/4g9OCWcsyryQoBcQoAV0IG/cQqlALQ4Uv6EavLHk="},{"path":"assets/control-ui-boot-chat-BvOXILEY.js","integrity":"sha256-9ueO+4rze2BWIOjrIQ+en5QF35ItrFLK3Pbbu2D1Uy4="},{"path":"assets/control-ui-boot-chat-C0fpkn8t.js","integrity":"sha256-3iHOQ4V4fkIhtC0fSrS6BZl+ak8w81D5s5kO5KZ4GpQ="},{"path":"assets/control-ui-boot-chat-CG50uxir.js","integrity":"sha256-IdSWQiay29n1mVIi9u/M3GE5eZEyCdKx5qjIwfoOTSk="},{"path":"assets/control-ui-boot-chat-CdE8XLfM.js","integrity":"sha256-D2YOuE53Cc1LeG7frORaDAmaDyT4m7pqE/oAY45qeT8="},{"path":"assets/control-ui-boot-chat-DfNf0poH.js","integrity":"sha256-Lc7/vl/yjEwaRG2LUSKmC9dZ3rXBwNia4dJA7cJw5Eg="},{"path":"assets/control-ui-boot-chat-Dh5vtL-G.css","integrity":"sha256-ksTIYzxKe4/Qq8KrSqEm5RXcPxLnQCiCyXXeo0yoCsQ="},{"path":"assets/control-ui-boot-chat-HWH89scD.js","integrity":"sha256-TJkqB8YFjQi9LjrN11DhQX0WY/Hzaw5zI8PAm4Tqkb8="},{"path":"assets/control-ui-boot-chat-mLz7NUiY.css","integrity":"sha256-1167K5UlelF9DtUNagI0tZXfJz48FWD9ra3X3aftCQM="},{"path":"assets/control-ui-boot-chat-styles-BRrYkFSc.js","integrity":"sha256-z2kGgNU6dVu3BHRJQ9cbzfTS+XFdhrtkqHt+sZd5svw="},{"path":"assets/control-ui-boot-chat-styles-C_Ls1c0m.css","integrity":"sha256-y7eFmCCrmKJb5VCl+tNedJSIVupPQ0IOehiKYJA4LMY="},{"path":"assets/control-ui-boot-new-D-SpiTTi.css","integrity":"sha256-EtG6e01SAb/AkD5o5SgeLloDC8l/RMn7Q1A51mvaFP8="},{"path":"assets/control-ui-boot-new-rmJmUTpH.js","integrity":"sha256-a85dB5Pj2isWdPEM0UVG2kI0XgUB59kSbTym4uQKHZ8="},{"path":"assets/control-ui-boot-new-styles-Bb6Ub5D3.js","integrity":"sha256-N7wNVuZvYlQ8zSdkAsFBkkaBKPhHJqNiP8m98BgehJg="},{"path":"assets/control-ui-boot-new-styles-u1aN_ui5.css","integrity":"sha256-zuaBax0yJiPBVZvVTjfpNfyz/IYA5Hl30y2/3uBc7BA="},{"path":"assets/control-ui-boot-shared-BRpXgwOq.js","integrity":"sha256-iBJn9vezvwMHlEIbChYD0dW08YV99v3KAB9RGwLkxqM="},{"path":"assets/control-ui-boot-shared-BgJI8jW3.js","integrity":"sha256-D4N7a28Y0cgXzoIuiFLZIhi/C+tAXJhRqCTyIMPizsk="},{"path":"assets/control-ui-boot-shared-C1PHuQAX.js","integrity":"sha256-lzUtrRSgsHeY763HzWPWo/aF3XW0hRnvRwQkOS+HaQg="},{"path":"assets/control-ui-boot-shared-C9uJ732w.js","integrity":"sha256-m16jfM+p6tn/NXLezZBBracRR6zdXntZTky7J8O5URo="},{"path":"assets/control-ui-boot-shared-CE7ueCxh.js","integrity":"sha256-YfSZVZDRsxvR//KLcrIRiGFgGWWMoy8BWDLG7LU753g="},{"path":"assets/control-ui-boot-shared-CXHNz0Bh.css","integrity":"sha256-NogtTrYf1QNLhQKC60JPfSyEmHsg9LQ7+PeTfaAho88="},{"path":"assets/control-ui-boot-shared-ChxHeQUn.js","integrity":"sha256-98TNdg85ksyLjTS6uzTrB4Dtgn/jOTJxKDc7OteN9xo="},{"path":"assets/control-ui-boot-shared-Dg7r4uLq.js","integrity":"sha256-5qX5KGxwcFWSVprV9NT7mUx2jtL9NW6cYMU5rfrWDw4="},{"path":"assets/control-ui-boot-shared-DsSYH3B6.js","integrity":"sha256-OIYzsX1oQ/clu5G2Pep9Ii1V1fgjPzjjQ/TL/OoEGC8="},{"path":"assets/control-ui-boot-shared-styles-BaQ2sAfZ.js","integrity":"sha256-SKTH5ofVljHY/H38K7kTtIuT5onUoTrJzuOVIBfs9kc="},{"path":"assets/control-ui-boot-shared-styles-DKyMAG_6.css","integrity":"sha256-fCdnVJz8PJ65xL4XpsB+5Rl5DphjWCTc/Zgnsq0tNHE="},{"path":"assets/control-ui-core-DNh4McGE.js","integrity":"sha256-1xDifqwAJZ0huDetTU1t30OXF1X8U21cdFru5o0JRss="},{"path":"assets/control-ui-core-bJHyI7AF.js","integrity":"sha256-dhOXjP1dwk7dvvJ/6qUNCzWLfMUExsyG2m13yQqfqbI="},{"path":"assets/control-ui-core-yIvVj14Y.css","integrity":"sha256-eayEoy7/W4BzhYM6GgU6OpWOn6b0mcelVXO03oEwxYg="},{"path":"assets/crt-dark-Tui5yPvX.webp","integrity":"sha256-q343d9kliKx3LD1mDLs8G7wJjwe8qm5kX+NNcKE9zQ0="},{"path":"assets/crt-light-DbR0bpR3.webp","integrity":"sha256-qjZSxrGCarmpOvCXDblgqlYic2ydW3QM0DMopGq4YzU="},{"path":"assets/custom-dark-B0roIpAb.webp","integrity":"sha256-fOBrFIB44LzK4q6uu8g8qAxBQ2xG73q8cdqgpGldx+U="},{"path":"assets/custom-light-DyDTxevI.webp","integrity":"sha256-u7vwso+E0Df9Yqa+ZCcOjZD/KrIyfxC2nAv2z6GBoUw="},{"path":"assets/dash-dark-BQSVDng9.webp","integrity":"sha256-P7XdTxKVPetQVKXDS5VWAamAl8wGMAwtk1MuDCdzs68="},{"path":"assets/dash-light-BdkMy7z2.webp","integrity":"sha256-Nm5X/muW5FajbXcRaOZE3GlBN6ASXH4PXZePGT8FTPw="},{"path":"assets/gateway-runtime-FZ6mX2RY.js","integrity":"sha256-iahZGhA/fKH7q+ychY7XgdUE8SOLpFttM+LLCRDM1Lg="},{"path":"assets/index-Djebye3r.js","integrity":"sha256-qvnGV0hZ6onHRe6kYw/JLJkCkl4APb9XgM013R8gmcQ="},{"path":"assets/knot-dark-D6MXlduA.webp","integrity":"sha256-hL4Wqvk8IEDBJWyDhoRa0BcCB5b3PPE38oEh9GG+1Jg="},{"path":"assets/knot-light-bmQq9AbN.webp","integrity":"sha256-X5wi3pqPCDpkOkuVMrAZDalanmOQ2qI8G7UtFRBvaF4="},{"path":"assets/lit-runtime-DyST807n.js","integrity":"sha256-d6FTLzaYSf4AAUlsQ2EPEyAFXBQGKt8as20XrM8DRxY="},{"path":"assets/login-runtime-BviVFlcX.js","integrity":"sha256-f9MBSyUK9NVWDLQNBk+/sE26tTYedsOjuXN2n88XUXQ="},{"path":"assets/manuscript-dark-CkdelLyK.webp","integrity":"sha256-xgPIvlFAEjQwt3XmgnHHr8xrtMJKO+YsWD5WSv1yh9E="},{"path":"assets/manuscript-light-BtjxM-_G.webp","integrity":"sha256-x2kdDL4hqd0H5NcWhPK7ee001oS9BvUIIwP9Ht+q3cI="},{"path":"assets/markdown-runtime-ORQpioyT.js","integrity":"sha256-Neu3pNJIJpvCJbVxo4v5Tf0bxbX3kx7usahmbnB0cC8="},{"path":"assets/miami-dark-CxsR_EPe.webp","integrity":"sha256-jLVVhcHr4fquKEaGcFIqnpTokytCrTTlQr2JfUNoaRc="},{"path":"assets/miami-light-CK76ftVr.webp","integrity":"sha256-kDAANsIRz9djMWRAXCMlinOyJ2UD9TQzkgFuQdUpZxY="},{"path":"assets/phosphor-dark-DO_664om.webp","integrity":"sha256-z1jOYzbLSedigvVZMXHaW7sh2J415SvxZqkgnNgSXiA="},{"path":"assets/phosphor-light-B6L1EVnW.webp","integrity":"sha256-k4ZxastDCMX2HAPrNRgQe0F3+WuOk+/JBVyP8MsZssI="},{"path":"assets/plugin-contracts-runtime-CWHgryFQ.js","integrity":"sha256-C7M2TOnSJvsqAARktMlOKt2Jtn+n/abq5nPuNv4mN2c="},{"path":"assets/rolldown-runtime-8BhlS34s.js","integrity":"sha256-HLXG6tfik3AgPxLi1c31DsHwLdcO4tBQ2QmvvyQG9rE="},{"path":"assets/rose-dark-D9X1-O20.webp","integrity":"sha256-Pa7wswj4nke44b16acIGBSKnQPK5hbYgJ5JUBqTQoZI="},{"path":"assets/rose-light-xf8VQLmW.webp","integrity":"sha256-VIwqE+iEB+SH4oeHe1ouLhNowIHbWhU2nvT0t3qH9fI="},{"path":"assets/session-snapshot-database-DFlfztRJ.js","integrity":"sha256-WPzgOYxNFGpJFf/gdYqXJXl1C+AW3Lz9GnlGRVB/On8="},{"path":"assets/sidebar-update-runtime-CVvIs9jq.js","integrity":"sha256-lU3k6ted+GO88FnZoBdJz/J4g53vzrcQRiRfeY1O+l4="},{"path":"assets/sidebar-update-runtime-ah7rgQE7.css","integrity":"sha256-Iutlq1xTlJMdWMYl2AW06ynST1DtuUGdib8Otlrojpg="},{"path":"assets/tide-dark-B6z-RwsR.webp","integrity":"sha256-3XnZBk/FYT2BrkkamDesxgaaJ4kZhxmtvl67MM7Q15Q="},{"path":"assets/tide-light-CtKGylEa.webp","integrity":"sha256-8ZVOglD+md8doVYrcVLeafmdMh82A8ZnnOM+bGIRe/Q="},{"path":"assets/ui-DeikvIdP.js","integrity":"sha256-l/OdzMoCbNVoQ+93qn2daXBpEqgjADQ4SSC4ns0M/BU="},{"path":"fonts/atkinson-hyperlegible-next-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-hxQ2vjwuAQREJGPfXqvn6u9eAXLLZxWnIBVu929w4f8="},{"path":"fonts/atkinson-hyperlegible-next-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-biIf4oaadV/c4bpsNRfzksOiGNZC4dAgftKCZxPbcmM="},{"path":"fonts/atkinson-hyperlegible-next-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-yhlpr6kFikHO1KCL1U9Ig1z+edxsz5BQ3Kfahcngqdk="},{"path":"fonts/atkinson-hyperlegible-next-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-HkzqcddexCdYHWJZ/AcUii5g1g0Wyr9LT1NgSHs/ncM="},{"path":"fonts/atkinson-hyperlegible.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-2AY3W8cGHBiWmeQUEuWML3NlQoLHfUuaUYoYOk9sfZw="},{"path":"fonts/dm-sans-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-w0MB/ymJzTuuLFV7G8q4jYJr4TV9oX6/jhWKdzhTtaE="},{"path":"fonts/dm-sans-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-BllukxcLDhO48bYLk3dMTTF+ShXIPOEGY0CQxgMULS8="},{"path":"fonts/dm-sans-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-DQYJrud40htAvaHSe35rWzyxo+lrkLiDHGgaygl8Ihk="},{"path":"fonts/dm-sans-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-qlMHFrDTUYZq99v6Pu5BIPs28tBxuv+MI0GFFBhlx/8="},{"path":"fonts/dm-sans.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-sF3Zk92A/XYbVVaejEX13La0onYit9cIvcQBteymK94="},{"path":"fonts/fraunces-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-Hg0RSnKSF5nwZBPTZzqAwxb6d9jTRN9t58hlkwLs4tw="},{"path":"fonts/fraunces-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-SvnHWcgFm1OSO0tQujd7pRAph24a8ep1fvsHvGfZeJY="},{"path":"fonts/fraunces-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-8SAIm5RA8+NamAohNzR7GFGtRu5LitXGO2wH4FP6QOI="},{"path":"fonts/fraunces-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-SCgqQV7CLjG+rwoGZub64MjL3c0LH25ynyfDreimTkM="},{"path":"fonts/fraunces.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-x2xjFqXvUnnu/lWcQ3Uq9hi0DNo75KgC9IRalr7bc6k="},{"path":"fonts/geist-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-WKaxc9XKHeySFm6jxssahKQURVbRCSisFOjmtA5Hh70="},{"path":"fonts/geist-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-m29f9FsnjHRLXzeaLE7Lr4WKhCuOr4KsjSG2mcoWxgg="},{"path":"fonts/geist.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-Pf26/iwrAXh0E1+apzutb35p/v+xsVDRhNVP83pPyYI="},{"path":"fonts/ibm-plex-sans-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-jlwjzvFieHVcdB5weZlFBkldRNECiQoYQsVkuUETHuY="},{"path":"fonts/ibm-plex-sans-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-rdJe+mHOaQRGjjIXJ+TeXYddgAf06wCndxgqYKiRQu8="},{"path":"fonts/ibm-plex-sans-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-rh2FT++hFnp5Bx8a/gHU1RtgxYQMG+Nt10vV/nN1tAU="},{"path":"fonts/ibm-plex-sans-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-BW5OJFn1egAzyMnIRP8Z1uQqyGAgJ4A9Q0WCO8yTmBg="},{"path":"fonts/ibm-plex-sans.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-YFMqcJmN93J1G17OP2pEhKNJxeLzyq8/MEmbN4hV4RY="},{"path":"fonts/instrument-sans-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-8c03Q8AUVKvJ2eNcUaGVqULdQOz0089qFyRhQk2wQTo="},{"path":"fonts/instrument-sans-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-Lj74B9WQja+p0CyHBzN+ywrsw6Em1RlsqJRQbb3KKFM="},{"path":"fonts/instrument-sans-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-e7mSHy6tY5vBXjZQ9OW2LsJXOrqzxXtzLRVdDci5gBY="},{"path":"fonts/instrument-sans-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-GfjsMgBVChGFnH5S1zeDVL9xvG3QRB/d55uaZgUT9eQ="},{"path":"fonts/instrument-sans.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-LRhF/v1oCOj8m3IKRCOVnXqW+PqdiV74NCco6bISK9w="},{"path":"fonts/jetbrains-mono-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-PGwnIYepfY5RmvmLbBJV3AIQjvJuO0vvIF4wIRKNfcI="},{"path":"fonts/jetbrains-mono-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-45GNpTXvw4691OXSdI3o7PMX6TC7dM1gDo4pDKJx/II="},{"path":"fonts/jetbrains-mono-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-nDjLLQ0tk8HubiH6eNt28T6n4V4VzGQhTHyom2qqNcQ="},{"path":"fonts/jetbrains-mono-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-LDK5s+41jBGeIQ9vUZX5vTSJTXinhf8uldYOcY5ACvQ="},{"path":"fonts/jetbrains-mono.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-GmYu5pD5cw6X+uZDBKAxQSWUZ6d15Lz1h2C9Z4xSGJc="},{"path":"fonts/lora-italic-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-lWit+rN6WwMOdcZlH4M0Br9UH/diHqjGBZJJs57bJYw="},{"path":"fonts/lora-italic-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-PVNtSVZugqeQXIsAlnWABfZhYCmsCFKNH0eJwRAN/2o="},{"path":"fonts/lora-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-VWBvvHbcIyxb6471hNe09/duManyeHcRLnVIQ1ZGJ4E="},{"path":"fonts/lora-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-axAqs1qh8rMVeIu0hTQ07R5SE3YDv3o9pxpoInZ0jUU="},{"path":"fonts/lora.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-FRVylWZtfHrQBXERPV/56Pvs7Esf+Z9SI+nmjeDVR+Y="},{"path":"fonts/space-grotesk-latin-ext.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-BUwmb7tEHuBZNl26CIXSBvZ8oFs3XehpuI4C6/zMm50="},{"path":"fonts/space-grotesk-latin.woff2?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-oNBUxK9VfeIK/Wyln0erNTvK7EnGP/BLbJ050PiRBVc="},{"path":"fonts/space-grotesk.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-8GeEe2tmWAsHrj1Ens9L4yYUmScJXODUW/CBKVbKuwY="},{"path":"themes/absolutely.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-F3alTEqZvoBiev/0kf8UKV9eapKwkZxC6/n2cMO0KBk="},{"path":"themes/beacon.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-JWitMzghkjBe30nBYbeRL3RvXnabLnB3B+0OgA5vcjs="},{"path":"themes/crt.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-YceWziuV3LqDY10v4NHZw8AYVAaqKA/vsXx6z+fZino="},{"path":"themes/dash.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-uud8rBVr5Otm2EEKSy6WeDwmZwKFrjW7bUJjyGzPGVk="},{"path":"themes/knot.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-BSNAtw6CGUXDO+w0/ykprs9AwskRvLF/xVIHuS+1xyQ="},{"path":"themes/manuscript.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-ORIeRip/nbc5DrCTyyBDcUKt11rvDw8fQFYh1a5SxxI="},{"path":"themes/miami.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-5riDT9AAS/lnUaX7PWEfaYUf3pN6cFUEB6lM+M9AFD8="},{"path":"themes/phosphor.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-6+d4pkZfJnvO1hN1RQRZRlvd99q21U05/Lxg6+5BlpY="},{"path":"themes/rose.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-aCH+QXEk22o1LP4au2OLh7c32Ysn1TLQfbvco34+85c="},{"path":"themes/tide.css?v=2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","integrity":"sha256-vAybvZ0+wilyhqbuy2irlBt3ENI/tUnA0BLbIJn7M+M="}],"csp":"default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; frame-src 'self' blob: http: https:; script-src 'self' 'sha256-g30CWRMlZumMHvjOkMce6NnzY9k1/zZU+9vzyMq8ETQ=' 'sha256-3ZtS7Pp946oZD2TpjQfDJxk9j5rPHsq5f01FeA7+IwQ='; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; media-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; worker-src 'self'; connect-src 'self' ws: wss: data: blob: https://api.openai.com https://tweakcn.com","publicAssetVersion":"2026.10.4-383c124cc32f-2026-10-16T10-34-11.412Z-829c0937a963f553623efc5aee466ba3f31a7c54bbc9216f669c639193848f9b","publicAssets":["app-art/android-dark.webp","app-art/android.webp","app-art/apple-watch-dark.webp","app-art/apple-watch.webp","app-art/chrome-extension-dark.webp","app-art/chrome-extension.webp","app-art/ios-dark.webp","app-art/ios.webp","app-art/linux-dark.webp","app-art/linux.webp","app-art/macos-dark.webp","app-art/macos.webp","app-art/plugins-dark.webp","app-art/plugins.webp","app-art/wear-os-dark.webp","app-art/wear-os.webp","app-art/windows-dark.webp","app-art/windows.webp","apple-touch-icon.png","cloud-provider-icons/aws.svg","cloud-provider-icons/azure.svg","cloud-provider-icons/daytona.svg","cloud-provider-icons/gcp.svg","cloud-provider-icons/hetzner.svg","community-art/community-invite-dark.webp","community-art/community-invite-light.webp","favicon-32.png","favicon.ico","favicon.svg","file-icons/compact/dark/css.svg","file-icons/compact/dark/csv.svg","file-icons/compact/dark/docx.svg","file-icons/compact/dark/gif.svg","file-icons/compact/dark/html.svg","file-icons/compact/dark/jpg.svg","file-icons/compact/dark/js.svg","file-icons/compact/dark/json.svg","file-icons/compact/dark/md.svg","file-icons/compact/dark/mp3.svg","file-icons/compact/dark/mp4.svg","file-icons/compact/dark/pdf.svg","file-icons/compact/dark/png.svg","file-icons/compact/dark/py.svg","file-icons/compact/dark/rtf.svg","file-icons/compact/dark/svg.svg","file-icons/compact/dark/txt.svg","file-icons/compact/dark/wav.svg","file-icons/compact/dark/xlsx.svg","file-icons/compact/dark/xml.svg","file-icons/compact/dark/yaml.svg","file-icons/compact/dark/zip.svg","file-icons/compact/light/css.svg","file-icons/compact/light/csv.svg","file-icons/compact/light/docx.svg","file-icons/compact/light/gif.svg","file-icons/compact/light/html.svg","file-icons/compact/light/jpg.svg","file-icons/compact/light/js.svg","file-icons/compact/light/json.svg","file-icons/compact/light/md.svg","file-icons/compact/light/mp3.svg","file-icons/compact/light/mp4.svg","file-icons/compact/light/pdf.svg","file-icons/compact/light/png.svg","file-icons/compact/light/py.svg","file-icons/compact/light/rtf.svg","file-icons/compact/light/svg.svg","file-icons/compact/light/txt.svg","file-icons/compact/light/wav.svg","file-icons/compact/light/xlsx.svg","file-icons/compact/light/xml.svg","file-icons/compact/light/yaml.svg","file-icons/compact/light/zip.svg","file-icons/compact/unknown-dark.svg","file-icons/compact/unknown-light.svg","file-icons/large/shell-dark.svg","file-icons/large/shell-light.svg","file-icons/overlays/archive.svg","file-icons/overlays/audio.svg","file-icons/overlays/code.svg","file-icons/overlays/document.svg","file-icons/overlays/image.svg","file-icons/overlays/javascript.svg","file-icons/overlays/json.svg","file-icons/overlays/markdown.svg","file-icons/overlays/pdf.svg","file-icons/overlays/python.svg","file-icons/overlays/spreadsheet.svg","file-icons/overlays/svg.svg","file-icons/overlays/text.svg","file-icons/overlays/unknown.svg","file-icons/overlays/video.svg","file-icons/overlays/yaml.svg","fonts/atkinson-hyperlegible-next-italic-latin-ext.woff2","fonts/atkinson-hyperlegible-next-italic-latin.woff2","fonts/atkinson-hyperlegible-next-latin-ext.woff2","fonts/atkinson-hyperlegible-next-latin.woff2","fonts/atkinson-hyperlegible.css","fonts/dm-sans-italic-latin-ext.woff2","fonts/dm-sans-italic-latin.woff2","fonts/dm-sans-latin-ext.woff2","fonts/dm-sans-latin.woff2","fonts/dm-sans.css","fonts/fraunces-italic-latin-ext.woff2","fonts/fraunces-italic-latin.woff2","fonts/fraunces-latin-ext.woff2","fonts/fraunces-latin.woff2","fonts/fraunces.css","fonts/geist-latin-ext.woff2","fonts/geist-latin.woff2","fonts/geist.css","fonts/ibm-plex-sans-italic-latin-ext.woff2","fonts/ibm-plex-sans-italic-latin.woff2","fonts/ibm-plex-sans-latin-ext.woff2","fonts/ibm-plex-sans-latin.woff2","fonts/ibm-plex-sans.css","fonts/instrument-sans-italic-latin-ext.woff2","fonts/instrument-sans-italic-latin.woff2","fonts/instrument-sans-latin-ext.woff2","fonts/instrument-sans-latin.woff2","fonts/instrument-sans.css","fonts/jetbrains-mono-italic-latin-ext.woff2","fonts/jetbrains-mono-italic-latin.woff2","fonts/jetbrains-mono-latin-ext.woff2","fonts/jetbrains-mono-latin.woff2","fonts/jetbrains-mono.css","fonts/lora-italic-latin-ext.woff2","fonts/lora-italic-latin.woff2","fonts/lora-latin-ext.woff2","fonts/lora-latin.woff2","fonts/lora.css","fonts/space-grotesk-latin-ext.woff2","fonts/space-grotesk-latin.woff2","fonts/space-grotesk.css","manifest.webmanifest","provider-icons/ProviderIcon-abacus.svg","provider-icons/ProviderIcon-alibaba.svg","provider-icons/ProviderIcon-amp.svg","provider-icons/ProviderIcon-antigravity.svg","provider-icons/ProviderIcon-arcee.svg","provider-icons/ProviderIcon-augment.svg","provider-icons/ProviderIcon-baseten.svg","provider-icons/ProviderIcon-bedrock.svg","provider-icons/ProviderIcon-byteplus.svg","provider-icons/ProviderIcon-cerebras.svg","provider-icons/ProviderIcon-chutes.svg","provider-icons/ProviderIcon-claude.svg","provider-icons/ProviderIcon-clawrouter.svg","provider-icons/ProviderIcon-cloudflare.svg","provider-icons/ProviderIcon-codebuff.svg","provider-icons/ProviderIcon-codex.svg","provider-icons/ProviderIcon-cohere.svg","provider-icons/ProviderIcon-comfy.svg","provider-icons/ProviderIcon-commandcode.svg","provider-icons/ProviderIcon-copilot.svg","provider-icons/ProviderIcon-crof.svg","provider-icons/ProviderIcon-crossmodel.svg","provider-icons/ProviderIcon-cursor.svg","provider-icons/ProviderIcon-deepgram.svg","provider-icons/ProviderIcon-deepinfra.svg","provider-icons/ProviderIcon-deepseek.svg","provider-icons/ProviderIcon-devin.svg","provider-icons/ProviderIcon-doubao.svg","provider-icons/ProviderIcon-elevenlabs.svg","provider-icons/ProviderIcon-factory.svg","provider-icons/ProviderIcon-fal.svg","provider-icons/ProviderIcon-featherless.svg","provider-icons/ProviderIcon-fireworks.svg","provider-icons/ProviderIcon-gemini.svg","provider-icons/ProviderIcon-grok.svg","provider-icons/ProviderIcon-groq.svg","provider-icons/ProviderIcon-huggingface.svg","provider-icons/ProviderIcon-jetbrains.svg","provider-icons/ProviderIcon-kilo.svg","provider-icons/ProviderIcon-kimi.svg","provider-icons/ProviderIcon-kiro.svg","provider-icons/ProviderIcon-litellm.svg","provider-icons/ProviderIcon-llamacpp.svg","provider-icons/ProviderIcon-llmproxy.svg","provider-icons/ProviderIcon-lmstudio.svg","provider-icons/ProviderIcon-longcat.svg","provider-icons/ProviderIcon-manus.svg","provider-icons/ProviderIcon-meta.svg","provider-icons/ProviderIcon-microsoft.svg","provider-icons/ProviderIcon-mimo.svg","provider-icons/ProviderIcon-minimax.svg","provider-icons/ProviderIcon-mistral.svg","provider-icons/ProviderIcon-novita.svg","provider-icons/ProviderIcon-nvidia.svg","provider-icons/ProviderIcon-ollama.svg","provider-icons/ProviderIcon-opencode.svg","provider-icons/ProviderIcon-opencodego.svg","provider-icons/ProviderIcon-openrouter.svg","provider-icons/ProviderIcon-perplexity.svg","provider-icons/ProviderIcon-pi.svg","provider-icons/ProviderIcon-pixverse.svg","provider-icons/ProviderIcon-poe.svg","provider-icons/ProviderIcon-qianfan.svg","provider-icons/ProviderIcon-qoder.svg","provider-icons/ProviderIcon-runway.svg","provider-icons/ProviderIcon-sakana.svg","provider-icons/ProviderIcon-stepfun.svg","provider-icons/ProviderIcon-synthetic.svg","provider-icons/ProviderIcon-t3chat.svg","provider-icons/ProviderIcon-tencent.svg","provider-icons/ProviderIcon-together.svg","provider-icons/ProviderIcon-venice.svg","provider-icons/ProviderIcon-vercel.svg","provider-icons/ProviderIcon-vertexai.svg","provider-icons/ProviderIcon-vllm.svg","provider-icons/ProviderIcon-volcengine.svg","provider-icons/ProviderIcon-warp.svg","provider-icons/ProviderIcon-windsurf.svg","provider-icons/ProviderIcon-zai.svg","provider-icons/ProviderIcon-zed.svg","themes/absolutely.css","themes/beacon.css","themes/crt.css","themes/dash.css","themes/knot.css","themes/manuscript.css","themes/miami.css","themes/phosphor.css","themes/rose.css","themes/tide.css"],"id":"9ff105dddf5ea955"};
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}${OFFLINE_BOOT ? `-${OFFLINE_BOOT.id}` : ""}`;
const CONTROL_CACHE_LIMIT = 3;
const SCOPE_URL = new URL(self.registration.scope);
const SCOPE_PATH = SCOPE_URL.pathname.endsWith("/") ? SCOPE_URL.pathname : `${SCOPE_URL.pathname}/`;

function controlUiPathname(url) {
  if (url.origin !== SCOPE_URL.origin) {
    return null;
  }
  if (url.pathname === SCOPE_URL.pathname) {
    return "/";
  }
  return url.pathname.startsWith(SCOPE_PATH) ? `/${url.pathname.slice(SCOPE_PATH.length)}` : null;
}

// Older pages reload directly and cannot acquire new config-draft guards. Keep
// their root/chat announcement contract; current pages also reconcile on resume.
function isControlUiChatClient(url) {
  const pathname = controlUiPathname(new URL(url));
  return pathname === "/" || pathname === "/chat" || pathname?.startsWith("/chat/") === true;
}

// A resumed/BFCache document may have missed activation entirely. Build identity
// belongs to the running worker, not its potentially old sw.js?v= registration URL.
self.addEventListener("message", (event) => {
  if (event.data?.type === "sw-version-probe") {
    event.ports[0]?.postMessage({ type: "sw-updated", version: CACHE_VERSION });
    if (OFFLINE_BOOT) {
      event.waitUntil(prepareOfflineShell());
    }
  }
});

const OFFLINE_SHELL_URL = new URL(`${SCOPE_PATH}__offline_shell__`, SCOPE_URL).href;
const PUBLIC_ASSETS_URL = new URL(`${SCOPE_PATH}__offline_assets__`, SCOPE_URL).href;

function cacheableResponse(response) {
  return (
    response.ok &&
    !response.redirected &&
    !/(?:^|,)\s*(?:no-store|private)(?:\s|,|=|$)/i.test(
      response.headers.get("Cache-Control") || "",
    ) &&
    !/(?:^|,)\s*(?:cookie|authorization)\s*(?:,|$)/i.test(response.headers.get("Vary") || "") &&
    !response.headers.has("WWW-Authenticate") &&
    !response.headers.has("Set-Cookie") &&
    !response.headers.get("Content-Type")?.toLowerCase().includes("text/html")
  );
}

let offlinePreparation;
function prepareOfflineShell() {
  if (!OFFLINE_BOOT || !self.navigator.onLine) {
    return Promise.resolve();
  }
  // Registration/resume probes share the install work; a failed attempt remains
  // retryable without a retry timer or delaying the build-identity reply.
  if (!offlinePreparation) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    offlinePreparation = precacheOfflineShell(controller.signal)
      .catch(() => {
        // Cache storage is optional; updates and notifications must still work.
      })
      .finally(() => {
        clearTimeout(timeout);
        offlinePreparation = undefined;
      });
  }
  return offlinePreparation;
}

async function isCachedBootAsset(response, integrity) {
  if (!response || !cacheableResponse(response)) {
    return false;
  }
  try {
    // Runtime asset writes also enter this cache. Reuse bytes only if they match
    // the boot graph, not just a successful response under the expected URL.
    const digest = await crypto.subtle.digest("SHA-256", await response.arrayBuffer());
    return "sha256-" + btoa(String.fromCharCode(...new Uint8Array(digest))) === integrity;
  } catch {
    return false;
  }
}

async function precacheOfflineShell(signal) {
  if (await caches.match(OFFLINE_SHELL_URL, { cacheName: CACHE_NAME })) {
    return;
  }
  const cache = await caches.open(CACHE_NAME);
  await cache.put(
    PUBLIC_ASSETS_URL,
    Response.json({
      version: OFFLINE_BOOT.publicAssetVersion,
      assets: OFFLINE_BOOT.publicAssets,
    }),
  );
  const ready = await Promise.all(
    OFFLINE_BOOT.assets.map(async (asset) => {
      try {
        const url = new URL(asset.path, new URL(SCOPE_PATH, SCOPE_URL)).href;
        const cached = await caches.match(url, { cacheName: CACHE_NAME });
        if (await isCachedBootAsset(cached, asset.integrity)) {
          return true;
        }
        if (!self.navigator.onLine) {
          return false;
        }
        // Reuse same-origin proxy sign-in for static assets, never follow a login
        // redirect. Integrity and response policy still admit only exact build bytes.
        const response = await fetch(url, {
          credentials: "same-origin",
          redirect: "error",
          integrity: asset.integrity,
          signal,
        });
        if (!cacheableResponse(response)) {
          return false;
        }
        await cache.put(url, response);
        return true;
      } catch {
        return false;
      }
    }),
  );
  if (!ready.every(Boolean)) {
    return;
  }
  // A deep chat URL must resolve the portable bundle against the registered app
  // root. No fetched document, credential, or route-specific metadata is retained.
  const escapedPath = SCOPE_PATH.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const html = OFFLINE_BOOT.html
    .replaceAll('src="./', () => `src="${escapedPath}`)
    .replaceAll('href="./', () => `href="${escapedPath}`)
    .replace(
      "<html",
      () => `<html data-openclaw-control-ui-base-path="${escapedPath.slice(0, -1)}"`,
    );
  await cache.put(
    OFFLINE_SHELL_URL,
    new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": OFFLINE_BOOT.csp,
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(prepareOfflineShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      const controlKeys = cacheKeys.filter((key) => key.startsWith(CACHE_PREFIX));
      const priorCacheLimit = Math.max(0, CONTROL_CACHE_LIMIT - 1);
      // Keep a small prior-build window so open tabs can still load old hashed chunks after updates.
      const retained = new Set([
        ...controlKeys.filter((key) => key !== CACHE_NAME).slice(-priorCacheLimit),
        CACHE_NAME,
      ]);

      await Promise.all([
        self.clients.claim(),
        Promise.all(
          controlKeys.filter((key) => !retained.has(key)).map((key) => caches.delete(key)),
        ),
      ]);
      // Queue the announcement without waiting for suspended pages or navigating
      // around their unsaved-work guards. Resumed pages also query our identity.
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of windowClients) {
        if (isControlUiChatClient(client.url)) {
          client.postMessage({ type: "sw-updated", version: CACHE_VERSION }, []);
        }
      }
    })(),
  );
});

async function reportControlUiHttpFailure(event) {
  if (!event.clientId) {
    return;
  }
  try {
    const client = await self.clients.get(event.clientId);
    if (client?.type === "window" && controlUiPathname(new URL(client.url)) !== null) {
      client.postMessage({ type: "openclaw-http-request-failed" }, []);
    }
  } catch {
    // Closing a tab during its request must not replace the HTTP outcome.
  }
}

async function fetchControlUiRequest(event, cacheable) {
  try {
    const response = await fetch(event.request);
    if (response.status === 401) {
      await reportControlUiHttpFailure(event);
    }
    if (cacheable && cacheableResponse(response)) {
      const clone = response.clone();
      event.waitUntil(
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request.url, clone))
          .catch(() => {}),
      );
    }
    return response;
  } catch {
    const cached = cacheable ? await matchControlUiAsset(event.request) : undefined;
    if (cached) {
      return cached;
    }
    await reportControlUiHttpFailure(event);
    return Response.error();
  }
}

async function matchControlUiAsset(request) {
  try {
    // Writes use public URL-only keys. Match the same key rather than a module
    // request whose Origin header can differ from credential-free install fetches.
    const current = await caches.match(request.url, { cacheName: CACHE_NAME });
    if (current && cacheableResponse(current)) {
      return current;
    }
    // Only hashed/versioned public URLs may reuse the retained prior-build window.
    const keys = await caches.keys();
    for (const cacheName of keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .toReversed()) {
      const cached = await caches.match(request.url, { cacheName });
      if (cached && cacheableResponse(cached)) {
        return cached;
      }
    }
  } catch {
    // Storage denial must not prevent ordinary network delivery.
  }
  return undefined;
}

let priorPublicAssets;
async function isVersionedPublicAsset(url, pathname) {
  if (
    OFFLINE_BOOT?.publicAssets.includes(pathname.slice(1)) &&
    url.search === `?v=${encodeURIComponent(OFFLINE_BOOT.publicAssetVersion)}`
  ) {
    return true;
  }
  if (!url.searchParams.get("v") || url.searchParams.size !== 1) {
    return false;
  }
  // The running build and its retained predecessors are immutable for this
  // worker lifetime. Old tabs with unsaved work may still request their version.
  // An arbitrary ?v= value is not authority to cache a response.
  priorPublicAssets ??= (async () => {
    try {
      const keys = await caches.keys();
      return await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(async (cacheName) => {
            try {
              return await (await caches.match(PUBLIC_ASSETS_URL, { cacheName }))?.json();
            } catch {
              return undefined;
            }
          }),
      );
    } catch {
      return [];
    }
  })();
  return (await priorPublicAssets).some(
    (inventory) =>
      typeof inventory?.version === "string" &&
      Array.isArray(inventory.assets) &&
      inventory.assets.includes(pathname.slice(1)) &&
      url.search === `?v=${encodeURIComponent(inventory.version)}`,
  );
}

self.addEventListener("fetch", (event) => {
  // Only the requesting app owns recovery. Other origins and scoped apps keep
  // their own network and cache policies, even when this worker controls the tab.
  if (event.request.method !== "GET") {
    return;
  }
  const url = new URL(event.request.url);
  const pathname = controlUiPathname(url);
  if (pathname === null) {
    return;
  }

  // Online navigations MUST bypass respondWith: even returning a network 401
  // from a worker suppresses the browser's Basic/Digest/Negotiate auth dialog.
  // onLine is only a browser hint, not an endpoint-reachability test: an outage
  // while it remains true intentionally keeps native network navigation behavior.
  if (event.request.mode === "navigate") {
    if (
      !self.navigator.onLine &&
      (pathname === "/" ||
        pathname === "/new" ||
        pathname === "/new/" ||
        pathname === "/chat" ||
        pathname.startsWith("/chat/"))
    ) {
      event.respondWith(
        caches
          .match(OFFLINE_SHELL_URL, { cacheName: CACHE_NAME })
          .then((cached) => cached || Response.error()),
      );
    }
    return;
  }

  // Cache only immutable build URLs, never arbitrary HTTP reads or credentials.
  // Public asset membership comes from the same build inventory as their version.
  const hashedAsset =
    /^\/assets\/[^/]+-[\w-]{8,}\.(?:js|css|webp|png|svg|woff2)$/u.test(pathname) && !url.search;
  const permitsCache =
    event.request.cache !== "no-store" && !event.request.headers.has("Authorization");

  // Cache-first for hashed assets; network-first for other paths. Versioned
  // public URLs reuse the HTTP immutable cache; unversioned/custom files revalidate.
  if (permitsCache && hashedAsset) {
    event.respondWith(
      matchControlUiAsset(event.request).then(
        (cached) => cached || fetchControlUiRequest(event, true),
      ),
    );
  } else {
    event.respondWith(
      (async () =>
        fetchControlUiRequest(
          event,
          permitsCache && (await isVersionedPublicAsset(url, pathname)),
        ))(),
    );
  }
});

// --- Web Push ---

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "OpenClaw", body: event.data.text() };
  }

  const title = data.title || "OpenClaw";
  const options = {
    body: data.body || "",
    icon: "./apple-touch-icon.png",
    badge: "./favicon-32.png",
    tag: data.tag || "openclaw-notification",
    renotify: data.renotify === true,
    data: {
      url: data.url || self.registration.scope,
      explicitUrl: Boolean(data.url),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Relative targets belong beneath the registered scope even when its URL
  // omits a trailing slash; keep the exact scope for default navigation.
  const scopeNavigationBase = new URL(SCOPE_PATH, SCOPE_URL);
  const notificationUrl = event.notification.data?.url;
  // Notifications shown before an update stored "./" for implicit targets.
  // Preserve their existing in-scope tabs when the new worker handles the click.
  const hasExplicitTarget =
    event.notification.data?.explicitUrl ?? Boolean(notificationUrl && notificationUrl !== "./");
  let targetUrl = SCOPE_URL;
  try {
    const requestedUrl = new URL(
      (hasExplicitTarget ? notificationUrl : undefined) || SCOPE_URL.href,
      scopeNavigationBase,
    );
    if (controlUiPathname(requestedUrl) !== null) {
      targetUrl = requestedUrl;
    }
  } catch {
    // Malformed notification targets can only fall back to the registered app scope.
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      let targetClient;
      let targetClientRank = -1;
      for (const client of clients) {
        let clientUrl;
        try {
          clientUrl = new URL(client.url);
        } catch {
          continue;
        }

        if (controlUiPathname(clientUrl) === null) {
          continue;
        }
        if (!hasExplicitTarget) {
          return client.focus();
        }

        // Prefer the existing target tab before repurposing another app tab.
        // Client.url can lag SPA history, so its match only chooses a candidate.
        const clientRank =
          clientUrl.href === targetUrl.href
            ? 3
            : clientUrl.pathname === targetUrl.pathname
              ? clientUrl.search === targetUrl.search
                ? 2
                : 1
              : 0;
        if (clientRank > targetClientRank) {
          targetClient = client;
          targetClientRank = clientRank;
          if (clientRank === 3) {
            break;
          }
        }
      }

      if (!targetClient) {
        return self.clients.openWindow(targetUrl.href);
      }

      // Always navigate explicit targets; old or uncontrolled workers can
      // reject navigation, so preserve the validated open-window fallback.
      return targetClient
        .navigate(targetUrl.href)
        .then((navigatedClient) => (navigatedClient ?? targetClient).focus())
        .catch(() => self.clients.openWindow(targetUrl.href));
    }),
  );
});
