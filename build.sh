#!/usr/bin/env bash
set -euo pipefail

export NEXT_TELEMETRY_DISABLED=1

rm -rf .next
bun run build
rm -rf deploy
cp -r .next/standalone deploy
cp -r .next/static deploy/.next/static
cp -r public deploy
