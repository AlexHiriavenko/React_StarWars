import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[50vh] flex flex-col items-start justify-center gap-3">
      <h1 className="text-3xl font-bold">404 — Page not found</h1>
      <p className="text-white/70">Unfortunately, there is no such pag</p>
      <Link href="/" className="underline">Return to home page</Link>
    </section>
  );
}