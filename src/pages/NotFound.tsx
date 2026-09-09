import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section data-ground="bone" className="grid min-h-[70vh] place-items-center py-24">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] text-center">
        <p className="label m-0 mb-5 text-[var(--color-pink)]">404</p>
        <h1 className="display m-0 text-[clamp(36px,7vw,84px)]">Nothing here.</h1>
        <p className="mx-auto mt-6 mb-8 max-w-[42ch] text-[16px] leading-[1.55] opacity-75">
          That page does not exist — or has not been built yet.
        </p>
        <Link to="/" className="btn label inline-block no-underline">Back to the work</Link>
      </div>
    </section>
  );
}
