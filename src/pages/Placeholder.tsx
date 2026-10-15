export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-2xl bg-white p-10 text-center shadow-soft">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-slate-400">
        This module is ready for your next business rules and API fields.
      </p>
    </div>
  );
}
