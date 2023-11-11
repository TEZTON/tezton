export const DeleteCompany = () => {
  return (
    <form className="w-full flex flex-row justify-end gap-5">
      <button type="submit">Não</button>
      <button className="border-2 border-red-500 rounded" type="submit">
        Sim
      </button>
    </form>
  );
};
