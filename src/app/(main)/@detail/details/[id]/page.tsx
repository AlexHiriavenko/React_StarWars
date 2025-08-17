export default async function CharacterDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="rounded-lg border border-white/10 p-4 space-y-2">
      <h3 className="text-lg font-semibold">Character #{id}</h3>
      <p className="text-white/70">Здесь отрисуем детали из API.</p>
    </div>
  );
}