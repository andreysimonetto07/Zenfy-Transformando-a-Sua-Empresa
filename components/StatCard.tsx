export default function StatCard({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-lg border border-zinc-200 bg-white p-5"><p className="text-sm text-zinc-500">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p></div>;
}
