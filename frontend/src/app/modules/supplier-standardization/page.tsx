"use client";

import ComingSoon from "@/components/ComingSoon";
import { Users } from "lucide-react";

export default function SupplierStandardizationPage() {
  return (
    <ComingSoon
      icon={Users}
      titleKey="nav.supplierStandardization"
      descriptionEn="Standardized supplier qualification process with centralized scoring questionnaires and automated evaluation workflows."
      descriptionEs="Proceso estandarizado de calificación de proveedores con cuestionarios centralizados de puntuación y flujos de evaluación automatizados."
      features={[
        { en: "Centralized supplier qualification questionnaire", es: "Cuestionario centralizado de calificación de proveedores" },
        { en: "Multi-criteria scoring system (quality, sustainability, compliance)", es: "Sistema de puntuación multicriterio (calidad, sostenibilidad, cumplimiento)" },
        { en: "Automated supplier risk assessment", es: "Evaluación automatizada de riesgo de proveedores" },
        { en: "Integration with material-level homologation data", es: "Integración con datos de homologación a nivel de material" },
      ]}
    />
  );
}
