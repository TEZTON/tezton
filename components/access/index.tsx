import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ACCESS_USER_KEY, getAccessApi } from "@/api/access";
import { useState } from "react";
import { Tables } from "../../components/table";


export const AccessComponent = () => {
  const [actives, setActives] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  /* const { data } = useQuery({
    queryKey: [ACCESS_USER_KEY.getAccessUsers],
    queryFn: getCompanyApi,
  }); */

  const mockData = [
      {
          sel: true,
          name: "Alice",
          email: "alice@gok.digital",
          company: "GO-K",
          phone: "(11) 1111-1111",
          activation: "20, jan, 21",
          lastAccess: "20, dez, 20",
          user: "Usuário A",
          Cliente: "Cliente A",
          Produto: "Produto A",
          team: "team A",
          history: "Histórico A",
        },
        {
          sel: false,
          name: "Bob",
          email: "bob@gok.digital",
          company: "GO-K",
          phone: "(11) 1111-1111",
          activation: "20, jan, 21",
          lastAccess: "20, dez, 20",
          user: "Usuário B",
          client: "client B",
          product: "product B",
          team: "Time B",
          history: "Histórico B",
        },
        {
          sel: false,
          name: "Bob",
          email: "bob@gok.digital",
          company: "GO-K",
          phone: "(11) 1111-1111",
          activation: "20, jan, 21",
          lastAccess: "20, dez, 20",
          user: "Usuário B",
          client: "client B",
          product: "product B",
          team: "Time B",
          history: "Histórico B",
        },
  ];

  const filteredData = mockData.filter((item) => {
      const normalizedQuery = searchQuery.toLowerCase();
      const normalizedEmpresa = item.company.toLowerCase();
      const normalizedNome = item.name.toLowerCase();
      const normalizedEmail = item.email.toLowerCase();
  
      return (
          (actives ? item.sel : true) &&
          (normalizedEmpresa.includes(normalizedQuery) ||
           normalizedNome.includes(normalizedQuery) ||
           normalizedEmail.includes(normalizedQuery)
          )
      );
  });

  return (
      <div>
          <div className="w-full grid grid-cols-[80%,20%] grid-rows-none gap-4 p-4 justify-between">
              <div>
                  <input
                      type="checkbox"
                      checked={actives}
                      onChange={() => setActives(!actives)}
                  />
                  <span className="ml-5">Somente ativos</span>
              </div>
              <div className="w-full flex flex-row justify-end gap-6">
                  <input
                      type="search"
                      placeholder="Pesquisar"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
                  />
                  <button className="flex items-center justify-center w-16 h-12 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 bg-foreground">
                      <SearchIcon />
                  </button>
              </div>
              <div className="flex-col">
                  <button className="flex items-center justify-center w-200 hover-bg-[#e6e8eb] dark:hover-bg-[#2f2f2f] dark-text-[gray] overflow-hidden p-1 bg-foreground">
                      <text>Restart senha</text>
                  </button>
                  <span>{`${filteredData.length} de ${mockData.length}`}</span>
              </div>
          </div>
          <div className="w-full border border-default mb-5" />
          <Tables data={filteredData} />
      </div>
  );
};
