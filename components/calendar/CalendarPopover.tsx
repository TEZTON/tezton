import { Popover } from "../Popover";
import { format } from "date-fns";
import Calendar, { CalendarProps } from "react-calendar";

interface CalendarPopoverProps extends CalendarProps {
  trigger: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CalendarPopover({
  trigger,
  open,
  onOpenChange,
  ...props
}: CalendarPopoverProps) {
  return (
    <Popover
      trigger={trigger}
      className="w-[280px] rounded-sm border border-disabled/50 bg-white"
      align="start"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Calendar
        className="calendar-modal mb-2"
        tileClassName={
          "text-secondary-type text-sm mb-2 disabled:text-[#bababa] hover:bg-gray-400 hover:rounded-full hover:text-white py-2"
        }
        navigationLabel={({ label }) => (
          <p className={"text-sm text-secondary-type"}>{label}</p>
        )}
        nextLabel={">"}
        next2Label={null}
        prev2Label={null}
        prevLabel={"<"}
        formatShortWeekday={(_, date) => format(date, "EEEEE")}
        formatMonth={(_, date) => format(date, "LLL")}
        minDetail="decade"
        calendarType="US"
        {...props}
      />
    </Popover>
  );
}
