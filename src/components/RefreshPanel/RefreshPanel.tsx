interface RefreshPanelProps {
  onSoftRefresh: () => void;
  onHardRefresh: () => void;
  disabled?: boolean;
}

export function RefreshPanel({
  onSoftRefresh,
  onHardRefresh,
  disabled = false,
}: RefreshPanelProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-3 mt-3">
      <button
        className="px-3 py-2 rounded-[12px] bg-green-600 text-white dark:bg-blue-500"
        onClick={onSoftRefresh}
        disabled={disabled}
        title="Принудительный запрос без сноса кэша (список + открытая карточка)"
      >
        Refresh
      </button>
      <button
        className="px-3 py-2 rounded-[12px] bg-green-600 text-white dark:bg-blue-500"
        onClick={onHardRefresh}
        disabled={disabled}
        title="Инвалидация People и Person и перезапрос"
      >
        Hard refresh
      </button>
    </div>
  );
}
