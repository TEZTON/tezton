export default function UpsertProjectExpanded() {
  return (
    <form className="flex flex-col gap-4">
      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Titulo"
      />

      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Data de Inicio"
      />
      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Data de Fim"
      />

      <input
        type="file"
        className="file-input file-input-xs  file-input-bordered text-xs file-input-primary"
        placeholder="Documentação anexada"
      />

      <div>
        <p>Canais</p>
        <div className="divider m-0" />
      </div>

      <div className="flex flex-wrap gap-2">
        <label className="label cursor-pointer justify-normal">
          <input
            type="checkbox"
            defaultChecked={true}
            className="checkbox checkbox-primary text-white"
          />
          <span className="label-text ml-2">Android</span>
        </label>

        <label className="label cursor-pointer justify-normal">
          <input
            type="checkbox"
            defaultChecked={true}
            className="checkbox checkbox-primary text-white"
          />
          <span className="label-text ml-2">iOS</span>
        </label>

        <label className="label cursor-pointer justify-normal">
          <input
            type="checkbox"
            defaultChecked={true}
            className="checkbox checkbox-primary text-white"
          />
          <span className="label-text ml-2">Tablet</span>
        </label>

        <label className="label cursor-pointer justify-normal">
          <input
            type="checkbox"
            defaultChecked={true}
            className="checkbox checkbox-primary text-white"
          />
          <span className="label-text ml-2">Web</span>
        </label>

        <label className="label cursor-pointer justify-normal">
          <input
            type="checkbox"
            defaultChecked={true}
            className="checkbox checkbox-primary text-white"
          />
          <span className="label-text ml-2">Outros</span>
        </label>
      </div>

      <div>
        <p>Url</p>
        <div className="divider m-0" />
      </div>

      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Url"
      />

      <div>
        <p>Descricao</p>
        <div className="divider m-0" />
      </div>

      <textarea
        className="textarea textarea-sm textarea-bordered textarea-primary"
        placeholder="Url"
        rows={4}
      />
    </form>
  );
}
