import { FAQS } from './HomeJsonLd';

export function FAQSection() {
  return (
    <section className='bg-white py-24 sm:py-32' aria-labelledby='faq-heading'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6'>
        <div className='text-center'>
          <span className='section-tag mb-5'>Questions, answered</span>
          <h2
            id='faq-heading'
            className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'
          >
            Frequently asked questions
          </h2>
          <p className='mt-4 text-lg leading-relaxed text-slate-600'>
            Short, straight answers — for you and for the search engines sending you here.
          </p>
        </div>

        <dl className='mt-12 space-y-4'>
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className='group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors open:bg-white open:shadow-sm'
            >
              <summary className='flex cursor-pointer list-none items-center justify-between gap-4'>
                <dt className='text-base font-bold text-slate-900'>{faq.q}</dt>
                <span
                  aria-hidden='true'
                  className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg leading-none text-sky-600 transition-transform group-open:rotate-45'
                >
                  +
                </span>
              </summary>
              <dd className='mt-3 text-[15px] leading-relaxed text-slate-600'>{faq.a}</dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
