import { Hero } from '../components/Hero';
import { HeroStage } from '../components/HeroStage';
import { Proof } from '../components/Proof';
import { Tape } from '../components/Tape';
import { Work } from '../components/Work';
import { Statement } from '../components/Statement';
import { About } from '../components/About';
import { Archive } from '../components/Archive';
import { Stripe } from '../components/Stripe';

export default function Home() {
  return (
    <>
      {/* Everything inside the stage has the film pinned behind or in front of it.
          It ends at Tape: she is gone before Selected Work arrives. */}
      <HeroStage>
        <Hero />
        <Stripe className="relative z-20" />
        <Proof />
        <Stripe className="relative z-20" />
        <Tape />
      </HeroStage>
      <Stripe />
      <Work />
      <Stripe />
      <Statement />
      <Stripe />
      <About />
      <Stripe />
      <Archive />
    </>
  );
}
