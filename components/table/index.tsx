import React, { useContext } from "react";
import { FileText } from "lucide-react";
import { GlobalContext } from "@/contexts/GlobalContext";
import "./styles.css";

interface TableProps {
    data: Array<{
        sel: boolean;
        name: string;
        email: string;
        company: string;
        phone: string;
        activation: string;
        lastAccess: string;
        user: string;
        client: string;
        product: string;
        team: string;
        history: string;
    }>;
}
const optionUser: string[] = ["Selecionar FUNÇÃO", "Opção 1", "Opção 2", "Opção 3"];
const optionClient: string[] = ["Selecionar Cliente", "Opção 1", "Opção 2", "Opção 3"];
const optionItem: string[] = ["Selecionar Item", "Opção 1", "Opção 2", "Opção 3"];

export const Tables: React.FC<TableProps> = ({ data }) => {
    const { user } = useContext(GlobalContext);
    console.log(user, 'teste');
    return (
        <table>
            <thead>
                <tr>
                    <th>Sel</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Empresa</th>
                    <th>Tel</th>
                    <th>Ativação</th>
                    <th>Último acesso</th>
                    <th>Usuário</th>
                    <th>Cliente</th>
                    <th>Produto</th>
                    <th>Time</th>
                    <th>Histórico</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <input type="checkbox" checked={item.sel} />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.company}</td>
                        <td>{item.phone}</td>
                        <td>{item.activation}</td>
                        <td>{item.lastAccess}</td>
                        <td>
                        <select className="w-full">
                            {optionUser.map((opcao, opcaoIndex) => (
                                <option key={opcaoIndex} value={opcao}>
                                    {opcao}
                                </option>
                            ))}
                        </select>
                        </td>
                        <td>
                        <select className="w-full">
                            {optionClient.map((opcao, opcaoIndex) => (
                                <option key={opcaoIndex} value={opcao}>
                                    {opcao}
                                </option>
                            ))}
                        </select>
                        </td>
                        <td>
                        <select className="w-full">
                            {optionItem.map((opcao, opcaoIndex) => (
                                <option key={opcaoIndex} value={opcao}>
                                    {opcao}
                                </option>
                            ))}
                        </select>
                        </td>
                        <td>
                        <select className="w-full">
                            {optionItem.map((opcao, opcaoIndex) => (
                                <option key={opcaoIndex} value={opcao}>
                                    {opcao}
                                </option>
                            ))}
                        </select>
                        </td>
                        <td>
                            <FileText/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};