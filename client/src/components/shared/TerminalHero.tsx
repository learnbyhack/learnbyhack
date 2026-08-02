import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINES: { prompt: string; output?: string; delay: number }[] = [
  { prompt: 'whoami', output: 'guest@learnbyhack', delay: 300 },
  { prompt: 'nmap -sV target.lbh', output: '22/tcp  ssh   OpenSSH 8.9\n80/tcp  http  nginx', delay: 900 },
  { prompt: 'curl -s /api/login -d "email=\' OR 1=1--"', output: '200 OK → session granted', delay: 1300 },
  { prompt: './submit_flag LBH{s0_th4ts_h0w_y0u_1n}', output: '✓ +100 XP — Login Bypass solved', delay: 1200 },
];

export function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      for (let i = 0; i < LINES.length; i++) {
        if (cancelled) return;
        const line = LINES[i].prompt;
        for (let c = 1; c <= line.length; c++) {
          if (cancelled) return;
          setTyped(line.slice(0, c));
          await new Promise((r) => setTimeout(r, 18));
        }
        await new Promise((r) => setTimeout(r, LINES[i].delay));
        setVisibleLines((v) => v + 1);
        setTyped('');
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-ink shadow-raised">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 font-mono text-[11px] text-white/40">student@learnbyhack: ~/labs/login-bypass</span>
      </div>
      <div className="min-h-[280px] p-5 font-mono text-[13px] leading-relaxed">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="mb-3">
            <div className="flex gap-2">
              <span className="text-cyan-400">➜</span>
              <span className="text-white/90">{line.prompt}</span>
            </div>
            {line.output && (
              <pre className="mt-1 whitespace-pre-wrap pl-5 text-white/50">{line.output}</pre>
            )}
          </div>
        ))}
        {visibleLines < LINES.length && (
          <div className="flex gap-2">
            <span className="text-cyan-400">➜</span>
            <span className="text-white/90">
              {typed}
              <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 animate-caret-blink bg-cyan-400" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TerminalHeroFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <TerminalHero />
    </motion.div>
  );
}
