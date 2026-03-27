export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-cyan-400">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
    </div>
  );
}
