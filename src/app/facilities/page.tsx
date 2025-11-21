"use client";
import { useState } from "react";
import { EntityBuilder } from "@/components/entity-builder";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<string[]>([]);

  return (
    <EntityBuilder
      title="Facilities"
      entities={facilities}
      onUpdate={setFacilities}
    />
  );
}
