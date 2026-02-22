"use client";

import ComingSoon from "@/components/ComingSoon";
import { Database } from "lucide-react";

export default function InternalHomologationPage() {
  return (
    <ComingSoon
      icon={Database}
      titleKey="nav.internalHomologation"
      descriptionEn="Automate the internal homologation record for material-supplier relationships, including composite data synchronization and specification management."
      descriptionEs="Automatización del registro de homologación interna para relaciones material-proveedor, incluyendo sincronización de datos composite y gestión de especificaciones."
      features={[
        { en: "Automated data population from approved questionnaires", es: "Población automática de datos desde cuestionarios aprobados" },
        { en: "Bidirectional synchronization with composite system", es: "Sincronización bidireccional con el sistema composite" },
        { en: "Logic engine for 446+ specification fields", es: "Motor de lógica para más de 446 campos de especificación" },
        { en: "Status-based data flow management (Z01/Z02)", es: "Gestión de flujo de datos basada en estatus (Z01/Z02)" },
      ]}
    />
  );
}
