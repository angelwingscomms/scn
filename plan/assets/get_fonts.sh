#!/bin/bash
# downloads the five self-hosted woff2 faces into static/fonts (latin subset only)
set -e
cd "$(dirname "$0")/../.."
mkdir -p static/fonts
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

get () { # $1=out  $2=google font query
	curl -sS -m 60 -A "$UA" "https://fonts.googleapis.com/css2?family=$2&display=swap" \
		| awk '/\/\* latin \*\//{f=1} f&&/src: url\(/{match($0,/https:[^)]+/); print substr($0,RSTART,RLENGTH); exit}' \
		| xargs -r curl -sS -m 60 -o "$1"
	test -s "$1" || { echo "FAILED $1"; exit 1; }
	echo "ok $1 $(stat -c%s "$1") bytes"
}

get static/fonts/InstrumentSerif-Regular.woff2 'Instrument+Serif'
get static/fonts/InstrumentSerif-Italic.woff2  'Instrument+Serif:ital@1'
get static/fonts/InstrumentSans-Regular.woff2  'Instrument+Sans:wght@400'
get static/fonts/JetBrainsMono-Regular.woff2   'JetBrains+Mono:wght@400'
