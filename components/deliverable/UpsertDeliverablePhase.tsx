import { UpsertDeliverableTypeSchemaType } from "@/schema/deliverable";
import { format, formatISO, startOfToday } from "date-fns";
import { useFormContext } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import CalendarPopover from "../calendar/CalendarPopover";
import { useState } from "react";

export default function UpsertDeliverablePhase() {
  const { watch, register, setValue } =
    useFormContext<UpsertDeliverableTypeSchemaType>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <form className="flex flex-col gap-4">
      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Titulo"
        {...register("name")}
      />

      <CalendarPopover
        open={startDateOpen}
        onOpenChange={setStartDateOpen}
        value={startDate && formatISO(startDate)}
        minDate={startOfToday()}
        onChange={(date) => {
          if (date && !Array.isArray(date)) {
            setValue("startDate", date);
          }

          setStartDateOpen(false);
        }}
        trigger={
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} />

            <input
              className="input input-sm input-bordered input-primary w-full"
              placeholder="Data de Inicio"
              defaultValue={startDate && format(startDate, "PP")}
            />
          </div>
        }
      />

      <CalendarPopover
        open={endDateOpen}
        onOpenChange={setEndDateOpen}
        value={endDate && formatISO(endDate)}
        minDate={startDate}
        onChange={(date) => {
          if (date && !Array.isArray(date)) {
            setValue("endDate", date);
          }

          setEndDateOpen(false);
        }}
        trigger={
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} />

            <input
              className="input input-sm input-bordered input-primary w-full"
              placeholder="Data de Fim"
              defaultValue={endDate && format(endDate, "PP")}
            />
          </div>
        }
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
        placeholder="Descricao"
        rows={4}
      />
    </form>
  );
}
