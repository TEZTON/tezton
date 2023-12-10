"use client";
import { DeliverablePhaseSchemaType } from "@/schema/deliverable";
import { useEffect, useRef } from "react";
import { Timeline as TL, DataSet } from "vis-timeline/standalone";

interface DeliverableTimelineProps {
  groups: {
    id: string;
    name: string;
  }[];
  phases: DeliverablePhaseSchemaType[];
  onPhaseClick?: (selectedPhase: DeliverablePhaseSchemaType) => void;
}

var groups = new DataSet([
  { id: "0", content: "Ideacao" },
  { id: "1", content: "Refinamento" },
  { id: "2", content: "Desenvolvimento" },
  { id: "3", content: "Test" },
  { id: "4", content: "Piloto" },
  { id: "5", content: "Producao" },
]);

export default function DeliverableTimeline({
  groups,
  phases,
  onPhaseClick,
}: DeliverableTimelineProps) {
  const timelineRef = useRef(null);

  useEffect(() => {
    let timeline: TL;

    if (timelineRef.current) {
      const mappedGroups = groups.map((group) => ({
        id: group.id,
        content: group.name,
      }));

      const mappedPhases = phases.map((phase) => ({
        id: phase.id,
        group: phase.type,
        content: phase.name,
        start: phase.startDate,
        end: phase.endDate,
      }));

      timeline = new TL(timelineRef.current, mappedPhases, mappedGroups, {
        orientation: "top",
      });
      timeline.on("select", (properties) => {
        const selectedItem = properties.items[0];
        const selectedPhase = phases.find((phase) => phase.id === selectedItem);
        if (selectedPhase && onPhaseClick) {
          onPhaseClick(selectedPhase);
        }
      });
    }

    return () => {
      if (timeline) {
        timeline.destroy();
      }
    };
  }, [timelineRef, groups, phases, onPhaseClick]);

  return <div ref={timelineRef}> </div>;
}
