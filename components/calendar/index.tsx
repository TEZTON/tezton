import {
  endOfDay,
  format,
  isEqual,
  isToday,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useCalendar } from "./useCalendar";
import Link from "next/link";
import Image from "next/image";

export const Calendar = () => {
  const { calendarData } = useCalendar();

  const { selectedFeature } = useContext(GlobalContext);

  const isDayInEvent = (day: any, start: any, end: any) =>
    isWithinInterval(day, {
      start: startOfDay(start),
      end: endOfDay(end),
    });

  const bulletRef = useRef(null);

  useEffect(() => {
    const bullet: any = bulletRef.current;

    const updateBulletPosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      const calendar = bullet?.parentElement;
      const calendarWidth = calendar?.offsetWidth;
      const bulletWidth = (calendarWidth / (24 * 60)) * totalMinutes;
      if (bullet) {
        bullet.style.width = `${bulletWidth}px`;
      }
    };

    // Atualize a posição do bullet inicialmente
    updateBulletPosition();

    // Atualize a posição do bullet a cada minuto
    const intervalId = setInterval(updateBulletPosition, 60000); // 60000 ms = 1 minuto

    // Limpe o intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [opened, setOpened] = useState(0);

  return (
    <div className="w-full h-full overflow-x-scroll scroll-smooth rounded-lg flex border border-default dark:border-defaultdark bg-foreground dark:bg-darkForeground">
      {calendarData.map((calendar, idx_calendarData) => (
        <Fragment key={idx_calendarData.toString()}>
          {idx_calendarData <= 0 && (
            <div className="flex flex-col min-w-[300px] w-[300px] border-r border-default dark:border-defaultdark">
              <div className="flex items-center justify-center h-[97px] border-b-default dark:border-defaultdark border-b">
                {selectedFeature?.feature_name}
              </div>
              <div className="flex w-full flex-col">
                {selectedFeature?.deliveries?.map(
                  (delivery: any, idx_delivery: any) => (
                    <Link
                      href={`delivery/${delivery.delivery_id}`}
                      key="delivery"
                    >
                      <div
                        key={delivery.delivery_name + idx_delivery.toString()}
                        className="w-full flex border-b-default border-b dark:border-defaultdark items-center justify-start"
                        onClick={() => setOpened(idx_delivery)}
                        style={{ height: idx_delivery === opened ? 106 : 56 }}
                      >
                        <div className="flex flex-col w-max p-2 gap-2">
                          <span className="text-xs">Envolvidos</span>
                          <div className="w-max flex">
                            {[1, 2, 3].map(() => (
                              <Image
                                key="Image"
                                alt="Image"
                                className="w-6 h-6 border border-default dark:border-defaultdark rounded-full -mr-3"
                                src="https://img.freepik.com/vetores-premium/avatar-icon002_750950-52.jpg"
                                width={24}
                                height={24}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col w-max p-2 gap-2">
                          <span className="text-xs">Entrega</span>
                          <span className="text-xs text-[gray]">
                            {/* {delivery.step} */}
                            Comprar Bilhete
                          </span>
                        </div>
                        <div className="flex flex-col w-max p-2 gap-2">
                          <span className="text-xs">Status da Etapa</span>
                          <div className="text-xs text-[gray]">Produção</div>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
          <div className="w-max flex flex-col">
            <div className="w-full flex items-center justify-center h-14 border-r-default border-r dark:border-defaultdark">
              {calendar.month}
            </div>
            <div className="w-full flex border-b-default border-r-default dark:border-defaultdark border-b border-r text-xs">
              {calendar.days.map((day: any, idx: any) => (
                <div
                  key={day + idx}
                  className="w-14 min-w-[56px] flex items-center justify-center text-xs border-r-default dark:border-defaultdark border-r last:border-r-0"
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>
            {/* FIM do cabeçalho com numeros dos dias do mes */}

            {selectedFeature?.deliveries?.map(
              (delivery: any, idx_delivery: any) => {
                return (
                  <div className="flex" key={delivery.label + idx_delivery}>
                    <div
                      className="w-full flex border-b-default border-r-default dark:border-defaultdark border-b border-r text-xs"
                      onClick={() => setOpened(idx_delivery)}
                      style={{ height: idx_delivery === opened ? 106 : 56 }}
                    >
                      {calendar.days.map((day: any, idx_delivery: any) => (
                        <div
                          key={day + idx_delivery}
                          className={`w-14 min-w-[56px] flex items-center justify-center text-xs border-r-default dark:border-defaultdark border-r last:border-r-0`}
                          style={{ borderRight: "none" }}
                        >
                          {delivery.event &&
                            isDayInEvent(
                              day,
                              delivery.event?.start,
                              delivery.event?.end
                            ) && (
                              <div
                                className={`w-14 h-[70%] z-40 bg-primary flex justify-center ${
                                  isEqual(
                                    new Date(day),
                                    delivery.event.start
                                  ) && "rounded-l-xl ml-[6px]"
                                } ${
                                  isEqual(new Date(day), delivery.event.end) &&
                                  "rounded-r-xl mr-[6px]"
                                }`}
                              />
                            )}
                          {isToday(day) && (
                            <div className="w-14 h-full z-50 text-[#000] overflow-hidden relative">
                              <div className="bullet" ref={bulletRef} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
