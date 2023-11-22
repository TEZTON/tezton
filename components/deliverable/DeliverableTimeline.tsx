"use client";

import { add, startOfToday, startOfTomorrow, sub } from "date-fns";
import { useEffect, useRef } from "react";

import { Timeline as TL, DataSet } from "vis-timeline/standalone";

var groups = new DataSet([
  { id: 0, content: "Ideacao", value: 1 },
  { id: 1, content: "Refinamento", value: 2 },
  { id: 2, content: "Desenvolvimento", value: 3 },
  { id: 3, content: "Test", value: 4 },
  { id: 4, content: "Piloto", value: 5 },
  { id: 5, content: "Producao", value: 6 },
]);

var items = new DataSet([
  {
    id: 0,
    group: 0,
    content: "item 0",
    start: add(startOfToday(), { hours: 8 }),
    end: add(startOfTomorrow(), { hours: 8 }),
  },
  {
    id: 1,
    group: 0,
    content: "item 1",
    start: sub(startOfToday(), { days: 2 }),
    end: add(startOfTomorrow(), { hours: 8 }),
  },
  {
    id: 2,
    group: 1,
    content: "item 2",
    start: sub(startOfToday(), { days: 1 }),
    end: add(startOfTomorrow(), { days: 8 }),
  },
  {
    id: 3,
    group: 1,
    content: "item 3",
    start: sub(startOfToday(), { days: 0 }),
    end: add(startOfTomorrow(), { hours: 8 }),
  },
  {
    id: 4,
    group: 1,
    content: "item 4",
    start: add(startOfToday(), { days: 3 }),
    end: add(startOfTomorrow(), { days: 8 }),
  },
  {
    id: 5,
    group: 2,
    content: "item 5",
    start: add(startOfToday(), { days: 3 }),
    end: add(startOfTomorrow(), { days: 8 }),
  },
]);

export default function DeliverableTimeline() {
  const timelineRef = useRef(null);

  useEffect(() => {
    let timeline: TL;

    if (timelineRef.current) {
      timeline = new TL(timelineRef.current, items, groups, {
        orientation: "top",
      });
    }

    return () => {
      if (timeline) {
        timeline.destroy();
      }
    };
  }, [timelineRef]);

  return <div ref={timelineRef}> </div>;
}
