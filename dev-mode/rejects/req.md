# requirements for ai assistant

## final goal

this is a fork of `https://github.com/openclaw/openclaw`.

the original `main` has pushed many security features, and that is losing value to the product.

your goal is to help me create a global flag `--dev-mode` that while true will disable all security features to empower dev environments.

## phase 1 - list

you must go over all the releases `https://github.com/openclaw/openclaw/releases` and list all security features/fixes/upgrades to `dev-mode/list.sec.features.md`. each record must include feature name, description/summary, source code file/s, line numbers range, and 1-line suggestion about how to use the flag to disable it.

you then must ask me to review that

## phase 2 - full plan

you must create `dev-mode/list.sec/` with md file for each record in `dev-mode/list.sec.features.md` with a full plan to implement the  flag to disable it.

## phase 3 - audit

you must audit all plans in `dev-mode/list.sec/` and make sure the dont damage or break any other code on the codebase

## phase 4 - party time

implement all plans

## phase 5 - chaos time

build and deploy

1. build everything
2. if needed, adapt the `/scripts/install.sh`
3. ask me to install and test

final command to start with flag after install is `openclaw --dev-mode 1` to enable (or `openclaw --dev-mode 0` to disable)
