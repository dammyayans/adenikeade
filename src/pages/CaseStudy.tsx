import { Link, useParams } from 'react-router-dom';
import { getCaseStudy, nextCaseStudy } from '../data/caseStudies';
import { BlockView } from '../components/Blocks';
import { Picture } from '../components/Picture';
import { Stripe } from '../components/Stripe';
import { NotFound } from './NotFound';

export default function CaseStudyPage() {
  const { slug = '' } = useParams();
  const study = getCaseStudy(slug);
  if (!study) return <NotFound />;
  const next = nextCaseStudy(slug);
  // Never let the rail repeat the ground it sits under, or the two merge.
  const railGround = study.chapters.at(-1)?.ground === 'taupe' ? 'butter' : 'taupe';

  return (
    <>
      <article>
        <section data-ground="bone" className="pt-28 pb-12 md:pt-32">
          <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
            <Link to="/#work" className="label inline-flex items-center gap-2 no-underline opacity-70 transition-opacity hover:opacity-100">
              <span aria-hidden="true">←</span> All work
            </Link>

            <p className="label mt-9 mb-4 opacity-60">
              <span className="text-[var(--color-pink)]">{study.index}</span> · {study.client} · {study.year}
            </p>

            <h1 className="display m-0 max-w-[15ch] text-[clamp(40px,8.4vw,110px)]">
              {study.title}
            </h1>

            <p className="mt-7 mb-0 max-w-[58ch] text-[clamp(17px,2.1vw,22px)] leading-[1.45] opacity-80">
              {study.proposition}
            </p>

            <dl className="m-0 mt-12 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 desktop:grid-cols-4">
              {study.meta.map((m) => (
                <div key={m.k} className="border-t border-current/25 pt-3">
                  <dt className="label m-0 opacity-55">{m.k}</dt>
                  <dd className="m-0 mt-1.5 text-[15px] leading-[1.35]">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section data-ground="bone" className="pb-16">
          <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
            <div
              className="overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
              style={{ aspectRatio: study.lead.ratio }}
            >
              <Picture
                set={study.lead.set}
                slug={study.lead.slug}
                alt={`${study.title} — ${study.client}`}
                sizes="(min-width: 1200px) 92vw, 94vw"
                priority
                className={`h-full w-full object-cover ${study.lead.anchor === 'top' ? 'object-top' : 'object-center'}`}
              />
            </div>
          </div>
        </section>

        {study.chapters.map((chapter, i) => (
          <div key={i}>
            <Stripe />
            <section data-ground={chapter.ground} className="py-16 desktop:py-24">
              <div className="mx-auto flex max-w-[var(--container)] flex-col gap-14 px-[var(--gutter)] desktop:gap-20">
                {chapter.blocks.map((block, j) => (
                  <BlockView key={j} block={block} />
                ))}
              </div>
            </section>
          </div>
        ))}
      </article>

      <Stripe />

      <section data-ground={railGround} className="py-16 desktop:py-20">
        <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
          <p className="label m-0 mb-6 opacity-60">Next project</p>
          <Link to={`/work/${next.slug}`} className="group flex flex-wrap items-center gap-x-5 gap-y-3 no-underline">
            <span className="display text-[clamp(30px,6.4vw,80px)]">{next.title}</span>
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-current text-lg transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
          <p className="mt-5 mb-0 max-w-[54ch] text-[15px] leading-[1.5] opacity-70">{next.proposition}</p>
        </div>
      </section>
    </>
  );
}
