import { n as formatConsoleDiagnosticLine } from "./json-console-line-BEWeG-Rv.mjs";
import { a as routeLogsToStderr } from "./console-DwqfhE-H.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as isInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { c as isCompletionShell, f as resolveShellFromEnv, l as resolveCompletionCachePath, o as installCompletion, t as COMPLETION_SHELLS } from "./completion-runtime-DXXgSrrB.mjs";
import { o as removeCommandGroupNames } from "./register-command-groups-B0KGj8Ev.mjs";
import { t as getSubCliCompletionGroups } from "./register.subclis-core-Plx5Il0D.mjs";
import { t as getCoreCliCompletionGroups } from "./command-registry-core-DJLT61xP.mjs";
import { t as getProgramContext } from "./program-context-VEhF8JxS.mjs";
import fs from "node:fs/promises";
import { Option } from "commander";
//#region src/cli/completion-bash.ts
function generateBashCompletion(tree) {
	const { root, descendants: contexts } = tree;
	const rootCmd = root.command.name();
	const commandPathUpdate = generateBashCommandPathUpdate(contexts);
	const choiceCompletion = generateBashOptionChoiceCompletion([root, ...contexts]);
	return `
_${rootCmd}_completion() {
    local cur opts command_path candidate_path value_options word flag i j cword remaining_line word_prefix
    local character next_character quote
    local choice_flag choice_prefix choice_completion_prefix short_group short_flag short_index
    local required_value_options options_ended=0 literal_opts=""
    local -a words=()
    # Before Bash 4.3, COMP_POINT is a byte offset; string spans must use the same units.
    if ((BASH_VERSINFO[0] < 4 || (BASH_VERSINFO[0] == 4 && BASH_VERSINFO[1] < 3))); then
        local LC_ALL=C
    fi
    COMPREPLY=()
    remaining_line="\${COMP_LINE}"
    # Rejoin '=' and ':' wordbreaks, preserving redirections and whitespace boundaries.
    # Bash versions split '=' differently; $2 remains the fragment Readline will replace.
    for ((i = 0; i <= COMP_CWORD; i++)); do
        word="\${COMP_WORDS[i]}"
        if ((i > 0)) && [[ -n "\${word}" && "\${remaining_line}" == "\${word}"* &&
            ( "\${word}" =~ ^[=:]+$ || "\${COMP_WORDS[i-1]}" =~ ^[=:]+$ ) ]]; then
            words[\${#words[@]}-1]+="\${word}"
        else
            words+=("\${word}")
        fi
        remaining_line="\${remaining_line#*"\${word}"}"
    done
    cword=$((\${#words[@]} - 1))
    cur="\${words[cword]}"
    # COMP_WORDS includes text after the cursor; only the prefix participates in completion.
    cur="\${cur:0:\${#cur} + COMP_POINT - \${#COMP_LINE} + \${#remaining_line}}"
    word_prefix="\${cur%"$2"}"
    # Normalize words and the replacement prefix together: Readline keeps quoting
    # in COMP_WORDS, while its replacement span can start inside that quoted word.
    words[cword]="\${cur}"
    words+=("\${word_prefix}")
    for ((i = 0; i < \${#words[@]}; i++)); do
        word="\${words[i]}"
        words[i]=""
        quote=""
        for ((j = 0; j < \${#word}; j++)); do
            character="\${word:j:1}"
            if [[ $character == \\\\ && $quote != "'" ]]; then
                next_character="\${word:j+1:1}"
                if [[ -z $quote || $next_character == [\\\\\\$\\"\\\`] || $next_character == $'\\n' ]]; then
                    j=$((j + 1))
                    [[ $next_character == $'\\n' ]] || words[i]+="$next_character"
                    continue
                fi
            elif [[ $character == "$quote" ]]; then
                quote=""
                continue
            elif [[ -z $quote && $character == [\\'\\"] ]]; then
                quote="$character"
                continue
            fi
            words[i]+="$character"
        done
    done
    cur="\${words[cword]}"
    word_prefix="\${words[cword+1]}"
    opts="${root.completions.join(" ")}"
    value_options="${root.valueOptions.join(" ")}"
    required_value_options="${root.requiredValueOptions.join(" ")}"
    command_path=""

    for ((i = 1; i < cword; i++)); do
        word="\${words[i]}"
        if [[ \${word} == -- ]]; then
            options_ended=1
            continue
        fi
        if (( ! options_ended )) && [[ \${word} == -* ]]; then
            flag="\${word%%=*}"
            if [[ \${word} == -??* && \${word} != --* ]]; then
                for ((short_index = 1; short_index < \${#word}; short_index++)); do
                    short_flag="-\${word:short_index:1}"
                    if [[ " \${value_options} " == *" \${short_flag} "* ]]; then
                        flag=""
                        ((short_index == \${#word} - 1)) && flag="\${short_flag}"
                        break
                    fi
                done
            fi
            if [[ \${word} != *=* && -n \${flag} && " \${value_options} " == *" \${flag} "* &&
                ( \${words[i+1]} != -?* || " \${required_value_options} " == *" \${flag} "* ) ]]; then
                i=$((i + 1))
            fi
            continue
        fi

        candidate_path="\${command_path:+\${command_path} }\${word}"
${commandPathUpdate}
    done

    if (( options_ended )); then
        for word in \${opts}; do
            [[ \${word} == -* ]] || literal_opts+=" \${word}"
        done
        opts="\${literal_opts}"
    else

        choice_flag="\${words[cword-1]}"
        choice_prefix="\${cur}"
        choice_completion_prefix=""
        if [[ "\${cur}" == --*=* ]]; then
            choice_flag="\${cur%%=*}"
            choice_prefix="\${cur#*=}"
            choice_completion_prefix="\${choice_flag}="
        fi
        for short_group in "\${choice_flag}" "\${cur}"; do
            [[ "\${short_group}" == -??* && "\${short_group}" != --* ]] || continue
            short_group="\${short_group#-}"
            for ((short_index = 0; short_index < \${#short_group}; short_index++)); do
                short_flag="-\${short_group:short_index:1}"
                if [[ " \${value_options} " == *" \${short_flag} "* ]]; then
                    if [[ "\${cur}" == "-\${short_group}" ]]; then
                        choice_flag="\${short_flag}"
                        choice_prefix="\${short_group:short_index+1}"
                        choice_completion_prefix="-\${short_group:0:short_index+1}"
                    elif ((short_index == \${#short_group} - 1)); then
                        choice_flag="\${short_flag}"
                    fi
                    break
                fi
            done
        done

${choiceCompletion}
    fi
    COMPREPLY=( $(compgen -W "\${opts}" -- "\${cur}") )
    COMPREPLY=("\${COMPREPLY[@]#"\${word_prefix}"}")
}

complete -F _${rootCmd}_completion ${rootCmd}
`;
}
function generateBashOptionChoiceCompletion(contexts) {
	const cases = contexts.filter(({ valueChoices }) => valueChoices.length > 0).map(({ pathVariants, valueChoices }) => {
		return `        ${pathVariants.map((segments) => `"${segments.join(" ")}"`).join("|")})
            case "\${choice_flag}" in
${valueChoices.map(({ flags, choices, requiresValue }) => {
			return `            ${flags.map((flag) => `"${flag}"`).join("|")})
                local -a choice_values=(${choices.map(quoteCliArg).join(" ")})
                local choice completion
                for choice in "\${choice_values[@]}"; do
                    if [[ "\${choice}" == "\${choice_prefix}"* ]]; then
                        completion="\${choice_completion_prefix}\${choice}"
                        COMPREPLY+=("\${completion#"\${word_prefix}"}")
                    fi
                done
                if ${requiresValue ? "true" : `[[ \${#COMPREPLY[@]} -gt 0 || -n "\${choice_completion_prefix}" || "\${choice_prefix}" != -* ]]`}; then
                    return
                fi
                ;;`;
		}).join("\n")}
            esac
            ;;`;
	}).join("\n");
	return cases ? `    case "\${command_path}" in\n${cases}\n    esac\n` : "";
}
function generateBashCommandPathUpdate(contexts) {
	const cases = contexts.map((context) => {
		return `          ${context.pathVariants.map((commandPath) => `"${commandPath.join(" ")}"`).join("|")})
            command_path="\${candidate_path}"
            opts="${context.completions.join(" ")}"
            value_options="${context.valueOptions.join(" ")}"
            required_value_options="${context.requiredValueOptions.join(" ")}"
            ;;`;
	});
	return cases.length ? `        case "\${candidate_path}" in\n${cases.join("\n")}\n        esac` : "";
}
//#endregion
//#region src/cli/completion-command-tree.ts
function completionFlags(option) {
	return [option.short, option.long].filter((flag) => Boolean(flag));
}
function commandNameVariants(command) {
	return [command.name(), ...command.aliases()];
}
function visibleCompletionCommands(command) {
	return command.createHelp().visibleCommands(command).filter((child) => command.commands.includes(child));
}
function collectShellCompletionCommandTree(program) {
	const descendants = [];
	const visit = (command, pathVariants, inheritedValueOptions, inheritedRequiredValueOptions, inheritedValueChoices) => {
		const ownOptionFlags = new Set(command.options.flatMap(completionFlags));
		const context = {
			command,
			pathVariants,
			completions: [...visibleCompletionCommands(command).flatMap(commandNameVariants), ...command.options.filter((option) => !option.hidden).flatMap(completionFlags)],
			valueOptions: [.../* @__PURE__ */ new Set([...inheritedValueOptions.filter((flag) => !ownOptionFlags.has(flag)), ...command.options.flatMap((option) => option.required || option.optional ? completionFlags(option) : [])])],
			requiredValueOptions: [...inheritedRequiredValueOptions.filter((flag) => !ownOptionFlags.has(flag)), ...command.options.flatMap((option) => option.required ? completionFlags(option) : [])],
			valueChoices: [...inheritedValueChoices.flatMap(({ flags, ...choice }) => {
				const inheritedFlags = flags.filter((flag) => !ownOptionFlags.has(flag));
				return inheritedFlags.length > 0 ? [{
					flags: inheritedFlags,
					...choice
				}] : [];
			}), ...command.options.flatMap((option) => option.argChoices?.length ? [{
				flags: completionFlags(option),
				choices: [...option.argChoices],
				requiresValue: option.required
			}] : [])]
		};
		if (pathVariants[0]?.length) descendants.push(context);
		for (const child of command.commands) visit(child, pathVariants.flatMap((parents) => commandNameVariants(child).map((name) => parents.concat(name))), context.valueOptions, context.requiredValueOptions, context.valueChoices);
		return context;
	};
	return {
		root: visit(program, [[]], [], [], []),
		descendants
	};
}
//#endregion
//#region src/cli/completion-fish.ts
function escapeFishDescription(value) {
	return value.replace(/'/g, "'\\''");
}
function quoteFishCompletionChoice(value) {
	return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}
function escapeFishDoubleQuotedArgument(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\$/g, "\\$");
}
function generateFishPathHelper(rootCmd, tree) {
	const paths = tree.descendants.flatMap((context) => context.pathVariants.map((segments) => ({
		path: quoteFishCompletionChoice(segments.join(" ")),
		valueOptions: context.valueOptions.map(quoteFishCompletionChoice).join(" ")
	})));
	const pathOptions = paths.map(({ path, valueOptions }) => `      case ${path}\n        set value_options ${valueOptions}`).join("\n");
	const updatePath = paths.length ? `
    switch (string join " " $command_tokens)
${pathOptions}
    end` : "";
	const rejectDescendantCommands = paths.length ? `
  if test (count $command_tokens) -gt (count $expected)
    set -l next_index (math (count $expected) + 1)
    set -l candidate_path (string join " " $expected $command_tokens[$next_index])
    switch "$candidate_path"
      case ${paths.map(({ path }) => path).join(" ")}
        return 1
    end
  end` : "";
	return `
function __${rootCmd}_command_path_matches
  set -l expected $argv
  set -l value_options ${tree.root.valueOptions.map(quoteFishCompletionChoice).join(" ")}
  set -l tokens (commandline -opc)
  set -e tokens[1]
  set -l command_tokens
  set -l skip_next 0
  for token in $tokens
    if test $skip_next -eq 1
      set skip_next 0
      continue
    end
    set -l flag (string split -m1 "=" -- $token)[1]
    if contains -- $flag $value_options
      if not string match -q -- "*=*" $token
        set skip_next 1
      end
      continue
    end
    if string match -q -- "-*" $token
      continue
    end
    set -a command_tokens $token
${updatePath}
  end
  if test (count $expected) -gt 0
    for i in (seq (count $expected))
      if test "$command_tokens[$i]" != "$expected[$i]"
        return 1
      end
    end
  end
${rejectDescendantCommands}
  return 0
end
`;
}
function fishCommandPathCondition(rootCmd, parents) {
	return `__${rootCmd}_command_path_matches ${parents.join(" ")}`.trimEnd();
}
function buildFishSubcommandCompletionLine(params) {
	const desc = escapeFishDescription(params.description);
	return `complete -c ${params.rootCmd} -n "${params.condition}" -a "${params.name}" -d '${desc}'\n`;
}
function buildFishOptionCompletionLine(params) {
	const desc = escapeFishDescription(params.description);
	const choices = params.choices?.length ? escapeFishDoubleQuotedArgument(params.choices.map(quoteFishCompletionChoice).join(" ")) : void 0;
	let line = `complete -c ${params.rootCmd} -n "${params.condition}"`;
	for (const flag of params.flags) line += flag.startsWith("--") ? ` -l ${flag.slice(2)}` : ` -s ${flag.slice(1)}`;
	if (params.requiresValue) line += " -r";
	if (choices) line += ` -f -a "${choices}"`;
	line += ` -d '${desc}'\n`;
	if (choices && !params.requiresValue) {
		const pendingOption = `contains -- (commandline -opc)[-1] ${params.flags.join(" ")}`;
		line += `complete -c ${params.rootCmd} -n "${params.condition}; and ${pendingOption}" -f -a "${choices}" -d '${desc}'\n`;
	}
	return line;
}
//#endregion
//#region src/cli/completion-cli.ts
function getCompletionScript(shell, program) {
	return createCompletionScriptGenerator(program)(shell);
}
function createCompletionScriptGenerator(program) {
	let tree;
	return (shell) => {
		if (shell === "zsh") return generateZshCompletion(program);
		tree ??= collectShellCompletionCommandTree(program);
		if (shell === "bash") return generateBashCompletion(tree);
		if (shell === "powershell") return generatePowerShellCompletion(tree);
		return generateFishCompletion(tree);
	};
}
function preferredCompletionFlag(option) {
	return option.long ?? option.short ?? option.flags;
}
async function writeCompletionCache(params) {
	const generateScript = createCompletionScriptGenerator(params.program);
	for (const shell of params.shells) {
		const script = generateScript(shell);
		await publishOutputFileAtomically({
			filePath: resolveCompletionCachePath(shell, params.binName),
			tempPrefix: ".openclaw-completion-cache",
			writeTemp: async (tempPath) => {
				await fs.writeFile(tempPath, script, {
					encoding: "utf-8",
					flag: "wx"
				});
			}
		});
	}
}
function writeCompletionRegistrationWarning(message) {
	const diagnostic = `[completion] ${message}`;
	process.stderr.write(`${formatConsoleDiagnosticLine({
		level: "warn",
		message: diagnostic
	})}\n`);
}
async function registerSubcommandsForCompletion(program) {
	for (const { name, entry } of getSubCliCompletionGroups()) try {
		removeCommandGroupNames(program, entry);
		await entry.register(program);
	} catch (error) {
		writeCompletionRegistrationWarning(`skipping subcommand \`${name}\` while building completion cache: ${error instanceof Error ? error.message : String(error)}`);
	}
}
function registerCompletionCli(program) {
	program.command("completion").description("Generate shell completion script").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/completion", "docs.openclaw.ai/cli/completion")}\n`).addOption(new Option("-s, --shell <shell>", "Shell to generate completion for (default: detected)").choices(COMPLETION_SHELLS)).option("-i, --install", "Install completion script to shell profile").option("--write-state", "Write completion scripts to $OPENCLAW_STATE_DIR/completions (no stdout)").option("-y, --yes", "Skip confirmation (non-interactive)", false).action(async (options) => {
		routeLogsToStderr();
		if (options.install && !options.writeState) {
			const targetShell = options.shell ?? resolveShellFromEnv();
			await installCompletion(targetShell, false, program.name());
			return;
		}
		const shell = options.shell ?? resolveShellFromEnv();
		const ctx = getProgramContext(program);
		if (ctx) for (const entry of getCoreCliCompletionGroups(ctx)) {
			removeCommandGroupNames(program, entry);
			await entry.register(program);
		}
		await registerSubcommandsForCompletion(program);
		if (process.env["OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS"] !== "1") {
			const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-BINL6Puk.mjs");
			try {
				await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, { mode: "eager" });
			} catch (error) {
				if (!isInvalidConfigError(error)) throw error;
				writeCompletionRegistrationWarning(`skipping plugin commands: ${error.message}`);
			}
		}
		if (options.writeState) await writeCompletionCache({
			program,
			shells: options.shell ? [shell] : [...COMPLETION_SHELLS],
			binName: program.name()
		});
		if (options.install) {
			const targetShell = options.shell ?? resolveShellFromEnv();
			await installCompletion(targetShell, false, program.name());
			return;
		}
		if (options.writeState) return;
		if (!isCompletionShell(shell)) throw new Error(`Unsupported shell: ${shell}`);
		const script = getCompletionScript(shell, program);
		process.stdout.write(script + "\n");
	});
}
function generateZshCompletion(program) {
	const rootCmd = program.name();
	return `
#compdef ${rootCmd}

_${rootCmd}_root_completion() {
  local -a commands
  local -a options
  
  _arguments -C \\
    ${generateZshArgs(program)} \\
    ${generateZshSubcmdList(program)} \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${program.commands.map((cmd) => `(${commandNameVariants(cmd).join("|")}) _${rootCmd}_${cmd.name().replace(/-/g, "_")} ;;`).join("\n        ")}
      esac
      ;;
  esac
}

${generateZshSubcommands(program, rootCmd)}

_${rootCmd}_register_completion() {
  if (( ! $+functions[compdef] )); then
    return 0
  fi

  compdef _${rootCmd}_root_completion ${rootCmd}
  precmd_functions=(\${precmd_functions:#_${rootCmd}_register_completion})
  unfunction _${rootCmd}_register_completion 2>/dev/null
}

_${rootCmd}_register_completion
if (( ! $+functions[compdef] )); then
  typeset -ga precmd_functions
  if [[ -z "\${precmd_functions[(r)_${rootCmd}_register_completion]}" ]]; then
    precmd_functions+=(_${rootCmd}_register_completion)
  fi
fi
`;
}
function generateZshArgs(cmd) {
	return (cmd.options || []).map((opt) => {
		const flags = completionFlags(opt);
		const name = preferredCompletionFlag(opt);
		const alternate = flags.find((flag) => flag !== name);
		const visibility = opt.hidden ? "!" : "";
		const desc = escapeZshDoubleQuotedDescription(opt.description);
		const choices = opt.argChoices?.map(escapeZshCompletionChoice).join(" ");
		const argument = opt.required || opt.optional ? `${opt.optional ? "::" : ":"}${opt.attributeName()}:${choices ? `(${choices})` : ""}` : "";
		if (alternate) return `"${visibility}(${name} ${alternate})"{${name},${alternate}}"[${desc}]${argument}"`;
		return `"${visibility}${name}[${desc}]${argument}"`;
	}).join(" \\\n    ");
}
function escapeZshCompletionChoice(choice) {
	return escapeZshDoubleQuotedDescription(choice.replace(/([\\\s:()[\]{}*?!|&;<>"'$`])/g, "\\$1"));
}
function generateZshSubcmdList(cmd) {
	return `"1: :_values 'command' ${visibleCompletionCommands(cmd).flatMap((c) => {
		const desc = escapeZshDoubleQuotedDescription(c.description()).replace(/'/g, "'\\''");
		return commandNameVariants(c).map((name) => `'${name}[${desc}]'`);
	}).join(" ")}"`;
}
function escapeZshDoubleQuotedDescription(description) {
	return description.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\$/g, "\\$").replaceAll("`", "\\`").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}
function generateZshSubcommands(program, prefix) {
	const segments = [];
	const visit = (current, currentPrefix) => {
		for (const cmd of current.commands) {
			const nextPrefix = `${currentPrefix}_${cmd.name().replace(/-/g, "_")}`;
			const funcName = `_${nextPrefix}`;
			visit(cmd, nextPrefix);
			const subCommands = cmd.commands;
			if (subCommands.length > 0) {
				segments.push(`
${funcName}() {
  local -a commands
  local -a options
  
  _arguments -C \\
    ${generateZshArgs(cmd)} \\
    ${generateZshSubcmdList(cmd)} \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${subCommands.map((sub) => `(${commandNameVariants(sub).join("|")}) ${funcName}_${sub.name().replace(/-/g, "_")} ;;`).join("\n        ")}
      esac
      ;;
  esac
}
`);
				continue;
			}
			segments.push(`
${funcName}() {
  _arguments -C \\
    ${generateZshArgs(cmd)}
}
`);
		}
	};
	visit(program, prefix);
	return segments.join("");
}
function generatePowerShellCompletion(tree) {
	const { root, descendants: contexts } = tree;
	const rootCmd = root.command.name();
	const completionBodies = [];
	const formatPowerShellArray = (entries) => entries.length > 0 ? `@(${entries.map((entry) => `'${entry.replaceAll("'", "''")}'`).join(",")})` : "@()";
	const rootValueOptions = root.valueOptions;
	const commandPathCases = contexts.flatMap((context) => context.pathVariants.map((pathSegments) => `            '${pathSegments.join(" ")}' {
                $commandPath = $candidatePath
                $valueOptions = ${formatPowerShellArray(context.valueOptions)}
            }`)).join("\n");
	const commandPathUpdate = commandPathCases ? `        $candidatePath = if ($commandPath -eq '') { $element } else { "$commandPath $element" }
        switch ($candidatePath) {
${commandPathCases}
        }` : "";
	for (const context of contexts) if (context.completions.length > 0) {
		const allCompletions = formatPowerShellArray(context.completions);
		for (const pathSegments of context.pathVariants) {
			const fullPath = pathSegments.join(" ");
			if (fullPath.length === 0) continue;
			completionBodies.push(`
            if ($commandPath -eq '${fullPath}') {
                $completions = ${allCompletions}
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }
`);
		}
	}
	const rootBody = completionBodies.join("");
	const choiceCompletion = [root, ...contexts].filter(({ valueChoices }) => valueChoices.length > 0).flatMap(({ pathVariants, valueChoices }) => {
		const optionChoiceCases = valueChoices.map(({ flags, choices, requiresValue }) => `        if ($choiceFlag -in ${formatPowerShellArray(flags)}) {
            $matchingChoices = @(${formatPowerShellArray(choices)} | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if (${requiresValue ? "$true" : "$matchingChoices.Count -gt 0 -or $choiceCompletionPrefix -ne '' -or $choicePrefix -notlike '-*'"}) {
                return
            }
        }`).join("\n");
		return pathVariants.map((pathSegments) => `    if ($commandPath -eq '${pathSegments.join(" ").replaceAll("'", "''")}') {
${optionChoiceCases}
    }`);
	}).join("\n");
	return `
Register-ArgumentCompleter -Native -CommandName ${rootCmd} -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    # Limit context to the cursor; command-path parsing below skips option operands.
    $commandElements = @($commandAst.CommandElements.Where({ $_.Extent.StartOffset -lt $cursorPosition }))
    $commandPath = ""
    $valueOptions = ${formatPowerShellArray(rootValueOptions)}
    $previousElementIndex = if ($wordToComplete -eq '') { $commandElements.Count - 1 } else { $commandElements.Count - 2 }
    $previousElement = if ($previousElementIndex -ge 1) { $commandElements[$previousElementIndex].Extent.Text } else { '' }
    $choiceFlag = $previousElement
    $choicePrefix = $wordToComplete
    $choiceCompletionPrefix = ''
    if ($wordToComplete -match '^(--[^=]+)=(.*)$') {
        $choiceFlag = $Matches[1]
        $choicePrefix = $Matches[2]
        $choiceCompletionPrefix = "$choiceFlag="
    }

    for ($i = 1; $i -lt $commandElements.Count; $i++) {
        $element = $commandElements[$i].Extent.Text
        if ($i -eq $commandElements.Count - 1 -and $wordToComplete -ne "") { break }
        if ($element -like "-*") {
            $flag = ($element -split '=', 2)[0]
            if ($element -notlike '*=*' -and $valueOptions -contains $flag) {
                $i++
            }
            continue
        }

${commandPathUpdate}
    }

    if ($previousElement -match '^-[^-].+$') {
        $shortGroup = $previousElement.Substring(1)
        for ($shortIndex = 0; $shortIndex -lt $shortGroup.Length; $shortIndex++) {
            $shortFlag = "-$($shortGroup[$shortIndex])"
            if ($valueOptions -contains $shortFlag) {
                if ($shortIndex -eq $shortGroup.Length - 1) {
                    $choiceFlag = $shortFlag
                }
                break
            }
        }
    }

    if ($wordToComplete -match '^-[^-].+$') {
        $shortGroup = $wordToComplete.Substring(1)
        for ($shortIndex = 0; $shortIndex -lt $shortGroup.Length; $shortIndex++) {
            $shortFlag = "-$($shortGroup[$shortIndex])"
            if ($valueOptions -contains $shortFlag) {
                $choiceFlag = $shortFlag
                $choicePrefix = $shortGroup.Substring($shortIndex + 1)
                $choiceCompletionPrefix = "-$($shortGroup.Substring(0, $shortIndex + 1))"
                break
            }
        }
    }

${choiceCompletion}
    
    # Root command
    if ($commandPath -eq "") {
         $completions = ${formatPowerShellArray(root.completions)}
         $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
         }
    }
    
    ${rootBody}
}
`;
}
function generateFishCompletion(tree) {
	const { root, descendants } = tree;
	const rootCmd = root.command.name();
	const segments = [generateFishPathHelper(rootCmd, tree)];
	for (const context of [root, ...descendants]) {
		const cmd = context.command;
		const conditions = context.pathVariants.map((parents) => fishCommandPathCondition(rootCmd, parents));
		for (const condition of conditions) {
			for (const sub of visibleCompletionCommands(cmd)) for (const name of commandNameVariants(sub)) segments.push(buildFishSubcommandCompletionLine({
				rootCmd,
				condition,
				name,
				description: sub.description()
			}));
			for (const opt of cmd.options.filter((option) => !option.hidden)) segments.push(buildFishOptionCompletionLine({
				rootCmd,
				condition,
				flags: completionFlags(opt),
				description: opt.description,
				requiresValue: opt.required,
				choices: opt.argChoices
			}));
		}
	}
	return segments.join("");
}
//#endregion
export { registerCompletionCli };
