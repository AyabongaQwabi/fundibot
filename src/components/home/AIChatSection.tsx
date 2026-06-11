import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const conversation = [
  {
    role: 'student',
    avatar: '🎓',
    message: 'Can I study Computer Science with an APS of 34?',
    time: '2 min ago',
  },
  {
    role: 'fundibot',
    avatar: 'F',
    message: "Based on your APS score of 34 and typical NSC subjects, here are your best options:\n\n**BSc Computer Science** — UCT requires 36, but Stellenbosch and UP accept from 34.\n\n**Diploma in IT** — Most universities of technology accept from 28, so you have strong options at CPUT, TUT, and DUT.\n\n**BCom Informatics** — Wits and UJ both accept from 32, which puts you in a great position.\n\nWould you like me to check specific subjects to refine your results?",
    time: '2 min ago',
  },
];

function ChatBubble({ msg }: { msg: typeof conversation[0] }) {
  const isStudent = msg.role === 'student';
  return (
    <div className={`flex gap-3 ${isStudent ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
        isStudent ? 'bg-slate-200 text-slate-700' : 'bg-brand-blue text-white shadow-glow-blue'
      }`}>
        {msg.avatar}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isStudent ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isStudent
            ? 'rounded-tr-sm bg-slate-100 text-slate-900'
            : 'rounded-tl-sm bg-navy-800 text-white/90 border border-white/10'
        }`}>
          {msg.message.split('\n\n').map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {para.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className={isStudent ? 'font-bold' : 'font-semibold text-white'}>{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </p>
          ))}
        </div>
        <span className='text-xs text-white/30'>{msg.time}</span>
      </div>
    </div>
  );
}

export function AIChatSection() {
  return (
    <section className='relative overflow-hidden bg-navy-950 py-24 sm:py-32'>
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]' />
      <div className='absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='grid items-center gap-16 lg:grid-cols-2'>
          {/* Left: Copy */}
          <div>
            <span className='mb-5 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-blue-light'>
              <Sparkles className='h-3.5 w-3.5' />
              Intelligent Guidance
            </span>
            <h2 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl'>
              Get Answers to Your{' '}
              <span className='text-gradient-blue'>Exact Questions</span>
            </h2>
            <p className='mt-6 text-lg leading-relaxed text-white/60'>
              Our tools give you precise, personalised answers based on your actual subjects and marks — not generic advice.
            </p>

            <div className='mt-8 space-y-4'>
              {[
                'Which universities accept my APS score?',
                'What can I study with my specific subjects?',
                'Which careers match my strengths?',
              ].map((q) => (
                <div key={q} className='flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3'>
                  <span className='flex h-2 w-2 flex-shrink-0 rounded-full bg-brand-blue' />
                  <span className='text-sm text-white/70'>{q}</span>
                </div>
              ))}
            </div>

            <Link
              href='/tools/qualification-checker'
              className='mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-glow-blue transition-all hover:bg-brand-blue-dark'
            >
              Try It Now
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          {/* Right: Chat preview */}
          <div className='rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-sm'>
            {/* Chat header */}
            <div className='flex items-center gap-3 border-b border-white/10 px-5 py-4'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue shadow-glow-blue'>
                <span className='text-xs font-bold text-white'>F</span>
              </div>
              <div>
                <p className='text-sm font-semibold text-white'>Fundibot</p>
                <div className='flex items-center gap-1.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
                  <span className='text-xs text-white/40'>Online · Instant answers</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className='space-y-4 p-5'>
              {conversation.map((msg, i) => (
                <ChatBubble key={i} msg={msg} />
              ))}
            </div>

            {/* Input bar */}
            <div className='border-t border-white/10 px-5 py-4'>
              <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5'>
                <span className='flex-1 text-sm text-white/30'>Ask about your subjects and marks...</span>
                <Link href='/tools/qualification-checker' className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-brand-blue'>
                  <ArrowRight className='h-3.5 w-3.5 text-white' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
