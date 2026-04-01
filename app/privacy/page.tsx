import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Roast My CV',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <Link
            href="/"
            className="text-white/40 hover:text-white/70 text-xs transition-colors block mb-8"
          >
            ← Back to Roast My CV
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E24B4A]/15 border border-[#E24B4A]/30 text-[#E24B4A] text-xs font-bold tracking-wider uppercase mb-4">
            🔥 Roast My CV
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-white/40 text-sm mt-2">Plain English. No lawyer-speak.</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {[
            {
              title: 'We do not store your data',
              body: 'CVs are processed entirely in memory and immediately discarded after analysis. We never save, share, or sell any personal information contained in your CV.',
            },
            {
              title: 'No cookies for tracking',
              body: 'We do not use cookies or any other mechanism to track you across sessions or across the web.',
            },
            {
              title: 'Anonymous usage counter',
              body: 'The only data we collect is an anonymous count of the total number of CVs roasted. No personal information is attached to this number — it is simply a running total.',
            },
            {
              title: 'Anthropic API',
              body: "To analyze your CV, we send its content to Anthropic's API. We do not store what is sent. For information on how Anthropic handles data, refer to Anthropic's privacy policy at anthropic.com.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-white font-black text-base mb-2">{item.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="text-white/20 text-xs text-center">
          Questions? Concerns? You can reach us through the project&apos;s GitHub page.
        </p>
      </div>
    </main>
  );
}
