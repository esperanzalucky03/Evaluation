"use client";
import { useState } from "react";
import { EntityBuilder } from "@/components/entity-builder";

export default function MaintenancePage() {
  const [maintenance, setMaintenance] = useState<string[]>([]);

  return (
    <EntityBuilder
      title="Maintenance"
      entities={maintenance}
      onUpdate={setMaintenance}
    />
  );
}