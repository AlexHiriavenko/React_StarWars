import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About – React StarWars',
};

export default function AboutPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">About</h1>
      <p>что-то о проекте</p>
    </section>
  );
}