import type { ReactNode } from 'react';

export default function MainLayout({
  // children можно не выводить (у нас (main)/page.tsx = null),
  // но лучше объявить, чтобы не было сюрпризов в будущем
  children,
  list,
  detail,
}: {
  children: ReactNode;
  list: ReactNode;
  detail: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <section>{list}</section>
      <aside className="hidden lg:block">{detail}</aside>
    </div>
  );
}