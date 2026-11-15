import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Droplets, MessageCircle, BookOpen, Repeat } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSatelliteSVG } from '@/components/HeroSVG';

export function LandingPage() {
  const navigate = useNavigate();

  const steps = [
    {
      num: '1',
      title: 'Pick your region',
      desc: 'Select from all 16 regions across Ghana, spanning the Northern, Middle, and Southern belts.',
      icon: MapPin,
    },
    {
      num: '2',
      title: 'Describe your field',
      desc: 'Tell us about your soil, water access and what you grew last season.',
      icon: Droplets,
    },
    {
      num: '3',
      title: 'Get your plan',
      desc: 'See your shifting climate, a three-season crop rotation, and long-term tree crop suitability (cocoa, oil palm, cashew, shea).',
      icon: ArrowRight,
    },
  ];

  const proofPoints = [
    {
      icon: Repeat,
      title: 'Built for smallholders',
      desc: 'Every recommendation suits small fields with limited tools and water.',
    },
    {
      icon: BookOpen,
      title: 'Explains every recommendation',
      desc: 'No black boxes. You see exactly why each crop was chosen for your land.',
    },
    {
      icon: MessageCircle,
      title: 'Share on WhatsApp',
      desc: 'Send your full plan to family or your extension officer in one tap.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <HeroSatelliteSVG />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(12,27,46,0.3) 0%, rgba(12,27,46,0.6) 50%, var(--bg) 100%)' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
          <div className="max-w-2xl">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-sm"
              style={{
                borderColor: 'rgba(69, 209, 154, 0.3)',
                background: 'rgba(69, 209, 154, 0.1)',
                color: '#6ee0b5',
              }}
            >
              <span className="h-2 w-2 rounded-full bg-bright animate-pulse-dot" />
              NASA POWER Earth observations
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              See how your climate is shifting.
              <br />
              <span style={{ color: '#45D19A' }}>Plan the next three seasons.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              NASA satellite data, turned into a simple crop rotation plan for your farm.
              No jargon. No guesswork. Just clear, practical guidance for Ghanaian smallholders.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate('/plan')}
                className="btn-primary group text-base"
                style={{ minHeight: 56, padding: '0 32px' }}
              >
                Plan my season
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-sm text-gray-400">Powered by NASA POWER Earth observations</p>
            </div>
          </div>

          {/* Floating glass stat card */}
          <div className="mt-12 max-w-sm animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div
              className="rounded-2xl border p-5 shadow-lg backdrop-blur-md"
              style={{
                background: 'rgba(12, 27, 46, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-300">Rainfall trend</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">
                    −4.1%
                    <span className="ml-1 text-base font-normal text-gray-400">per decade</span>
                  </p>
                </div>
                <div className="flex items-center rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-sm">
                  <span className="text-xs font-semibold text-gray-300">Example</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Rainfall trend example
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From satellite to your next planting */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            From satellite to your next planting
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="card p-6 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl font-bold"
                    style={{ background: 'rgba(18, 122, 85, 0.12)', color: 'var(--accent)' }}
                  >
                    {step.num}
                  </div>
                  <Icon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border p-4 text-xs leading-relaxed" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Long-term tree crop planning:</strong> Tree crop suitability (cocoa, oil palm, cashew, shea) is evaluated separately using 24-year satellite climate baselines. As an honest limitation, tree ratings reflect climate only; they do not assess soil chemistry, drainage, pests, or disease. Always confirm with COCOBOD or your local extension officer.
        </div>
      </section>

      {/* Big statement + proof points */}
      <section
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6"
      >
        <div className="card overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-2">
            <div
              className="flex flex-col justify-center p-10 sm:p-14"
              style={{ background: 'linear-gradient(135deg, #0C1B2E, #16263d)' }}
            >
              <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Rotation is the cheapest tool a farmer has.
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                You do not need new seeds, chemicals or machines. You need the right crop
                in the right season — and that is exactly what this tool gives you.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-6 p-10 sm:p-14" style={{ background: 'var(--bg-surface)' }}>
              {proofPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <div key={i} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: 'rgba(69, 209, 154, 0.12)' }}
                    >
                      <Icon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {point.title}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <button
            onClick={() => navigate('/plan')}
            className="btn-primary group text-base"
            style={{ minHeight: 56, padding: '0 40px' }}
          >
            Start planning your season
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
