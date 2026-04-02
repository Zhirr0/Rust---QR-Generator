"use client";

import { useEffect, useState } from "react";
import { useQRStore } from "@/store/qr-store";
import type { ErrorLevel } from "@/store/qr-store";

type WasmModule = {
  generate_qr: (text: string, level: string, size: number) => string;
};

let wasmCache: WasmModule | null = null;

async function loadWasm(): Promise<WasmModule | null> {
  if (wasmCache) return wasmCache;
  try {
    const { generate_qr } = await import("@/wasm-pkg/qr_wasm");
    wasmCache = { generate_qr };
    return wasmCache;
  } catch (err) {
    console.error("[WASM] Failed to initialize:", err);
    return null;
  }
}

const ERROR_LEVELS: ErrorLevel[] = ["L", "M", "Q", "H"];
const ERROR_LEVEL_LABELS: Record<ErrorLevel, string> = {
  L: "Low",
  M: "Medium",
  Q: "Quartile",
  H: "High",
};

export default function QRGenerator() {
  const {
    text,
    errorLevel,
    size,
    svg,
    isLoading,
    setText,
    setErrorLevel,
    setSize,
    setSvg,
    setIsLoading,
  } = useQRStore();

  const [wasmReady, setWasmReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWasm().then((mod) => setWasmReady(!!mod));
  }, []);

  const generate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const mod = await loadWasm();
      if (!mod) throw new Error("WASM module unavailable");
      const result = mod.generate_qr(text.trim(), errorLevel, size);
      setSvg(result);
    } catch (err) {
      setError(`Could not generate QR code. Check your input. ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!svg) return;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#0D0D12";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "qrcode.png";
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const buttonLabel = isLoading
    ? "GENERATING..."
    : !wasmReady
      ? "LOADING WASM..."
      : "GENERATE";

  return (
    <div className="gen-wrapper">
      {/* Text input */}
      <div className="gen-field">
        <label className="gen-label">TEXT OR URL</label>
        <input
          className="gen-input"
          type="text"
          placeholder="https://example.com"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          spellCheck={false}
        />
      </div>

      {/* Options row */}
      <div className="gen-options">
        <div className="gen-field">
          <label className="gen-label">ERROR CORRECTION</label>
          <div className="gen-ec-row">
            {ERROR_LEVELS.map((level) => (
              <button
                key={level}
                title={ERROR_LEVEL_LABELS[level]}
                className={`gen-ec-btn${errorLevel === level ? " gen-ec-active" : ""}`}
                onClick={() => setErrorLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="gen-field">
          <label className="gen-label">SIZE — {size}px</label>
          <input
            className="gen-slider"
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Generate */}
      <button
        className="gen-btn"
        onClick={generate}
        disabled={!wasmReady || !text.trim() || isLoading}
      >
        {buttonLabel}
      </button>

      {error && <p className="gen-error">{error}</p>}

      {/* Output */}
      {svg && (
        <div className="gen-output">
          <div
            className="gen-qr-frame"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <div className="gen-actions">
            <button className="gen-dl-btn" onClick={downloadSvg}>
              SVG
            </button>
            <button className="gen-dl-btn" onClick={downloadPng}>
              PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
