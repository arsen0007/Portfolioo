import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SkillLedger } from '@/components/skills/SkillLedger';
import { niches } from '@/lib/data/skillTree';

export default function SkillsPage() {
  const allSkills = niches.flatMap((niche) => niche.skills);
  const shippedCount = allSkills.filter((skill) => skill.status === 'shipped').length;
  const appliedCount = allSkills.filter((skill) => skill.status === 'applied').length;

  return (
    <main className="dot-grid relative">
      <Breadcrumb items={[{ href: '/', label: 'Tousif Ali' }, { label: 'Skills' }]} />

      <div className="mx-auto max-w-2xl px-6 pt-10 text-center">
        <p className="font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-textMuted">
          CAPABILITIES
        </p>
        <h1 className="mt-4 text-balance font-display text-[34px] font-medium leading-tight text-textPrimary md:text-[44px]">
          Backed by shipped work.
        </h1>
        <p className="mx-auto mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-textSecondary">
          {allSkills.length} skills&nbsp;&middot;&nbsp;{shippedCount} shipped&nbsp;&middot;&nbsp;{appliedCount} applied
        </p>
      </div>

      <div className="mt-10">
        <SkillLedger />
      </div>
    </main>
  );
}
