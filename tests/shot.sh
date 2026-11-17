#!/bin/bash
# usage: tests/shot.sh "<url hash e.g. #/lab/a1/4>" out-name [width] [height] [query e.g. ?lang=en&solve=1]
# Screenshots land in ~/snap/firefox/common/shots/<out-name>.png (snap Firefox can only write there).
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; D="$HOME/snap/firefox/common/shots"; P="$HOME/snap/firefox/common/cs-shot-$$"
mkdir -p "$D" "$P"
timeout 100 firefox --headless --no-remote --profile "$P" --window-size=${3:-1300},${4:-1000} --screenshot "$D/$2.png" "file://$ROOT/index.html${5}$1" >/dev/null 2>&1
rm -rf "$P"; echo "$D/$2.png"
