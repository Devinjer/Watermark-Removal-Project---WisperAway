export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">WisperAway</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Image cleanup workspace
          </p>
        </div>
        <span className="status-pill">Foundation active</span>
      </nav>

      <section className="mx-auto grid min-h-[78vh] max-w-6xl place-items-center py-20">
        <div className="w-full max-w-3xl text-center">
          <p className="eyebrow">Milestone A · Foundation</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.045em] md:text-7xl">
            Remove unwanted marks.
            <span className="block text-[var(--text-muted)]">Keep the image.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
            WisperAway is being built around a private, recoverable edit pipeline. Secure uploads and the manual mask editor are the next implementation milestones.
          </p>

          <div className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="rounded-[1.15rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-low)] px-6 py-14">
              <p className="text-sm font-medium">Upload is intentionally disabled until Milestone B security controls land.</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">No placeholder upload or fake AI processing is exposed.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
