'use client'
import dynamic from "next/dynamic";

const QRGenerator = dynamic(() => import("@/components/QrGenerator"), {
  ssr: false,
  loading: () => <p className="page-loading">INITIALIZING WASM...</p>,
});

export default function Home() {
  return (
    <main className="page-main">
      <header className="page-header">
        <span className="page-tag">/ TOOL</span>
        <h1 className="page-title">QR GENERATE</h1>
        <p className="page-sub">Rust + WebAssembly · No server · Instant</p>
      </header>
      <QRGenerator />
      <footer className="page-footer">BUILT WITH RUST + WASM</footer>
    </main>
  );
}
