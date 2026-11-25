import{i as consumeRootOptionToken}from"./cli-root-options-eez2TgAl.mjs";import{i as writeConsoleDiagnosticWarning}from"./json-console-line-CV4dY1Ee.mjs";import{i as routeLogsToStderr}from"./console-D4tM82ug.mjs";import{s as isInvalidConfigError}from"./io.invalid-config-B2POcxOa.mjs";import{n as quotePowerShellArg,t as quoteCliArg}from"./quote-cli-arg-BUHoGELl.mjs";import{r as theme}from"./theme-DS2CtI9X.mjs";import{t as formatDocsLink}from"./links-C_FK9uVv.mjs";import{t as publishOutputFileAtomically}from"./output-file.runtime.js";import{c as isCompletionShell,n as COMPLETION_SKIP_PLUGIN_COMMANDS_ENV,o as installCompletion,p as resolveShellFromEnv,t as COMPLETION_SHELLS,u as resolveCompletionCachePath}from"./completion-runtime-DVdfF8eq.mjs";import{o as removeCommandGroupNames}from"./register-command-groups-BCX2Ztb1.mjs";import{t as getCoreCliCompletionGroups}from"./command-registry-core-DhXO-rWf.mjs";import{t as getProgramContext}from"./program-context-DC_lfg2Y.mjs";import{t as getSubCliCompletionGroups}from"./register.subclis-CUHwNXSc.mjs";import fs from"node:fs/promises";import{Option}from"commander";
//!src/cli/completion-bash.ts
function generateBashCompletion(e){const{root:t,descendants:n}=e;const r=t.command.name();const i=n.map(e=>{return`          ${e.pathVariants.map(e=>`"${e.join(` `)}"`).join(`|`)})
            command_path="\${candidate_path}"
            opts="${e.completions.join(` `)}"
            value_options="${e.valueOptions.join(` `)}"
            required_value_options="${e.requiredValueOptions.join(` `)}"
            ;;`});const a=i.length?`        case "\${candidate_path}" in\n${i.join(`
`)}\n        esac`:``;const o=[t,...n].filter(({valueChoices:e})=>e.length>0).map(({pathVariants:e,valueChoices:t})=>{return`        ${e.map(e=>`"${e.join(` `)}"`).join(`|`)})
            case "\${choice_flag}" in
${t.map(({flags:e,choices:t,requiresValue:n})=>{return`            ${e.map(e=>`"${e}"`).join(`|`)})
                local -a choice_values=(${t.map(quoteCliArg).join(` `)})
                local choice completion
                for choice in "\${choice_values[@]}"; do
                    if [[ "\${choice}" == "\${choice_prefix}"* ]]; then
                        completion="\${choice_completion_prefix}\${choice}"
                        COMPREPLY+=("\${completion#"\${word_prefix}"}")
                    fi
                done
                if ${n?`true`:`[[ \${#COMPREPLY[@]} -gt 0 || -n "\${choice_completion_prefix}" || "\${choice_prefix}" != -* ]]`}; then
                    return
                fi
                ;;`}).join(`
`)}
            esac
            ;;`}).join(`
`);const s=o?`    case "\${command_path}" in\n${o}\n    esac\n`:``;return`
_${r}_completion() {
    local cur opts command_path candidate_path value_options word flag i j cword remaining_line word_prefix
    local character next_character quote prefix_length word_length
    local choice_flag choice_prefix choice_completion_prefix short_group short_flag short_index
    local required_value_options options_ended=0 operand_flag="" literal_opts=""
    local redirection_target=0 redirection_re='(<|>|>>|<<-?|<<<|<>|<&|>&|>[|]|&>|&>>)'
    local descriptor_re='^[0-9]+$'
    local -a words=() argument_words=() shell_words=()
    if ((BASH_VERSINFO[0] > 4 || (BASH_VERSINFO[0] == 4 && BASH_VERSINFO[1] >= 1))); then
        descriptor_re='^([0-9]+|[{][a-zA-Z_][a-zA-Z0-9_]*[}])$'
    fi
    # Before Bash 4.3, COMP_POINT is a byte offset; string spans must use the same units.
    if ((BASH_VERSINFO[0] < 4 || (BASH_VERSINFO[0] == 4 && BASH_VERSINFO[1] < 3))); then
        local LC_ALL=C
    fi
    COMPREPLY=()
    remaining_line="\${COMP_LINE}"
    # Readline can group adjacent wordbreaks, including a redirection and '=' or ':'.
    for word in "\${COMP_WORDS[@]:0:COMP_CWORD+1}"; do
        word_length=\${#word}
        remaining_line="\${remaining_line#*"\${word}"}"
        # Trim the original span before splitting; COMP_WORDS can extend past the cursor.
        prefix_length=$((\${#word} + COMP_POINT - \${#COMP_LINE} + \${#remaining_line}))
        if ((prefix_length < \${#word})); then
            word="\${word:0:prefix_length}"
        fi
        if [[ \${word} =~ ^([=:]*)\${redirection_re}([=:]*)$ ]]; then
            [[ -n \${BASH_REMATCH[1]} ]] && shell_words+=("\${BASH_REMATCH[1]}")
            shell_words+=("\${BASH_REMATCH[2]}")
            [[ -n \${BASH_REMATCH[3]} ]] && shell_words+=("\${BASH_REMATCH[3]}")
        else
            shell_words+=("\${word}")
        fi
        ((prefix_length < word_length)) && break
    done
    remaining_line="\${COMP_LINE}"
    # Rejoin '=' and ':' wordbreaks, preserving redirections and whitespace boundaries.
    # Bash versions split '=' differently; $2 remains the fragment Readline will replace.
    for ((i = 0; i < \${#shell_words[@]}; i++)); do
        word="\${shell_words[i]}"
        # Only an adjacent, unquoted descriptor belongs to the redirection.
        if [[ \${word} =~ ^\${redirection_re}$ && \${word} != '&'* &&
            \${remaining_line} == "\${word}"* && \${words[\${#words[@]}-1]} =~ \${descriptor_re} &&
            ! \${words[\${#words[@]}-2]} =~ ^\${redirection_re}$ ]]; then
            unset "words[$((\${#words[@]} - 1))]"
        fi
        if ((i > 0)) && [[ -n "\${word}" && "\${remaining_line}" == "\${word}"* &&
            ! \${word} =~ ^\${redirection_re}$ && ! \${shell_words[i-1]} =~ ^\${redirection_re}$ &&
            ( "\${word}" =~ ^[=:]+$ || "\${shell_words[i-1]}" =~ ^[=:]+$ ) ]]; then
            words[\${#words[@]}-1]+="\${word}"
        else
            words+=("\${word}")
        fi
        remaining_line="\${remaining_line#*"\${word}"}"
    done
    cword=$((\${#words[@]} - 1))
    cur="\${words[cword]}"
    word_prefix="\${cur%"$2"}"
    # Normalize words and the replacement prefix together: Readline keeps quoting
    # in COMP_WORDS, while its replacement span can start inside that quoted word.
    words[cword]="\${cur}"
    # Rejoined redirection targets are shell syntax, never CLI option operands or commands.
    for ((i = 0; i <= cword; i++)); do
        if ((redirection_target)); then
            ((i == cword)) && return
            redirection_target=0
        elif [[ \${words[i]} =~ ^\${redirection_re}$ ]]; then
            redirection_target=1
        else
            argument_words+=("\${words[i]}")
        fi
    done
    ((redirection_target)) && return
    words=("\${argument_words[@]}")
    cword=$((\${#words[@]} - 1))
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
    opts="${t.completions.join(` `)}"
    value_options="${t.valueOptions.join(` `)}"
    required_value_options="${t.requiredValueOptions.join(` `)}"
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
                ((i == cword)) && operand_flag="\${flag}"
            fi
            continue
        fi

        candidate_path="\${command_path:+\${command_path} }\${word}"
${a}
    done

    if (( options_ended )); then
        for word in \${opts}; do
            [[ \${word} == -* ]] || literal_opts+=" \${word}"
        done
        opts="\${literal_opts}"
    else

        choice_flag="\${operand_flag:-\${words[cword-1]}}"
        choice_prefix="\${cur}"
        choice_completion_prefix=""
        if [[ -z "\${operand_flag}" && "\${cur}" == --*=* ]]; then
            choice_flag="\${cur%%=*}"
            choice_prefix="\${cur#*=}"
            choice_completion_prefix="\${choice_flag}="
        fi
        for short_group in "\${choice_flag}" "\${cur}"; do
            [[ -z "\${operand_flag}" && "\${short_group}" == -??* && "\${short_group}" != --* ]] || continue
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

${s}
        if [[ -n "\${operand_flag}" ]]; then
            return
        fi
    fi
    COMPREPLY=( $(compgen -W "\${opts}" -- "\${cur}") )
    COMPREPLY=("\${COMPREPLY[@]#"\${word_prefix}"}")
}

complete -F _${r}_completion ${r}
`}
//!src/cli/completion-command-tree.ts
function completionFlags(e){return[e.short,e.long].filter(e=>Boolean(e))}function completionOptions(e){const t=[.../* @__PURE__ */ new Set([...e.options,...e.createHelp().visibleOptions(e)])].map(e=>({option:e,flags:completionFlags(e)}));const n=new Set(t.flatMap(({flags:e})=>e));let r=e;while(r.parent){if(r!==e)for(const e of r.options.flatMap(completionFlags))n.add(e);r=r.parent}if(r!==e)for(const e of r.options){const r=completionFlags(e).filter(e=>!n.has(e)&&consumeRootOptionToken([e],0)>0);if(r.length>0)t.push({option:e,flags:r})}return t}function commandNameVariants(e){return[e.name(),...e.aliases()]}function visibleCompletionCommands(e){return e.createHelp().visibleCommands(e).filter(t=>e.commands.includes(t))}function collectShellCompletionCommandTree(e){const t=[];const visit=(e,n,r)=>{const i=new Set(e.options.flatMap(completionFlags));const a={command:e,pathVariants:n,completions:[...visibleCompletionCommands(e).flatMap(commandNameVariants),...completionOptions(e).filter(({option:e})=>!e.hidden).flatMap(({flags:e})=>e)],valueOptions:[.../* @__PURE__ */ new Set([...(r?.valueOptions??[]).filter(e=>!i.has(e)),...e.options.flatMap(e=>e.required||e.optional?completionFlags(e):[])])],requiredValueOptions:[...(r?.requiredValueOptions??[]).filter(e=>!i.has(e)),...e.options.flatMap(e=>e.required?completionFlags(e):[])],valueChoices:[...(r?.valueChoices??[]).flatMap(({flags:e,...t})=>{const n=e.filter(e=>!i.has(e));return n.length>0?[{flags:n,...t}]:[]}),...e.options.flatMap(e=>e.argChoices?.length?[{flags:completionFlags(e),choices:[...e.argChoices],requiresValue:e.required}]:[])]};if(n[0]?.length)t.push(a);for(const t of e.commands)visit(t,n.flatMap(e=>commandNameVariants(t).map(t=>e.concat(t))),a);return a};return{root:visit(e,[[]]),descendants:t}}
//!src/cli/completion-cli.ts
function getCompletionScript(e,t){return createCompletionScriptGenerator(t)(e)}function createCompletionScriptGenerator(e){let t;return n=>{if(n===`zsh`)return generateZshCompletion(e);t??=collectShellCompletionCommandTree(e);if(n===`bash`)return generateBashCompletion(t);if(n===`powershell`)return generatePowerShellCompletion(t);return generateFishCompletion(t)}}function writeCompletionRegistrationWarning(e){const t=`[completion] ${e}`;writeConsoleDiagnosticWarning(t)}function registerCompletionCli(e){e.command(`completion`).description(`Generate shell completion script`).addHelpText(`after`,()=>`\n${theme.muted(`Docs:`)} ${formatDocsLink(`/cli/completion`,`docs.openclaw.ai/cli/completion`)}\n`).addOption(new Option(`-s, --shell <shell>`,`Shell to generate completion for (default: detected)`).choices(COMPLETION_SHELLS)).option(`-i, --install`,`Install completion script to shell profile`).option(`--write-state`,`Write completion scripts to $OPENCLAW_STATE_DIR/completions (no stdout)`).option(`-y, --yes`,`Skip confirmation (non-interactive)`,false).action(async t=>{routeLogsToStderr();if(t.install&&!t.writeState){const n=t.shell??resolveShellFromEnv();await installCompletion(n,false,e.name());return}const n=t.shell??resolveShellFromEnv();const r=getProgramContext(e);if(r)for(const t of getCoreCliCompletionGroups(r)){removeCommandGroupNames(e,t);await t.register(e)}for(const{name:t,entry:n}of getSubCliCompletionGroups())try{removeCommandGroupNames(e,n);await n.register(e)}catch(e){writeCompletionRegistrationWarning(`skipping subcommand \`${t}\` while building completion cache: ${e instanceof Error?e.message:String(e)}`)}if(process.env[`OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS`]!==`1`){const{registerPluginCliCommandsFromValidatedConfig:t}=await import(`./cli-DZyTjuxb.mjs`);try{await t(e,void 0,void 0,{mode:`eager`})}catch(e){if(!isInvalidConfigError(e))throw e;writeCompletionRegistrationWarning(`skipping plugin commands: ${e.message}`)}}if(t.writeState){const r=t.shell?[n]:[...COMPLETION_SHELLS];const i=e.name();const a=createCompletionScriptGenerator(e);for(const e of r){const t=a(e);const n=e===`powershell`&&process.platform===`win32`&&/\P{ASCII}/u.test(t)?`\uFEFF${t}`:t;await publishOutputFileAtomically({filePath:resolveCompletionCachePath(e,i),tempPrefix:`.openclaw-completion-cache`,writeTemp:async e=>{await fs.writeFile(e,n,{encoding:`utf-8`,flag:`wx`})}})}}if(t.install){const n=t.shell??resolveShellFromEnv();await installCompletion(n,false,e.name());return}if(t.writeState)return;if(!isCompletionShell(n))throw new Error(`Unsupported shell: ${n}`);const i=getCompletionScript(n,e);process.stdout.write(i+`
`)})}function generateZshCompletion(e){const t=e.name();return`
#compdef ${t}

${generateZshCommandGroup(e,`_${t}_root_completion`,`_${t}_command`)}

${generateZshSubcommands(e,`_${t}_command`)}

_${t}_register_completion() {
  if (( ! $+functions[compdef] )); then
    return 0
  fi

  compdef _${t}_root_completion ${t}
  precmd_functions=(\${precmd_functions:#_${t}_register_completion})
  unfunction _${t}_register_completion 2>/dev/null
}

_${t}_register_completion
if (( ! $+functions[compdef] )); then
  typeset -ga precmd_functions
  if [[ -z "\${precmd_functions[(r)_${t}_register_completion]}" ]]; then
    precmd_functions+=(_${t}_register_completion)
  fi
fi
`}function generateZshArgs(e){return completionOptions(e).map(({option:e,flags:t})=>{const n=t.find(t=>t===e.long)??t[0]??e.flags;const r=t.find(e=>e!==n);const i=e.hidden?`!`:``;const a=escapeZshDoubleQuotedDescription(e.description);const o=e.argChoices?.map(escapeZshCompletionChoice).join(` `);const s=e.required||e.optional?`${e.optional?`::`:`:`}${e.attributeName()}:${o?`(${o})`:``}`:``;const optionSpec=e=>s&&e.startsWith(`--`)?`${e}=`:e;if(r)return`"${i}(${n} ${r})"{${optionSpec(n)},${optionSpec(r)}}"[${a}]${s}"`;return`"${i}${optionSpec(n)}[${a}]${s}"`}).join(` \\
    `)}function escapeZshCompletionChoice(e){return escapeZshDoubleQuotedDescription(e.replace(/([\\\s:()[\]{}*?!|&;<>"'$`])/g,`\\$1`))}function escapeZshDoubleQuotedDescription(e){return e.replace(/[\\$"`[\]]/g,`\\$&`)}function zshSubcommandFunctionName(e,t){return`${e}_${t}`}function generateZshCommandGroup(e,t,n=t){return`${t}() {
  local -a commands
  local -a options
  
  _arguments -s -C \\
    ${generateZshArgs(e)} \\
    "1: :_values 'command' ${visibleCompletionCommands(e).flatMap(e=>{const t=escapeZshDoubleQuotedDescription(e.description()).replace(/'/g,`'\\''`);return commandNameVariants(e).map(e=>`'${e}[${t}]'`)}).join(` `)}" \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${e.commands.map((e,t)=>`(${commandNameVariants(e).join(`|`)}) ${zshSubcommandFunctionName(n,t)} ;;`).join(`
        `)}
      esac
      ;;
  esac
}`}function generateZshSubcommands(e,t){return e.commands.map((e,n)=>{const r=zshSubcommandFunctionName(t,n);const i=e.commands.length>0?`\n${generateZshCommandGroup(e,r)}\n`:`
${r}() {
  _arguments -s -C \\
    ${generateZshArgs(e)}
}
`;return generateZshSubcommands(e,r)+i}).join(``)}function generatePowerShellCompletion(e){const{root:t,descendants:n}=e;const r=t.command.name();const formatPowerShellArray=e=>`@(${e.map(quotePowerShellArg).join(`,`)})`;const i=n.flatMap(e=>e.pathVariants.map(t=>`            ${quotePowerShellArg(t.join(` `))} {
                $commandPath = $candidatePath
                $valueOptions = ${formatPowerShellArray(e.valueOptions)}
                $requiredValueOptions = ${formatPowerShellArray(e.requiredValueOptions)}
            }`)).join(`
`);const a=i?`        $candidatePath = if ($commandPath -eq '') { $element } else { "$commandPath $element" }
        switch ($candidatePath) {
${i}
        }`:``;const o=n.filter(e=>e.completions.length>0).flatMap(e=>{const t=formatPowerShellArray(e.completions);return e.pathVariants.map(e=>e.join(` `)).filter(Boolean).map(e=>`
            if ($commandPath -eq ${quotePowerShellArg(e)}) {
                $completions = ${t}
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }
`)}).join(``);const s=[t,...n].filter(({valueChoices:e})=>e.length>0).flatMap(({pathVariants:e,valueChoices:t})=>{const n=t.map(({flags:e,choices:t,requiresValue:n})=>`        if ($choiceFlag -in ${formatPowerShellArray(e)}) {
            $matchingChoices = @(${formatPowerShellArray(t)} | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + [regex]::Replace($_, "['‘-‛]", '$0$0') + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if (${n?`$true`:`$matchingChoices.Count -gt 0 -or $choiceCompletionPrefix -ne '' -or $choicePrefix -notlike '-*'`}) {
                return
            }
        }`).join(`
`);return e.map(e=>`    if ($commandPath -eq ${quotePowerShellArg(e.join(` `))}) {
${n}
    }`)}).join(`
`);return`
Register-ArgumentCompleter -Native -CommandName ${r} -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    # Limit context to the cursor; command-path parsing below skips option operands.
    $commandElements = @($commandAst.CommandElements.Where({ $_.Extent.StartOffset -lt $cursorPosition }))
    $commandPath = ""
    $valueOptions = ${formatPowerShellArray(t.valueOptions)}
    $requiredValueOptions = ${formatPowerShellArray(t.requiredValueOptions)}
    $pendingRequiredValue = $false
    $hasCurrentWord = $wordToComplete -ne ''
    $previousElementIndex = if ($hasCurrentWord) { $commandElements.Count - 2 } else { $commandElements.Count - 1 }
    $previousElement = if ($previousElementIndex -ge 1) { $commandElements[$previousElementIndex].Extent.Text } else { '' }
    $choiceFlag = $previousElement
    # Native completion includes the suffix after the cursor in both the word and AST.
    if ($hasCurrentWord -and $commandElements[-1].Extent.EndOffset -gt $cursorPosition) {
        $wordPrefix = $commandElements[-1].Extent.Text.Substring(0, $cursorPosition - $commandElements[-1].Extent.StartOffset)
        $prefixAst = [System.Management.Automation.Language.Parser]::ParseInput("openclaw $wordPrefix", [ref]$null, [ref]$null)
        $commandElements[-1] = $prefixAst.EndBlock.Statements[0].PipelineElements[0].CommandElements[-1]
        $wordToComplete = if ($commandElements[-1] -is [System.Management.Automation.Language.StringConstantExpressionAst]) {
            $commandElements[-1].Value
        } else {
            $wordPrefix
        }
    }
    $choicePrefix = $wordToComplete
    # PowerShell retains quotes in wordToComplete, even for an unfinished literal.
    if ($wordToComplete -ne '' -and $commandElements[-1] -is [System.Management.Automation.Language.StringConstantExpressionAst]) {
        $choicePrefix = $commandElements[-1].Value
    }
    $choiceCompletionPrefix = ''
    if ($wordToComplete -match '^(--[^=]+)=(.*)$') {
        $choiceFlag = $Matches[1]
        $choicePrefix = $Matches[2]
        $choiceCompletionPrefix = "$choiceFlag="
    }

    for ($i = 1; $i -lt $commandElements.Count; $i++) {
        $element = if ($commandElements[$i] -is [System.Management.Automation.Language.StringConstantExpressionAst]) {
            $commandElements[$i].Value
        } else {
            $commandElements[$i].Extent.Text
        }
        if ($i -eq $commandElements.Count - 1 -and $hasCurrentWord) { break }
        if ($element -like "-*") {
            $flag = ($element -split '=', 2)[0]
            if ($element -notlike '*=*' -and $valueOptions -contains $flag) {
                if ($i -eq $previousElementIndex -and $requiredValueOptions -contains $flag) {
                    $pendingRequiredValue = $true
                }
                $i++
            }
            continue
        }

${a}
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

${s}
    if ($pendingRequiredValue) { return }
    
    # Root command
    if ($commandPath -eq "") {
         $completions = ${formatPowerShellArray(t.completions)}
         $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
         }
    }
    
    ${o}
}
`}function escapeFishDescription(e){return e.replace(/\\/g,`\\\\`).replace(/'/g,`'\\''`)}function quoteFishCompletionChoice(e){return`'${e.replace(/\\/g,`\\\\`).replace(/'/g,`\\'`)}'`}function escapeFishDoubleQuotedArgument(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\$/g,`\\$`)}function generateFishPathHelper(e,t){const n=t.descendants.flatMap(e=>e.pathVariants.map(t=>({path:quoteFishCompletionChoice(t.join(` `)),valueOptions:e.valueOptions.map(quoteFishCompletionChoice).join(` `)})));const r=n.map(({path:e,valueOptions:t})=>`      case ${e}\n        set value_options ${t}`).join(`
`);const i=n.length?`
    switch (string join " " $command_tokens)
${r}
    end`:``;const a=n.length?`
  if test (count $command_tokens) -gt (count $expected)
    set -l next_index (math (count $expected) + 1)
    set -l candidate_path (string join " " $expected $command_tokens[$next_index])
    switch "$candidate_path"
      case ${n.map(({path:e})=>e).join(` `)}
        return 1
    end
  end`:``;return`
function __${e}_command_path_matches
  set -l expected $argv
  set -l value_options ${t.root.valueOptions.map(quoteFishCompletionChoice).join(` `)}
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
${i}
  end
  if test (count $expected) -gt 0
    for i in (seq (count $expected))
      if test "$command_tokens[$i]" != "$expected[$i]"
        return 1
      end
    end
  end
${a}
  return 0
end
`}function generateFishCompletion(e){const{root:t,descendants:n}=e;const r=t.command.name();const i=[generateFishPathHelper(r,e)];for(const e of[t,...n]){const t=e.command;const n=e.pathVariants.map(e=>`__${r}_command_path_matches ${e.join(` `)}`.trimEnd());for(const e of n){for(const n of visibleCompletionCommands(t))for(const t of commandNameVariants(n)){const a=escapeFishDescription(n.description());i.push(`complete -c ${r} -n "${e}" -a "${t}" -d '${a}'\n`)}for(const{option:n,flags:a}of completionOptions(t).filter(({option:e})=>!e.hidden)){const t=escapeFishDescription(n.description);const o=n.argChoices?.length?escapeFishDoubleQuotedArgument(n.argChoices.map(quoteFishCompletionChoice).join(` `)):void 0;let s=`complete -c ${r} -n "${e}"`;for(const e of a)s+=e.startsWith(`--`)?` -l ${e.slice(2)}`:` -s ${e.slice(1)}`;if(n.required)s+=` -r`;if(o)s+=` -f -a "${o}"`;s+=` -d '${t}'\n`;if(o&&!n.required){const n=`contains -- (commandline -opc)[-1] ${a.join(` `)}`;s+=`complete -c ${r} -n "${e}; and ${n}" -f -a "${o}" -d '${t}'\n`}i.push(s)}}}return i.join(``)}export{registerCompletionCli};