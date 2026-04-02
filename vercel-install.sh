#!/bin/bash
set -e

# Vercel has Rust pre-installed but without the wasm target
# Just add it directly using rustup which is also available
rustup target add wasm32-unknown-unknown

# Download wasm-pack prebuilt binary
curl -L "https://github.com/rustwasm/wasm-pack/releases/download/v0.13.1/wasm-pack-v0.13.1-x86_64-unknown-linux-musl.tar.gz" -o wasm-pack.tar.gz
tar xf wasm-pack.tar.gz --wildcards --no-anchored 'wasm-pack' --strip-components=1
rm wasm-pack.tar.gz
chmod +x wasm-pack
mv wasm-pack /usr/bin

pnpm install