"use client";

import { add, startOfToday, startOfTomorrow, sub } from "date-fns";
import { useEffect, useRef } from "react";

import { Timeline as TL, DataSet } from "vis-timeline/standalone";

var groups = new DataSet([
  { id: 0, content: "First", value: 1 },
  { id: 1, content: "Third", value: 3 },
  { id: 2, content: "Second", value: 2 },
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

export default function Timeline() {
  const timelineRef = useRef(null);

  useEffect(() => {
    const timeline = new TL(timelineRef.current, items, groups, {
      orientation: "top",
    });

    // Cleanup function
    return () => {
      timeline.destroy();
    };
  }, []);

  return <div ref={timelineRef}> </div>;
}
