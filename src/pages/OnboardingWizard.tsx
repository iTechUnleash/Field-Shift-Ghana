import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Droplets, Sun, Cloud, Shovel, Coins, Heart, Waves, Shield } from 'lucide-react';
import { StepShell } from '@/components/StepShell';
import { OptionCard } from '@/components/OptionCard';
import { CropIcon } from '@/components/CropIcons';
import { regions } from '@/data/regions';
import { crops } from '@/data/crops';
import type { Priority, WaterAccess } from '@/lib/rotation';
import type { FarmerAnswers } from '@/lib/types';
import {
  soilLabels,
  soilHints,
  waterLabels,
  waterHints,
  priorityLabels,
  priorityDescriptions,
  emptyAnswers,
} from '@/lib/types';
import type { SoilType } from '@/data/crops';

const soilOptions: { value: SoilType; icon: React.ReactNode }[] = [
  { value: 'sandy', icon: <Sun className="h-6 w-6" style={{ color: '#F4C04E' }} /> },
  { value: 'loam', icon: <Cloud className="h-6 w-6" style={{ color: '#45D19A' }} /> },
  { value: 'clay', icon: <Shovel className="h-6 w-6" style={{ color: '#E5604D' }} /> },
];

const waterOptions: { value: WaterAccess; icon: React.ReactNode }[] = [
  { value: 'rain', icon: <Droplets className="h-6 w-6" style={{ color: '#45D19A' }} /> },
  { value: 'irrigated', icon: <Waves className="h-6 w-6" style={{ color: '#127A55' }} /> },
];

const priorityOptions: { value: Priority; icon: React.ReactNode }[] = [
  { value: 'income', icon: <Coins className="h-6 w-6" style={{ color: '#F4C04E' }} /> },
  { value: 'soil', icon: <Heart className="h-6 w-6" style={{ color: '#45D19A' }} /> },
  { value: 'water', icon: <Droplets className="h-6 w-6" style={{ color: '#127A55' }} /> },
  { value: 'risk', icon: <Shield className="h-6 w-6" style={{ color: '#E5604D' }} /> },
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<FarmerAnswers>(emptyAnswers);

  useEffect(() => {
    const stored = sessionStorage.getItem('fieldshift-answers');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restored: FarmerAnswers = {
          regionId: parsed.regionId ?? null,
          soil: parsed.soil ?? null,
          water: parsed.water ?? null,
          lastCrop: parsed.lastCrop ?? null,
          priority: parsed.priority ?? null,
        };
        setAnswers(restored);
        if (parsed._editStep && parsed._editStep >= 1 && parsed._editStep <= 3) {
          setStep(parsed._editStep as 1 | 2 | 3);
          delete parsed._editStep;
          sessionStorage.setItem('fieldshift-answers', JSON.stringify(parsed));
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const step1Complete = answers.regionId !== null;
  const step2Complete = answers.soil !== null && answers.water !== null && answers.lastCrop !== null;
  const step3Complete = answers.priority !== null;

  const canContinue = step === 1 ? step1Complete : step === 2 ? step2Complete : step3Complete;

  const helperText = useMemo(() => {
    if (step === 1) return 'Select your region to continue';
    if (step === 2) {
      if (!answers.soil) return 'Tell us about your soil type';
      if (!answers.water) return 'Choose your water access';
      if (!answers.lastCrop) return 'Pick what you grew last season';
    }
    if (step === 3) return 'Choose your top priority for this rotation';
    return '';
  }, [step, answers]);

  function handleBack() {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
    else navigate('/');
  }

  function handleContinue() {
    if (!canContinue) return;
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      const stored = { ...answers, _ts: Date.now() };
      sessionStorage.setItem('fieldshift-answers', JSON.stringify(stored));
      navigate('/results');
    }
  }

  return (
    <StepShell
      step={step}
      title={step === 1 ? 'Where is your farm?' : step === 2 ? 'Tell us about your field' : 'What matters most to you?'}
      subtitle={
        step === 1
          ? 'We use your region to pull local rainfall and temperature data from NASA satellites.'
          : step === 2
          ? 'The more we know about your field, the better we can match crops to your land.'
          : 'Your priority shapes which crops we recommend. You can change this later.'
      }
      canContinue={canContinue}
      helperText={helperText}
      onBack={handleBack}
      onContinue={handleContinue}
      continueLabel={step === 3 ? 'Get my plan' : 'Continue'}
    >
      {step === 1 && (
        <>
          {regions.map((region) => (
            <OptionCard
              key={region.id}
              selected={answers.regionId === region.id}
              onClick={() => setAnswers({ ...answers, regionId: region.id })}
              title={`${region.name} — ${region.town}`}
              hint={`Lat ${region.lat.toFixed(4)}, Lon ${region.lon.toFixed(4)}`}
              icon={<MapPin className="h-6 w-6" style={{ color: 'var(--accent)' }} />}
              ariaLabel={`Select ${region.name} region, ${region.town}`}
            />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <p className="font-display text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Soil type
          </p>
          {soilOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={answers.soil === opt.value}
              onClick={() => setAnswers({ ...answers, soil: opt.value })}
              title={soilLabels[opt.value]}
              hint={soilHints[opt.value]}
              icon={opt.icon}
              ariaLabel={`Select ${soilLabels[opt.value]} soil`}
            />
          ))}

          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Water access
          </p>
          {waterOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={answers.water === opt.value}
              onClick={() => setAnswers({ ...answers, water: opt.value })}
              title={waterLabels[opt.value]}
              hint={waterHints[opt.value]}
              icon={opt.icon}
              ariaLabel={`Select ${waterLabels[opt.value]} water access`}
            />
          ))}

          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Last crop you grew
          </p>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            {crops.map((crop) => (
              <OptionCard
                key={crop.id}
                selected={answers.lastCrop === crop.id}
                onClick={() => setAnswers({ ...answers, lastCrop: crop.id })}
                title={crop.name}
                icon={<CropIcon iconKey={crop.iconKey} className="h-7 w-7" />}
                ariaLabel={`Select ${crop.name} as last crop`}
              />
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          {priorityOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={answers.priority === opt.value}
              onClick={() => setAnswers({ ...answers, priority: opt.value })}
              title={priorityLabels[opt.value]}
              hint={priorityDescriptions[opt.value]}
              icon={opt.icon}
              ariaLabel={`Select ${priorityLabels[opt.value]} as priority`}
            />
          ))}
        </>
      )}
    </StepShell>
  );
}
