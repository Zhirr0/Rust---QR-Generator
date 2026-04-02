#!/bin/bash
set -e

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y
export PATH="/root/.cargo/bin:$PATH"

curl -L "https://github.com/rustwasm/wasm-pack/releases/download/v0.13.1/wasm-pack-v0.13.1-x86_64-unknown-linux-musl.tar.gz" -o wasm-pack.tar.gz
tar xf wasm-pack.tar.gz --wildcards --no-anchored 'wasm-pack' --strip-components=1
rm wasm-pack.tar.gz
chmod +x wasm-pack
mv wasm-pack /usr/bin

pnpm install