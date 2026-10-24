import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react"
import { ArrowRight, ArrowUp, Check, Fingerprint, Loader2, RotateCcw, ShieldCheck, X } from "lucide-react"
import { Btn, Kicker, TIcon, Tag } from "./ui"
import { SCENARIOS, type Level, type Scenario } from "./data"
import { cn } from "@/lib/utils"

export type Exec = "idle" | "sign" | "running" | "done" | "rejected"

export type Thread = {
  key: number
  scenario: Scenario
  prompt: string
  thought: number
  selected: number
  exec: Exec
  step: number
}

const LEVEL_TONE: Record<Level, "good" | "warn" | "bad"> = {
  Conservative: "good",
  Balanced: "warn",
  Aggressive: "bad",
}

function Empty({ onRun }: { onRun: (id: string) => void }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 text-center">
      <h3 className="font-t-head text-[28px] leading-tight tracking-[-0.015em] sm:text-[32px]">
        What do you want to do?
      </h3>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-t-muted">
        Describe your goal. Meridian fetches live rates across every protocol and designs strategies at
        different risk levels.
      </p>
      <div className="mt-6 grid w-full max-w-2xl gap-2.5 sm:grid-cols-3">
        {SCENARIOS.slice(0, 3).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onRun(s.id)}
            className="group flex cursor-pointer flex-col rounded-[4px] border border-t-line p-3 text-left transition-colors hover:border-t-accent hover:bg-t-accent-100/60"
          >
            <span className="font-t-head text-[17px] leading-tight">{s.title}</span>
            <span className="mt-1 flex-1 text-[11px] leading-snug text-t-muted">{s.sub}</span>
            <ArrowRight size={13} className="mt-3 text-t-accent transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ThreadPane({
  thread,
  input,
  setInput,
  onSubmit,
  onRun,
  onSelect,
  onExecute,
  onSign,
  onReject,
  onReset,
  inputRef,
}: {
  thread: Thread | null
  input: string
  setInput: (v: string) => void
  onSubmit: (text: string) => void
  onRun: (id: string) => void
  onSelect: (i: number) => void
  onExecute: () => void
  onSign: () => void
  onReject: () => void
  onReset: () => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the newest step in view, without moving the page itself.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [thread?.key, thread?.thought, thread?.exec, thread?.step])

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (input.trim()) onSubmit(input.trim())
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const s = thread?.scenario
  const ready = thread && s && thread.thought >= s.thinking.length
  const opt = thread && s ? s.options[thread.selected] : null

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="mt-scroll min-h-0 flex-1">
        {!thread || !s ? (
          <Empty onRun={onRun} />
        ) : (
          <div key={thread.key} className="flex flex-col gap-4 px-4 py-5 sm:px-6">
            {/* user */}
            <div className="ml-auto max-w-[85%] animate-fade-rise rounded-[6px] bg-t-surface px-3.5 py-2.5 text-[13px] leading-snug">
              {thread.prompt}
            </div>

            {/* reasoning */}
            <div className="flex flex-col gap-1.5">
              <Kicker>Meridian</Kicker>
              {s.thinking.slice(0, Math.min(thread.thought + 1, s.thinking.length)).map((line, i) => (
                <div key={line} className="flex items-center gap-2 text-[12px] text-t-muted animate-fade-rise">
                  {i < thread.thought ? (
                    <Check size={12} className="text-t-good" strokeWidth={3} />
                  ) : (
                    <Loader2 size={12} className="animate-spin text-t-accent" />
                  )}
                  {line}
                </div>
              ))}
            </div>

            {/* proposal */}
            {ready && opt && (
              <div className="animate-fade-rise">
                <Kicker>Proposal</Kicker>
                <p className="mt-1 font-t-head text-[20px] leading-snug">{s.answer}</p>

                <div className={cn("mt-3 grid gap-2.5", s.options.length > 1 && "md:grid-cols-3")}>
                  {s.options.map((o, i) => {
                    const active = i === thread.selected
                    const locked = thread.exec !== "idle" && thread.exec !== "rejected"
                    return (
                      <button
                        key={o.title}
                        type="button"
                        disabled={locked && !active}
                        onClick={() => !locked && onSelect(i)}
                        className={cn(
                          "flex cursor-pointer flex-col rounded-[4px] border p-3 text-left transition-all disabled:cursor-default disabled:opacity-40",
                          active
                            ? "border-t-accent bg-t-accent-100/50 shadow-[0_0_0_1px_var(--t-accent)]"
                            : "border-t-line hover:border-[#9b9797]"
                        )}
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          {s.options.length > 1 ? <Tag tone={LEVEL_TONE[o.level]}>{o.level}</Tag> : <Tag tone="good">{o.risk}</Tag>}
                          {active && <Check size={13} className="text-t-accent" strokeWidth={3} />}
                        </div>
                        <div className="mt-2 font-t-head text-[17px] leading-tight">{o.title}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-t-muted">
                          <TIcon src={o.protocolIcon} name={o.protocol} size={14} />
                          {o.protocol} · {o.chain}
                        </div>
                        <div className="mt-2.5 text-[10px] uppercase tracking-[0.06em] text-t-muted">{o.metric.label}</div>
                        <div className="font-t-head text-[22px] leading-none">{o.metric.value}</div>
                        <ul className="mt-2 flex flex-col gap-0.5 text-[11px] leading-snug">
                          {o.lines.map((l) => (
                            <li key={l}>· {l}</li>
                          ))}
                        </ul>
                      </button>
                    )
                  })}
                </div>

                {(thread.exec === "idle" || thread.exec === "rejected") && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Btn variant="solid" onClick={onExecute} className="px-4 py-2 text-[13px]">
                      Execute on {opt.venue} <ArrowRight size={13} />
                    </Btn>
                    <span className="text-[11px] text-t-muted">
                      {s.amount} · simulated first, signed in your wallet
                    </span>
                    {thread.exec === "rejected" && (
                      <span className="w-full text-[11px] text-t-bad">Rejected. Nothing was sent.</span>
                    )}
                  </div>
                )}

                {thread.exec === "sign" && (
                  <div className="mt-3 max-w-sm animate-fade-rise rounded-[6px] border border-t-line bg-white p-3 shadow-[0_12px_32px_rgb(45_43_43/0.18)]">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-t-surface">
                        <Fingerprint size={14} />
                      </span>
                      <div>
                        <div className="text-[12px] font-semibold">Signature request</div>
                        <div className="text-[10px] text-t-muted">Demo wallet · 0x7a…3f1c</div>
                      </div>
                    </div>
                    <ol className="mt-2.5 flex flex-col gap-1 rounded-[4px] bg-t-bg p-2.5 text-[11px]">
                      {opt.exec.map((e, i) => (
                        <li key={e}>
                          {i + 1}. {e}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <Btn variant="secondary" onClick={onReject}>
                        <X size={12} /> Reject
                      </Btn>
                      <Btn variant="solid" onClick={onSign}>
                        <ShieldCheck size={12} /> Sign
                      </Btn>
                    </div>
                  </div>
                )}

                {(thread.exec === "running" || thread.exec === "done") && (
                  <div className="mt-3 max-w-md rounded-[4px] border border-t-line p-3 animate-fade-rise">
                    <Kicker>Execution</Kicker>
                    <ol className="mt-2 flex flex-col gap-1.5">
                      {opt.exec.map((e, i) => {
                        const done = thread.exec === "done" || i < thread.step
                        const active = thread.exec === "running" && i === thread.step
                        return (
                          <li key={e} className={cn("flex items-center gap-2 text-[12px]", !done && !active && "text-t-muted")}>
                            {done ? (
                              <Check size={12} className="text-t-good" strokeWidth={3} />
                            ) : active ? (
                              <Loader2 size={12} className="animate-spin text-t-accent" />
                            ) : (
                              <span className="h-3 w-3 rounded-full border border-t-line" />
                            )}
                            {e}
                          </li>
                        )
                      })}
                    </ol>
                    {thread.exec === "done" && (
                      <div className="mt-3 border-t border-t-line pt-3 animate-fade-rise">
                        <p className="font-t-head text-[18px] leading-snug text-t-good">
                          Done. {opt.title} is live.
                        </p>
                        <p className="mt-0.5 text-[11px] text-t-muted">
                          Your portfolio, risk and history on the left are updated.
                        </p>
                        <Btn className="mt-2.5" onClick={onReset}>
                          <RotateCcw size={12} /> New thesis
                        </Btn>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* composer */}
      <form onSubmit={submit} className="border-t border-t-line px-3 pb-2 pt-3 sm:px-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Describe what you want: yield, exposure, hedge, airdrops…"
            aria-label="Describe what you want"
            className="max-h-24 min-h-[38px] flex-1 resize-none rounded-[4px] border border-t-line bg-transparent px-3 py-2 text-[13px] outline-none transition-colors placeholder:text-[#9b9797] hover:border-t-text/40 focus:border-t-accent"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim()}
            className="flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-t-accent text-t-accent transition-colors hover:bg-t-accent/10 disabled:cursor-default disabled:opacity-40"
          >
            <ArrowUp size={15} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-t-muted">
          Enter to send · Shift+Enter for a new line · try “hedge my ETH” or “lock a fixed rate”
        </p>
      </form>
    </div>
  )
}
