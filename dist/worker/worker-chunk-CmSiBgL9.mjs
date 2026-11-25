import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{l as t,n}from"./worker-chunk-CHXXUV6W.mjs";import{i as r,n as i}from"./worker-chunk-Dzac6lyq.mjs";import{d as a,o}from"./worker-chunk-Dz-hvl4W.mjs";import{n as s,r as c}from"./worker-chunk-BcbccsTr.mjs";import{D as l,w as u}from"./worker-chunk-DeEA3Hrd.mjs";import{a as d,r as f}from"./worker-chunk-DI65Lu0s.mjs";import{n as p,t as m}from"./worker-chunk-Ckke-3c-.mjs";import{n as ee,t as h}from"./worker-chunk-CiGTuuJo.mjs";import{r as g,t as te}from"./worker-chunk-B_Lx4uqh.mjs";import{i as _,t as ne}from"./worker-chunk-xWKU0GIj.mjs";import{n as v,t as re}from"./worker-chunk-B2HwaRg_.mjs";import{a as ie,i as y,n as b,o as x,r as ae,t as S}from"./worker-chunk-Ce9HdypI.mjs";import{_ as oe,b as C,c as w,d as se,f as T,h as E,n as D,v as O}from"./worker-chunk-DjC_98u-.mjs";import{i as ce,t as k}from"./worker-chunk-DyPBk2i6.mjs";import{a as le,i as ue,n as A,o as de,r as fe,s as pe}from"./worker-chunk-E5Rqyt_s.mjs";import{i as me,s as j,t as M}from"./worker-chunk-_TN0xwG4.mjs";import{_ as N,a as P,g as F,i as I,m as L,n as R,s as z}from"./worker-chunk-BP86U4q2.mjs";import{i as he,n as ge}from"./worker-chunk-CAzY_YXp.mjs";import{i as _e,n as ve,t as ye}from"./worker-chunk-CB7Qlyju.mjs";import{n as B,t as be}from"./worker-chunk-DeG49yx-.mjs";import{n as xe,t as V}from"./worker-chunk-B8oX8GI8.mjs";import{c as Se,i as Ce,n as H,r as we}from"./worker-chunk-CWi1v_JS.mjs";import U from"node:path";var W,G,K,q,J=e((()=>{W=`/openclaw/git-tools`,G=`/tmp/openclaw-agent-git/git`,K=`
remaining=$PATH
while :; do
  entry=\${remaining%%:*}
  case $entry in (/*) ;; (*) entry=$PWD/\${entry:-.} ;; esac
  candidate=$entry/git
  if [ "$entry" != "$wrapper_bin" ]; then
    resolved=$(command -p realpath -- "$candidate" 2>/dev/null) || resolved=
    if [ -f "$resolved" ] && [ -x "$resolved" ]; then
      # Reject scripts and symlinks to wrappers without executing candidates.
      magic=$(command -p od -An -tx1 -N4 "$resolved" 2>/dev/null)
      set -- $magic
      case "$*" in
        ('7f 45 4c 46'|'ce fa ed fe'|'cf fa ed fe'|'fe ed fa ce'|'fe ed fa cf'|'ca fe ba be'|'be ba fe ca'|'ca fe ba bf'|'bf ba fe ca')
          printf '%s\\n' "$candidate"
          exit 0 ;;
      esac
    fi
  fi
  case $remaining in (*:*) remaining=\${remaining#*:} ;; (*) exit 0 ;; esac
done
`,q=`
if [ ! -x "$git" ]; then
  wrapper_bin=\${0%/*}
  git=$(${K})
  if [ -z "$git" ]; then
    echo 'OpenClaw: no native Git executable found. Install Git, then retry.' >&2
    exit 127
  fi
fi
is_probe() {
  prepare_history=
  no_lazy_fetch=
  filter_fetch=
  projection_fetch=
  multiple_fetch=
  explicit_filter=
  unfiltered_fetch=
  fetch_filter=
  fetch_depth=
  shallow_change=
  argument_count=$#
  while [ "$#" -gt 0 ]; do
    global_count=$((argument_count - $#))
    case $1 in
      -C|-c|--git-dir|--work-tree|--namespace|--config-env) [ "$#" -ge 2 ] || return 1; shift 2 ;;
      -C*|-c*) shift ;;
      --no-lazy-fetch) no_lazy_fetch=1; shift ;;
      --*) shift ;;
      -p|-P) shift ;;
      fetch|pull)
        command=$1
        shift
        fetch_remote=
        all_fetch=
        skip_value=
        literal=
        for arg do
          if [ "$skip_value" = 1 ]; then skip_value=; continue; fi
          if [ "$literal" = 1 ]; then
            [ -n "$fetch_remote" ] || fetch_remote=$arg
            break
          fi
          case $arg in
            --) literal=1; continue ;;
            -j|-o|-s|-X) skip_value=1; continue ;;
            -m) multiple_fetch=1; continue ;;
            --?*)
              name=\${arg%%=*}
              for option in --depth --deepen --shallow-since --shallow-exclude --unshallow --update-shallow; do
                case $option in "$name"*) shallow_change=1 ;; esac
              done
              case --filter in "$name"*) explicit_filter=1; unfiltered_fetch= ;; esac
              case --no-filter in "$name"*) explicit_filter=1; unfiltered_fetch=1 ;; esac
              case --all in "$name"*) all_fetch=1 ;; esac
              case --no-all in "$name"*) all_fetch= ;; esac
              case --multiple in "$name"*) multiple_fetch=1 ;; esac
              case --no-multiple in "$name"*) multiple_fetch= ;; esac
              case $arg in *=*) continue ;; esac
              for option in --upload-pack --jobs --depth --shallow-since --shallow-exclude --deepen --submodule-prefix --recurse-submodules-default --refmap --server-option --negotiation-tip --filter --strategy --strategy-option --cleanup; do
                case $option in "$name"*) skip_value=1 ;; esac
              done ;;
            -*) ;;
            *) [ -n "$fetch_remote" ] || fetch_remote=$arg ;;
          esac
        done
        [ "$all_fetch" = 1 ] && multiple_fetch=1
        projection_fetch=1
        case $fetch_remote in https://github.com/*|git@github.com:*|ssh://git@github.com/*) filter_fetch=1 ;; esac
        return 1 ;;
      cat-file)
        prepare_history=1
        shift
        for arg do case $arg in -e|-t) return 0 ;; esac; done
        return 1 ;;
      rev-parse)
        # Batch records are line-delimited; newline arguments retain native handling.
        prepare_history=1
        shift
        for arg do
          case $arg in --verify) return 0 ;; *'
'*) prepare_history= ;; esac
        done
        return 1 ;;
      merge-base)
        prepare_history=1
        probe_kind=ancestor
        shift
        for arg do case $arg in --is-ancestor) return 0 ;; esac; done
        return 1 ;;
      show|diff|log|grep|rev-list|restore|checkout|switch|reset|merge|rebase|cherry-pick|revert|blame|show-branch|archive|ls-tree|format-patch|diff-tree|diff-index|read-tree)
        prepare_history=1; return 1 ;;
      *) return 1 ;;
    esac
  done
  return 1
}
query_repository() {
  query=$1; shift
  # Keep Git's global options (-C, -c, --git-dir, ...) on repository queries.
  tail_count=$(($# - global_count))
  prefix_count=$global_count
  while [ "$prefix_count" -gt 0 ]; do
    set -- "$@" "$1"
    shift
    prefix_count=$((prefix_count - 1))
  done
  shift "$tail_count"
  case $query in
    projection) "$git" "$@" config --bool --get openclaw.projection 2>/dev/null ;;
    shared)
      common=$("$git" "$@" rev-parse --path-format=absolute --git-common-dir 2>/dev/null) || return 1
      for linked in "$common"/worktrees/*/gitdir; do
        if [ -f "$linked" ]; then return 0; fi
      done
      return 1 ;;
    blobless)
      remote_settings=$("$git" "$@" config --get-regexp '^(remote\\..*\\.(url|promisor|partialclonefilter)|log[.]follow)$' 2>/dev/null) || return 1
      remote_settings="
$remote_settings
"
      case $remote_settings in *'.partialclonefilter blob:none
'*) ;; *) return 1 ;; esac ;;
    log_follow) "$git" "$@" config --bool --get log.follow 2>/dev/null ;;
    register_remotes)
      remotes=$("$git" "$@" remote) || return 1
      fetch_cwd=
      if [ -n "$fetch_remote" ] && [ "$multiple_fetch" != 1 ]; then
        case "
$remotes
" in *"
$fetch_remote
"*) ;;
          *)
            if ! "$git" "$@" config --get-all "remotes.$fetch_remote" >/dev/null 2>&1; then
              remotes="$remotes
$fetch_remote"
            fi ;;
        esac
      fi
      while IFS= read -r remote; do
        [ -n "$remote" ] || continue
        url=$("$git" "$@" ls-remote --get-url "$remote") || return 1
        case $url in /*) ;; *)
          # A colon is an SSH separator only before the first slash.
          case \${url%%:*} in "$url"|*/*)
            if [ -z "$fetch_cwd" ]; then
              if [ "$command" = pull ]; then
                fetch_cwd=$("$git" "$@" rev-parse --show-toplevel) || return 1
              else
                # Let Git own -C, explicit gitdirs and bare-repository setup.
                fetch_cwd=$("$git" "$@" -c 'alias.openclaw-fetch-cwd=!pwd -P' openclaw-fetch-cwd) || return 1
              fi
            fi
            raw_url=$url
            case $remote_settings in *"
remote.$remote.url "*)
              raw_url=\${remote_settings#*"
remote.$remote.url "}
              raw_url=\${raw_url%%"
"*} ;;
            esac
            # Preserve other fetch/push URLs while anchoring the first fetch URL.
            "$git" "$@" config --local --fixed-value --replace-all "remote.$remote.url" "$fetch_cwd/$url" "$raw_url" || return 1 ;;
          esac ;;
        esac
        # Native multi/group selection rejects --filter; keep each remote's promises usable later.
        for setting in promisor:true partialclonefilter:blob:none; do
          key=remote.$remote.\${setting%%:*}
          value=\${setting#*:}
          case $remote_settings in *"
$key "*)
            # Last config value wins, including command-local overrides.
            actual=\${remote_settings##*"
$key "}
            actual=\${actual%%"
"*}
            [ "$actual" = "$value" ] && continue ;;
          esac
          "$git" "$@" config --local "$key" "$value" || return 1
        done
      done <<EOF
$remotes
EOF
      ;;
    objects) GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= exec "$git" "$@" cat-file --batch-check='%(objectname) %(objecttype)' 2>/dev/null ;;
    missing_blobs)
      # Unlike cat-file on older Git, missing=print never hydrates these blob roots.
      present=$(GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= "$git" "$@" rev-list --objects --no-walk --ignore-missing --missing=print --stdin 2>/dev/null <<EOF
$missing
EOF
      ) || return 1
      printf '%s\\n--\\n%s\\n' "$present" "$missing" | awk '
        $0 == "--" { candidates=1; next }
        candidates { if (!seen[$1]) print $1; next }
        { seen[$1]=1 }
      '
      ;;
    resolve) GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= exec "$git" "$@" rev-parse --verify --end-of-options "$revision" 2>/dev/null ;;
    revisions)
      marker='HEAD^{commit}'
      while :; do
        case $revisions in *"$marker"*) marker="$marker^{commit}" ;; *) break ;; esac
      done
      set -- "$@" rev-parse --revs-only --no-flags --symbolic --end-of-options
      while IFS= read -r expression; do set -- "$@" "$expression"; done <<EOF
$revisions
EOF
      resolved=$(GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= "$git" "$@" "$marker" 2>/dev/null) || return 1
      [ "\${resolved##*
}" = "$marker" ] ;;
    revision)
      if [ -z "$revision_marker" ]; then
        revision_format=$("$git" "$@" rev-parse --show-object-format 2>/dev/null) || return 1
        case $revision_format in
          sha256) revision_marker=0000000000000000000000000000000000000000000000000000000000000000 ;;
          *) revision_marker=0000000000000000000000000000000000000000 ;;
        esac
      fi
      resolved=$(GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= "$git" "$@" rev-parse --revs-only --no-flags --end-of-options "$revision" "$revision_marker" 2>/dev/null) || return 1
      # A path consumes the marker too; a valid revision leaves it as the last ID.
      [ "\${resolved##*
}" = "$revision_marker" ] ;;
    fetch|fetch_blobs)
      negotiation=consecutive
      # A have commit implies its blobs exist. For known missing blobs that can
      # suppress explicit wants; blob-only roots need no history negotiation.
      [ "$query" != fetch_blobs ] || negotiation=noop
      GIT_NO_LAZY_FETCH=1 "$git" "$@" -c fetch.negotiationAlgorithm=$negotiation fetch --quiet --filter=blob:none --no-tags --no-write-fetch-head --no-auto-maintenance --recurse-submodules=no origin --stdin <<EOF
$missing
EOF
      ;;
    history_blobs|history_paths)
      [ "$query" != history_paths ] || set -- "$@" -c core.quotePath=false
      # Raw changes include both sides of range/limit boundaries without opening blobs.
      [ "$blob_literal" != 1 ] || set -- "$@" --no-literal-pathspecs
      case $blob_verb in
        grep) set -- "$@" rev-list --objects --no-walk --missing=print ;;
        diff) set -- "$@" diff ;;
        log) set -- "$@" log ;;
        blame) set -- "$@" -c log.follow=false log -m --root ;;
        *) set -- "$@" log -m ;;
      esac
      while IFS= read -r arg; do [ -z "$arg" ] || set -- "$@" "$arg"; done <<EOF
$blob_args
EOF
      if [ "$blob_verb" != grep ]; then
        set -- "$@" --format= --no-patch --raw --no-abbrev --no-renames --no-relative --no-ext-diff --no-textconv --color=never
      fi
      [ "$query" != history_paths ] || set -- "$@" --full-diff --diff-filter=D
      set -- "$@" --
      while IFS= read -r arg; do [ -z "$arg" ] || set -- "$@" "$arg"; done <<EOF
$blob_paths
EOF
      { GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= "$git" "$@" 2>/dev/null && echo complete; } | LC_ALL=C awk -v query="$query" '
        function add(oid, mode) {
          if (mode == "160000" || oid ~ /^0+$/ || seen[oid]++) return
          if (++count > 2048 || (bytes += length(oid) + 1) > 131072) exit
        }
        { if ((scanned += length($0) + 1) > 8388608) exit }
        /^\\?/ { add(substr($1, 2), "100644") }
        /^:+[0-7]+ / {
          if (query == "history_paths") {
            path = substr($0, index($0, "\\t") + 1)
            # Git-quoted names cannot enter the line-delimited pathspec batch.
            if (path ~ /^"/) exit
            add(":(top,literal)" path, substr($1, 2))
          } else {
            parents = match($0, /[0-7]/) - 1
            for (i=1; i<=parents+1; i++)
              add($(parents+1+i), i == 1 ? substr($1, parents+1) : $i)
          }
        }
        /^complete$/ { complete=1 }
        END { if (!complete) print "skip"; else for (oid in seen) print oid }
      '
      ;;
  esac
}
blob_arguments() {
  blob_args=
  blob_paths=
  blob_literal=
  blob_expression=
  blob_patch=
  blob_pickaxe=
  blob_limits=
  blob_pattern=
  blob_separator=
  shift "$global_count"
  blob_verb=$1; shift
  case $blob_verb in
    show)
      # A path-history batch also serves repeated show rev:path reads from loops.
      [ "$#" = 1 ] || return 1
      case $1 in -*|:*) return 1 ;; *:*) ;; *) return 1 ;; esac
      blob_expression=$1
      blob_args="HEAD
\${1%%:*}"
      blob_paths=\${1#*:}
      case $blob_paths in
        ./*|../*) blob_paths=":(literal)$blob_paths" ;;
        *) blob_paths=":(top,literal)$blob_paths" ;;
      esac
      blob_literal=1
      return 0 ;;
    blame) blob_patch=1 ;;
    log) ;;
    diff|grep) blob_patch=1 ;;
    *) return 1 ;;
  esac
  while [ "$#" -gt 0 ]; do
    arg=$1; shift
    if [ "$blob_separator" = 1 ]; then
      blob_paths="$blob_paths$arg
"
      continue
    fi
    if [ "$blob_verb" = blame ]; then
      case $arg in --porcelain|--line-porcelain|--incremental|--show-name|--show-number|--show-email|-p|-t|-l|-s|-n|-f|-e) continue ;; esac
    fi
    if [ "$blob_verb" = grep ]; then
      case $arg in
        -e) [ "$#" -gt 0 ] || return 1; shift; blob_pattern=1; continue ;;
        -e?*|--regexp=*) blob_pattern=1; continue ;;
        -n|-i|-I|-v|-w|-l|-L|-q|-h|-H|-G|-E|-F|-P|--all-match|--and|--or|--not|'('|')') continue ;;
        -*) ;;
        *) if [ "$blob_pattern" != 1 ]; then blob_pattern=1; continue; fi ;;
      esac
    fi
    case $arg in
      --) blob_separator=1; continue ;;
      -p|--patch|--stat|--stat=*|--numstat|--patch-with-stat) blob_patch=1; continue ;;
      --no-patch|-s) blob_patch=; continue ;;
      -S|-G)
        [ "$#" -gt 0 ] || return 1
        shift; blob_pickaxe=1; continue ;;
      -S?*|-G?*) blob_pickaxe=1; continue ;;
      --pickaxe-regex|--pickaxe-all) continue ;;
      --format=*|--pretty=*|--oneline|--color=*|--no-color) continue ;;
      -n|--max-count|--skip)
        [ "$blob_verb" = log ] && [ "$#" -gt 0 ] || return 1
        blob_limits="$blob_limits$arg
$1
"; shift; continue ;;
      --max-count=*|--skip=*|-[0-9]*) blob_limits="$blob_limits$arg
"; continue ;;
      --since|--until|--after|--before)
        [ "$blob_verb" = log ] && [ "$#" -gt 0 ] || return 1
        blob_args="$blob_args$arg
$1
"; shift; continue ;;
      -L)
        [ "$blob_verb" = blame ] && [ "$#" -gt 0 ] || return 1
        shift; continue ;;
      --since=*|--until=*|--after=*|--before=*|--first-parent|--all|--branches|--tags|--remotes|--not|--reverse|--no-merges|--merges)
        [ "$blob_verb" = log ] || return 1 ;;
      -*) return 1 ;;
    esac
    if [ "$blob_verb" = blame ] && [ "$#" = 0 ]; then
      blob_paths=$arg
    else
      blob_args="$blob_args$arg
"
    fi
  done
  # Pickaxe counts matching commits, so limits cannot bound the content scan.
  [ "$blob_pickaxe" = 1 ] || blob_args="$blob_args$blob_limits"
  [ "$blob_patch$blob_pickaxe" != "" ] || return 1
  if [ "$blob_verb" = blame ]; then
    [ -n "$blob_paths" ] || return 1
    blob_paths=":(literal)\${blob_paths%'
'}"
    blob_literal=1
  fi
  [ "$blob_verb" != grep ] || [ -n "$blob_args" ] || return 1
  return 0
}
prepare_blobs() {
  [ "$no_lazy_fetch" != 1 ] || return 0
  case \${GIT_NO_LAZY_FETCH:-} in 1|true|yes|on) return 0 ;; esac
  # Log arguments that are implicit paths retain their native handling.
  [ "$verb" != log ] || [ "$unresolved_revision" != 1 ] || return 0
  # This portable shell helper uses line-delimited arguments and object IDs.
  for arg do case $arg in *'
'*) return 0 ;; esac; done
  blob_arguments "$@" || return 0
  if [ -n "$blob_expression" ]; then
    object=$(query_repository objects "$@" <<EOF
$blob_expression
EOF
    )
    case $object in *' missing'|'') ;; *) return 0 ;; esac
  fi
  query_repository blobless "$@" || return 0
  query_repository shared "$@" || return 0
  if [ "$blob_verb" = log ] && [ -n "$blob_paths" ]; then
    case $remote_settings in *'
log.follow'*)
      # Implicit follow has the same native contract as unsupported --follow.
      [ "$(query_repository log_follow "$@")" != true ] || return 0 ;;
    esac
  fi
  # Show prepares history speculatively; other content searches must stay offline
  # after this bounded prefetch, even when discovery or the fetch cannot finish.
  [ "$blob_verb" = show ] || prepared_blobs=1
  (
    if [ "$blob_verb" = blame ]; then
      # Rename detection needs content. Follow deleted-path candidates in the
      # same commits offline first, including earlier names across rename chains.
      while :; do
        paths=$(query_repository history_paths "$@")
        case $paths in skip) return 0 ;; '') break ;; esac
        paths=$(printf '%s\\n%s\\n' "$blob_paths" "$paths" | LC_ALL=C awk '
          NF && !seen[$0]++ {
            if (++count > 2048 || (bytes += length($0) + 1) > 131072) { bounded=1; exit }
            rows[count]=$0
          }
          END { if (bounded) print "skip"; else for (i=1; i<=count; i++) print rows[i] }
        ')
        [ "$paths" != skip ] || return 0
        [ "$paths" != "$blob_paths" ] || break
        blob_paths=$paths
      done
    fi
    candidates=$(query_repository history_blobs "$@")
    if [ -z "$candidates" ] && [ "$blob_verb" = blame ]; then
      # An unchanged range still needs its endpoint content. Let Git expand the
      # range, then read the last path change reachable from its positive tip.
      revisions=$(printf %s "$blob_args")
      query_repository revisions "$@" || return 0
      blob_args=$(printf '%s\\n' "$resolved" | awk 'substr($0, 1, 1) != "^" { print; exit }')
      blob_args="$blob_args
-n
1"
      candidates=$(query_repository history_blobs "$@")
    fi
    case $candidates in ''|skip) return 0 ;; esac
    missing=$candidates
    missing=$(query_repository missing_blobs "$@")
    [ -n "$missing" ] || return 0
    # Serialize across linked worktrees, then inspect the objects under the lock:
    # overlapping callers fetch only the part not already supplied by the leader.
    lock=$common/openclaw-history-blobs.lock
    attempts=0
    until mkdir "$lock" 2>/dev/null; do
      attempts=$((attempts + 1))
      [ "$attempts" -lt 300 ] || return 0
      # A large live batch may exceed thirty seconds; do not start lazy fetches
      # beside it. An ownerless lock stops waiting after thirty seconds.
      if read -r owner 2>/dev/null < "$lock/pid"; then
        if kill -0 "$owner" 2>/dev/null; then
          attempts=0
        else
          rm -f "$lock/pid"
          rmdir "$lock" 2>/dev/null && continue
        fi
      fi
      sleep 0.1
    done
    trap 'rm -f "$lock/pid"; rmdir "$lock" 2>/dev/null' 0
    trap 'exit 1' HUP INT TERM
    echo $$ > "$lock/pid"
    missing=$(query_repository missing_blobs "$@")
    [ -n "$missing" ] || return 0
    query_repository fetch_blobs "$@" 2>/dev/null || :
  )
}

append_revision_roots() {
  arg=$1
  traverse=
  case \${arg%%:*} in
    *...*) left=\${arg%%...*}; right=\${arg#*...}; traverse=1 ;;
    *..*) left=\${arg%%..*}; right=\${arg#*..} ;;
    *) left=$arg; right= ;;
  esac
  for revision in "$left" "$right"; do
    revision=\${revision#^}
    # Plain endpoints print IDs; three-dot ranges traverse both endpoints.
    if [ "$verb" = rev-parse ]; then
      case $revision in *:*|*^*|*~*) ;; *) [ "$traverse" = 1 ] || continue ;; esac
    fi
    revision=\${revision%%:*}
    revision=\${revision%%[~^]*}
    case $revision in '') continue ;; *[[:space:]]*) unresolved_revision=1; continue ;; esac
    revisions="$revisions$revision
"
  done
}
revision_roots() {
  revisions=
  revision_separator=
  shift "$global_count"
  verb=$1; shift
  if [ "$verb" = grep ]; then
    # Its first positional argument is a pattern, not a revision.
    return
  fi
  while [ "$#" -gt 0 ]; do
    arg=$1; shift
    case $verb:$arg in
      checkout:-b|checkout:-B|switch:-c|switch:-C|merge:-m|merge:-F|cherry-pick:-m|revert:-m|log:-n|show:-n|rev-list:-n)
        [ "$#" -gt 0 ] && shift; continue ;;
      cat-file:blob|cat-file:tree|cat-file:commit|cat-file:tag) continue ;;
      rev-parse:--sq-quote|rev-parse:--parseopt|diff:--no-index|archive:--remote|archive:--remote=*) revisions=; return ;;
      archive:--format|ls-tree:--format|format-patch:-o|format-patch:--cc) [ "$#" -gt 0 ] && shift; continue ;;
      restore:-S|merge:-S|rebase:-S|cherry-pick:-S|revert:-S) continue ;;
    esac
    case $arg in
      --) break ;;
      --source|--onto) [ "$#" -gt 0 ] || break; arg=$1; shift ;;
      --source=*|--onto=*) arg=\${arg#*=} ;;
      -s)
        if [ "$verb" != restore ]; then
          case $verb in merge|rebase) [ "$#" -gt 0 ] && shift ;; esac
          continue
        fi
        [ "$#" -gt 0 ] || break; arg=$1; shift ;;
      -s*) [ "$verb" = restore ] || continue; arg=\${arg#-s} ;;
      --grep|--grep-reflog|--author|--committer|--since|--since-as-filter|--until|--after|--before|--max-count|--max-count-oldest|--max-age|--min-age|--skip|--output|--output-directory|--path|--pathspec-from-file|--date|--encoding|--diff-filter|--find-object|--strategy|--strategy-option|--message|--file|--mainline|--glob|--exclude|--exclude-hidden|--create|--force-create|--conflict|--contents|--ignore-revs-file|--default|--git-path|--resolve-git-dir|--exec|--into-name|--subject-prefix|--signature|--signature-file|--suffix|--to|--in-reply-to|--add-header|--prefix|--src-prefix|--dst-prefix|--line-prefix|--anchored|--word-diff-regex|-G|-S|-L|-O|-X|--orphan)
        [ "$#" -gt 0 ] && shift; continue ;;
      -*) continue ;;
      *) [ "$verb" != restore ] || continue ;;
    esac
    if [ "$verb" = rev-parse ]; then
      revisions="$revisions$revision_separator$arg"
      revision_separator='
'
    else
      append_revision_roots "$arg"
    fi
  done
}
prepare_roots() {
  missing=
  [ -n "$revisions" ] || return 0
  # Inspect raw types so present blob/tree arguments remain ordinary content reads.
  objects=$(query_repository objects "$@" <<EOF
$revisions
EOF
  ) || return 0
  while read -r revision kind; do
    [ "$kind" = missing ] || continue
    oid=$(query_repository resolve "$@") || { unresolved_revision=1; continue; }
    if [ -z "$missing" ]; then
      query_repository blobless "$@" || return 0
      query_repository shared "$@" || return 0
      missing=$oid
    else
      missing="$missing
$oid"
    fi
  done <<EOF
$objects
EOF
  [ -n "$missing" ] || return 0
  query_repository fetch "$@" && return 0
  echo 'OpenClaw: could not fetch the requested object from origin with history negotiation; command not run. Fetch it explicitly from the remote that owns it, then retry.' >&2
  return 1
}
prepare_commits() {
  revision_marker=
  unresolved_revision=
  [ "$no_lazy_fetch" != 1 ] || return 0
  case \${GIT_NO_LAZY_FETCH:-} in 1|true|yes|on) return 0 ;; esac
  revision_roots "$@"
  if [ "$verb" = grep ] && blob_arguments "$@"; then
    while IFS= read -r arg; do append_revision_roots "$arg"; done <<EOF
$blob_args
EOF
  fi
  [ "$verb" = rev-parse ] || { prepare_roots "$@"; return $?; }
  [ -n "$revisions" ] || return 0
  query_repository revisions "$@" && return 0
  expressions=$revisions
  while IFS= read -r revision; do
    query_repository revision "$@" && continue
    expression=$revision
    revisions=
    append_revision_roots "$expression"
    prepare_roots "$@" || return 1
    [ -n "$missing" ] || break
    revision=$expression
    query_repository revision "$@" || break
  done <<EOF
$expressions
EOF
}
check_shared_shallow() {
  # Both the primary checkout and its linked worktrees share this shallow file.
  if query_repository shared "$@"; then
    echo 'OpenClaw: shallow-changing fetch/pull would alter history shared by linked worktrees; command not run. Fetch without shallow options for new tips. For older history, use gh api repos/<owner>/<repo>/commits/<sha> or gh api repos/<owner>/<repo>/compare/<base>...<head>; for local history, ask the operator to repair the managed base with openclaw doctor --fix, then retry git log.' >&2
    return 1
  fi
}
fetch_defaults() {
  if query_repository blobless "$@" && query_repository shared "$@"; then
    if [ "$unfiltered_fetch" = 1 ]; then
      echo 'OpenClaw: unfiltered fetch would add ordinary packs to the shared partial clone; command not run. Fetch with --filter=blob:none instead.' >&2
      return 1
    fi
    query_repository register_remotes "$@" || return 1
  elif [ "$command" = pull ]; then
    return 0
  elif [ "$(query_repository projection "$@")" = true ]; then
    [ "$multiple_fetch" = 1 ] && return 0
    [ "$shallow_change" = 1 ] || fetch_depth=64
    [ "$explicit_filter" = 1 ] || fetch_filter=blob:none
  elif [ "$filter_fetch" = 1 ] && [ "$explicit_filter" != 1 ] && query_repository blobless "$@"; then
    fetch_filter=blob:none
  fi
}
if ! is_probe "$@"; then
  if [ "$prepare_history" = 1 ]; then
    prepare_commits "$@" || exit 2
    case $verb in log|blame|show|diff|grep) prepare_blobs "$@" ;; esac
    if [ "$prepared_blobs" = 1 ]; then
      GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= "$git" "$@"
      result=$?
      [ "$result" = 0 ] && exit 0
      [ "$blob_verb" = grep ] && [ "$result" = 1 ] && exit 1
      echo 'OpenClaw: content search could not finish within the shared partial-clone blob budget; command stopped without lazy fetching. Add a narrower pathspec after --, use git grep on specific revisions, or set a --since bound (a revision range for blame), then retry.' >&2
      exit 2
    fi
  fi
  if [ "$projection_fetch" = 1 ]; then fetch_defaults "$@" || exit 2; fi
  if [ "$shallow_change" = 1 ] || [ -n "$fetch_depth" ]; then
    check_shared_shallow "$@" || exit 2
  fi
  if [ -n "$fetch_filter$fetch_depth" ]; then
    # Native Git owns promisor registration; only standalone projections get a depth cap.
    tail_count=$(($# - global_count - 1))
    prefix_count=$((global_count + 1))
    while [ "$prefix_count" -gt 0 ]; do
      set -- "$@" "$1"; shift; prefix_count=$((prefix_count - 1))
    done
    [ -z "$fetch_filter" ] || set -- "$@" "--filter=$fetch_filter"
    [ -z "$fetch_depth" ] || set -- "$@" "--depth=$fetch_depth"
    while [ "$tail_count" -gt 0 ]; do
      set -- "$@" "$1"; shift; tail_count=$((tail_count - 1))
    done
    exec "$git" "$@"
  fi
  exec "$git" "$@"
fi
# Older Git ignores GIT_NO_LAZY_FETCH; transport denial still keeps probes offline.
GIT_NO_LAZY_FETCH=1 GIT_ALLOW_PROTOCOL= "$git" "$@"
result=$?
if [ "$result" -ne 0 ] && { [ "$result" -ne 1 ] || [ "$probe_kind" != ancestor ]; }; then
  echo 'OpenClaw: Git probe ran offline. If the commit is missing, fetch explicitly with a known local common tip: git fetch origin <sha> --negotiation-tip=origin/main; or use gh api repos/<owner>/<repo>/commits/<sha> (compare/<base>...<head> for ancestry). Then retry. Content reads such as git show still hydrate blobs normally.' >&2
fi
exit "$result"
`}));function buildAgentGitShimInstallCommand(e,t){return`set -e
wrapper_bin=${p(e)}
git=$(${K})
command -p mkdir -p -- "$wrapper_bin"
temporary=$(command -p mktemp "$wrapper_bin/git.XXXXXXXX")
trap 'command -p rm -f -- "$temporary"' 0
{
  printf '#!/bin/sh\\ngit="'
  printf '%s' "$git" | command -p sed 's/[\\\\$\`"]/\\\\&/g'
  printf '"\\n'
  ${t?`command -p tail -n +3 ${p(t)}`:`command -p cat <<'AGENT_GIT_BODY'
${q}
AGENT_GIT_BODY`}
} > "$temporary"
command -p chmod 755 "$temporary" "$wrapper_bin"
command -p mv -f -- "$temporary" "$wrapper_bin/git"
${t?``:`# The executable resource mount sources preparation output from noexec /tmp.
command -p mkdir -p -- "$wrapper_bin/container"
temporary=$(command -p mktemp "$wrapper_bin/container/git.XXXXXXXX")
printf '%s\\n' '#!/bin/sh' '. ${G}' > "$temporary"
command -p chmod 755 "$temporary" "$wrapper_bin/container"
command -p mv -f -- "$temporary" "$wrapper_bin/container/git"`}
trap - 0
`}var Te=e((()=>{m(),J()}));async function createContainerSandboxBackend(e,t,n,r,i){using o=a(`attempt.setup.sandbox.backend.target`);let assertCurrent=()=>{n?.assertCurrent(),t.assertRuntimeCurrent?.()};if(assertCurrent(),e.id===`podman`&&t.cfg.browser.enabled)throw Error(`Podman sandboxing does not support browser sandboxes. Install Docker and select the docker backend, or disable sandbox.browser.enabled.`);let s=e.id===`docker`?await fe():void 0;assertCurrent();let c={...s?A(s):e,stateGuard:i};return o.mark(`attempt.setup.sandbox.backend.container`),await M({engine:c,...s?{dockerTarget:s}:{},scopeKey:t.scopeKey,workspaceDir:t.workspaceDir,workspaceSource:t.workspaceSource,assertCurrent,operatorAuthority:n,agentWorkspaceDir:t.agentWorkspaceDir,skillsWorkspaceDir:t.skillsWorkspaceDir,readOnlyResourceMounts:t.readOnlyResourceMounts,cfg:t.cfg,...t.requireCurrentConfig===void 0?{}:{requireCurrentConfig:t.requireCurrentConfig}},async({containerName:e,containerId:n,configHash:a,mountPlan:l,currentConfig:d,podmanTarget:f})=>{assertCurrent();let p=f?{...D(f),stateGuard:i}:c;o.mark(`attempt.setup.sandbox.backend.mount_snapshot`);let m=await he({engine:p,containerName:n,assertCurrent});assertCurrent(),o.mark(`attempt.setup.sandbox.backend.bridge_import`);let{createSandboxFsBridge:h}=await import(`./worker-chunk-ByxUGgrB.mjs`);assertCurrent(),o.mark(`attempt.setup.sandbox.backend.handle`);let{workdir:g,env:_,image:v}=t.cfg.docker,b=t.cfg.workspaceAccess===`ro`?`/tmp`:U.posix.join(g,`.openclaw`,`tmp`),x={TMPDIR:b,TMP:b,TEMP:b,..._},S=t.readOnlyResourceMounts?.some(e=>e.containerPath===`/openclaw/git-tools`)?`${W}/container`:void 0,C=f??(s?le(s):void 0),run=async(e,t)=>(p.id===`docker`&&await w(p,C),t?.(),ie(p,[`exec`,`-i`,n,`sh`,`-c`,e.script,`openclaw-sandbox-fs`,...e.args??[]],{input:e.stdin,allowFailure:e.allowFailure,signal:e.signal,assertCurrent:t})),T=S?buildAgentGitShimInstallCommand(U.posix.dirname(G),`${W}/git`):void 0;T&&await run({script:T},assertCurrent);let E={id:p.id,runtimeId:e,runtimeLabel:e,workdir:g,env:x,configLabel:v,configLabelKind:`Image`,capabilities:{browser:p.id===`docker`,readOnlyResourceMounts:!0},async buildExecSpec({command:e,workdir:t,env:a,usePty:o,stdin:s}){p.id===`docker`&&await w(p,C);let c=r,l=c?.localIdentityEnv.GH_CONFIG_DIR,d=l&&process.platform===`win32`?await(await import(`./worker-chunk-BWAxpa26.mjs`)).getShellConfig():void 0;assertCurrent();let{PATH:f,...m}=c?{...x,...a,...c.credentialScrubEnv,...c.localIdentityEnv,GH_CONFIG_DIR:u}:{...x,...a},h=[S,f].filter(Boolean).join(`:`);h&&(m.OPENCLAW_PREPEND_PATH=h);let _=await te(m);try{await i?.prepareHost?.(),assertCurrent();let r=ae(p,[`exec`,`-i`]);o&&r.push(`-t`);let a=t??g;a&&r.push(`-w`,a),r.push(`--env-file`,_.path),l&&r.push(...Object.keys(ne).flatMap(e=>[`--env`,e]));let u=h?'export PATH="${OPENCLAW_PREPEND_PATH}:$PATH"; unset OPENCLAW_PREPEND_PATH; ':``;r.push(n,`/bin/sh`,`-lc`,`${u}mkdir -p -- "$TMPDIR" || exit; ${e}`);let f={...p.baseEnv??process.env};return ee(f),{argv:l?re(r,l,{githubHost:c?.localIdentityEnv.GH_HOST,externalCommandShell:d}):r,env:f,stdinMode:o||s?`pipe-open`:`pipe-closed`,prepareCurrent:i?.prepareHost,assertCurrent,finalizeToken:_.cleanup}}catch(e){throw await _.cleanup(),e}},async finalizeExec({token:e}){if(e!==void 0){if(typeof e!=`function`)throw Error(`Invalid container sandbox execution cleanup token.`);await e()}},prepareProcessCleanup(t){assertCurrent();let r=se(p,e,n);return be(e=>run(e,assertCurrent),t,async e=>{let t={code:0,stdout:Buffer.alloc(0),stderr:Buffer.alloc(0)};try{if(r())return t;let i=await run(e);return i.code===0?i:r()||await oe(p,n,e.signal)||r()?t:i}catch(e){if(r())return t;throw e}})},runShellCommand(e){return run(e,assertCurrent)}};if(E.createFsBridge=({sandbox:e})=>{let n=h({sandbox:{...e,backend:e.backend??E},containerOnlyMounts:m});return ye(n,ve({root:t.workspaceDir,bridge:n,assertCurrent})),n},s&&a&&d){o.mark(`attempt.setup.sandbox.backend.persistent_generation`);let r=await pe(p,n,AbortSignal.timeout(3e4));if(assertCurrent(),r.kind!==`running`)throw Error(`The admitted Docker sandbox container ended during preparation.`);o.mark(`attempt.setup.sandbox.backend.persistent_capability`);let i=structuredClone({cfg:t.cfg.docker,dockerTmpfsSource:t.cfg.dockerTmpfsSource,workspaceDir:t.workspaceDir,workspaceAccess:t.cfg.workspaceAccess,agentWorkspaceDir:t.agentWorkspaceDir,skillsWorkspaceDir:t.skillsWorkspaceDir,scopeKey:t.scopeKey,configHash:a,mountPlan:l}),c,resolveImage=()=>(assertCurrent(),c??=(async()=>{let e=await y(p,[`image`,`inspect`,`--format`,`{{.Id}}`,i.cfg.image],{signal:AbortSignal.timeout(3e4)});assertCurrent();let t=e.stdout.trim();if(!/^sha256:[a-f0-9]{64}$/u.test(t))throw Error(`Persistent sandbox execution requires an immutable Docker image ID.`);return t})()),u={target:s,containerId:n,containerName:e,containerStartedAt:r.startedAt,workdir:t.cfg.docker.workdir,configHash:a,imageReference:i.cfg.image,resolveImage,assertCurrent,async allocate(e){let assertAllocationCurrent=()=>{assertCurrent(),e.assertCurrent()};assertAllocationCurrent();let t=await resolveImage();return assertAllocationCurrent(),await j({...i,cfg:{...i.cfg,image:t},engine:p,name:e.name,command:T?{...e.command,argv:[`/bin/sh`,`-c`,`${T}\nexport PATH="${S}:$PATH"\nexec "$@"`,`openclaw-agent-git`,...e.command.argv]}:e.command,labels:e.labels,assertCurrent:assertAllocationCurrent})}};k(E,{...u,async prepare(e){let{createDockerPersistentExecCapability:t}=await import(`./worker-chunk-Pxd9nFqs.mjs`);return assertCurrent(),await t(u).prepare(e)}})}return E})}async function createDockerSandboxBackend(e,t,n,r){return await createContainerSandboxBackend(S,e,t,n,r)}async function createPodmanSandboxBackend(e,t,n,r){return await createContainerSandboxBackend(b,e,t,n,r)}function createContainerSandboxBackendManager(e){let resolveTarget=t=>{if(e.id!==`podman`||t.backendTarget)return t.backendTarget;throw Object.assign(/* @__PURE__ */ Error(`Podman sandbox runtime ${t.containerName} has no recorded engine target. Remove that unshipped runtime manually before managing it.`),{code:`INVALID_CONFIG`})},bindTarget=t=>t?e.id===`podman`?D(t):A(ue(t)):e;return{async stopRuntime(t,n,r){let i=resolveTarget(t);await w(e,i),n();let a=bindTarget(i),o=await O(a,t.containerName,{strict:!0,includePaused:!0});if(n(),o.exists&&(o.running||o.paused)){let e=AbortSignal.timeout(3e4);o.paused&&await y(a,[`unpause`,o.id],{assertCurrent:n,prepareCurrent:r,signal:e}),await y(a,[`stop`,`--time`,`0`,o.id],{assertCurrent:n,prepareCurrent:r,signal:e})}},async describeRuntime({entry:t,config:n,agentId:r}){let i=resolveTarget(t);await w(e,i);let a=bindTarget(i),o=await O(a,t.containerName),s=t.image,c;if(o.exists)try{let e=await y(a,[`inspect`,`-f`,a.id===`podman`?`{{.ImageName}}	{{.Image}}`:`{{.Config.Image}}`,t.containerName],{allowFailure:!0});if(e.code===0){let t=e.stdout.trim();if(a.id===`podman`){let[e,n]=t.split(`	`,2);s=e||s,c=n}else s=t||s}}catch{}let l=d(n,r),u=t.configLabelKind===`BrowserImage`?l.browser.image:l.docker.image,f=s===u;if(a.id===`podman`&&!f&&c)try{let e=await y(a,[`image`,`inspect`,`-f`,`{{.Id}}`,u],{allowFailure:!0});if(e.code===0){let normalizeImageId=e=>e.trim().replace(/^sha256:/u,``);f=normalizeImageId(c)===normalizeImageId(e.stdout)}}catch{}return{running:o.running,actualConfigLabel:s,configLabelMatch:f}},async removeRuntime({entry:t}){let n=resolveTarget(t);await w(e,n);let r=bindTarget(n);await E(r,t.containerName)}}}var Y,X,Z=e((()=>{Te(),J(),g(),o(),h(),v(),_(),f(),l(),x(),C(),T(),de(),me(),_e(),ge(),ce(),B(),Y=createContainerSandboxBackendManager(S),X=createContainerSandboxBackendManager(b)}));function getSandboxBackendFactories(){return r(Q)}function normalizeSandboxBackendId(e){let n=t(e);if(!n)throw Error(`Sandbox backend id must not be empty.`);return n}function getSandboxBackendFactory(e){let t=resolveSandboxBackendRegistration(e);if(!t)return null;if(!t.reserveRuntimeId)return t.factory;let n=t.factory;return async t=>{let{runtimeId:r,assertRuntimeCurrent:i}=t;if(!r||!i)throw Error(`Sandbox backend "${e}" requires a registry-reserved runtime and its current owner.`);return i(),n({...t,runtimeId:r,assertRuntimeCurrent:i})}}function getSandboxBackendManager(e){return resolveSandboxBackendRegistration(e)?.manager??null}function usesSandboxRuntimeReservations(e){return resolveSandboxBackendRegistration(e)?.reserveRuntimeId!==void 0}function getSandboxBackendWorkdirResolver(e){return resolveSandboxBackendRegistration(e)?.resolveWorkdir??null}function getSandboxBackendCapabilities(e){return resolveSandboxBackendRegistration(e)?.capabilities}function requireSandboxBackendFactory(e){let t=getSandboxBackendFactory(e);if(t)return t;throw Error([`Sandbox backend "${e}" is not registered.`,`Load the plugin that provides it, or set agents.defaults.sandbox.backend=docker.`].join(`
`))}async function createSandboxBackend(e,t,n,r){e.assertRuntimeCurrent?.();let i=requireSandboxBackendFactory(e.cfg.backend);if(n&&i!==createDockerSandboxBackend&&i!==createPodmanSandboxBackend)throw Error(`Sandbox GitHub identity requires the built-in Docker or Podman backend.`);let o=e;if(i!==createDockerSandboxBackend&&i!==createPodmanSandboxBackend&&e.registeredRuntimeIds===void 0){using t=a(`attempt.setup.sandbox.backend.runtime_ids`);let n=await z({backendId:e.cfg.backend,scopeKey:e.scopeKey});e.assertRuntimeCurrent?.(),n.length>0&&(o={...e,registeredRuntimeIds:n}),i=requireSandboxBackendFactory(e.cfg.backend)}if(i===createDockerSandboxBackend)return await createDockerSandboxBackend(o,t,n,r);if(i===createPodmanSandboxBackend)return await createPodmanSandboxBackend(o,t,n,r);let assertRuntimeCurrent=e.assertRuntimeCurrent;if(r?.stateOwnerPath&&i!==H){let t=r.stateOwnerPath;assertRuntimeCurrent=()=>{s(t),e.assertRuntimeCurrent?.()},o={...o,assertRuntimeCurrent}}let c=resolveSandboxBackendRegistration(e.cfg.backend)?.reserveRuntimeId;using l=a(`attempt.setup.sandbox.backend.factory`);let toEntry=t=>({containerName:t.runtimeId,backendId:t.id,runtimeLabel:t.runtimeLabel,sessionKey:e.scopeKey,createdAtMs:Date.now(),lastUsedAtMs:Date.now(),image:t.configLabel??e.cfg.docker.image,configLabelKind:t.configLabelKind??`Image`});if(!c){assertRuntimeCurrent?.();let e=i===H?await H(o,r):await i(o);return l.mark(`attempt.setup.sandbox.backend.registry_publish`),await F(toEntry(e),{...r,beforeLegacyApply:assertRuntimeCurrent}),e}for(let t=0;;t++){assertRuntimeCurrent?.(),l.mark(`attempt.setup.sandbox.backend.reservation`);let n=await L({containerName:c(o),backendId:e.cfg.backend,sessionKey:e.scopeKey,createdAtMs:Date.now(),lastUsedAtMs:Date.now(),image:e.cfg.docker.image,workspaceDir:e.workspaceDir},{...r,beforeLegacyApply:assertRuntimeCurrent});try{return l.mark(`attempt.setup.sandbox.backend.registry_lock_wait`),await N(n,async()=>{l.mark(`attempt.setup.sandbox.backend.factory`);let assertCurrent=()=>{assertRuntimeCurrent?.(),R(n)};try{let t=await i({...o,workspaceDir:n.workspaceDir??e.workspaceDir,runtimeId:n.containerName,assertRuntimeCurrent:assertCurrent});if(t.runtimeId!==n.containerName||t.id!==n.backendId)throw Error(`Sandbox backend returned a runtime outside its reserved generation.`);return l.mark(`attempt.setup.sandbox.backend.reservation_complete`),await I({...n,...toEntry(t),createdAtMs:n.createdAtMs},!1,{...r,beforeLegacyApply:assertRuntimeCurrent}),t}catch(e){throw e instanceof V&&e.runtimeId===n.containerName&&(l.mark(`attempt.setup.sandbox.backend.reservation_retire`),await I(n,!0,{...r,beforeLegacyApply:assertRuntimeCurrent})),e}})}catch(e){if(!(e instanceof V)||e.runtimeId!==n.containerName||t>0)throw e}}}function resolveSandboxBackendRegistration(e){let t=normalizeSandboxBackendId(e);return getSandboxBackendFactories().get(t)?.at(-1)?.registration??$.get(t)}var Q,$,Ee=e((()=>{n(),o(),i(),Z(),xe(),P(),we(),c(),Q=Symbol.for(`openclaw.sandboxBackendFactories`),$=/* @__PURE__ */ new Map,$.set(`docker`,{factory:createDockerSandboxBackend,manager:Y,resolveWorkdir:({cfg:e})=>e.docker.workdir,capabilities:{readOnlyResourceMounts:!0}}),$.set(`podman`,{factory:createPodmanSandboxBackend,manager:X,resolveWorkdir:({cfg:e})=>e.docker.workdir,capabilities:{readOnlyResourceMounts:!0}}),$.set(`ssh`,{factory:H,manager:Ce,resolveWorkdir:({cfg:e,scopeKey:t})=>Se(e.ssh.workspaceRoot,t).remoteWorkspaceDir})}));export{Ee as a,Z as c,J as d,getSandboxBackendWorkdirResolver as i,X as l,getSandboxBackendCapabilities as n,usesSandboxRuntimeReservations as o,getSandboxBackendManager as r,Y as s,createSandboxBackend as t,W as u};