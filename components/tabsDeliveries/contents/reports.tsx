export const ReportsContent = () => {
  const STATUS = [
    { status_name: "Sucesso", value: 0 },
    { status_name: "Falhas", value: 0 },
    { status_name: "Bloqueados", value: 0 },
    { status_name: "Cancelados", value: 0 },
  ];

  return (
    <div className="w-full flex flex-col flex-1">
      <span className="text-md">Execuções Pendentes</span>
      <div className="w-full flex flex-col">
        <span className="text-md">0/0</span>
        {STATUS.map((status) => (
          <div
            key={status.status_name}
            className="border-b border-t border-default dark:border-defaultdark w-full flex flex-col"
          >
            <span className="text-base">{status.status_name}</span>
            <span className="text-sm">{status.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
