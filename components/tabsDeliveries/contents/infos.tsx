export const InfoContent = () => {
  const MOCK_CHANNELS = [
    { label: "Android", value: true },
    { label: "iOS", value: true },
    { label: "Tablet", value: false },
    { label: "Web", value: false },
    { label: "Outros", value: true },
  ];

  const MockInformations = [
    { label: "Título", value: "Título" },
    { label: "Data ini", value: new Date().toLocaleDateString() },
    { label: "Data Fim", value: new Date().toLocaleDateString() },
    { label: "Anexo da Documentação", value: "" },
    { label: "Canais", value: "", channels: MOCK_CHANNELS },
    { label: "URL's", value: "", url: "" },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      {MockInformations.map((prop) => (
        <div key={prop.label + prop.value} className="w-full flex flex-col">
          <div className="text-sm">{prop.label}</div>
          {prop.value.length > 1 && <div className="text-xs">{prop.value}</div>}
          {prop.channels && (
            <div className="w-full flex flex-wrap flex-1 gap-1">
              {prop.channels.map((ch) => (
                <div
                  key={ch.label + ch.value}
                  className="text-xs flex items-center gap-1 w-20"
                >
                  <input
                    type="checkbox"
                    checked={ch.value}
                    onChange={() => {}}
                  />
                  {ch.label}
                </div>
              ))}
            </div>
          )}
          {prop.url && (
            <div className="w-full flex flex-col">
              <a href={prop.url}>{prop.url}</a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
