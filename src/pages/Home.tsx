import { Hero } from '../components/Hero';
import { Proof } from '../components/Proof';
import { Work } from '../components/Work';
import { Statement } from '../components/Statement';
import { About } from '../components/About';
import { Archive } from '../components/Archive';
import { Stripe } from '../components/Stripe';

export default function Home() {
  return (
    <>
      <Hero />
      <Stripe />
      <Proof />
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
