"use client";

import ComingSoon from "@/components/ComingSoon";
import { Wheat } from "lucide-react";

export default function FeedRequirementsPage() {
  return (
    <ComingSoon
      icon={Wheat}
      titleKey="nav.feedRequirements"
      descriptionEn="Specialized homologation processes and requirements for products destined for animal feed (FEED) applications, including regulatory compliance checks."
      descriptionEs="Procesos y requisitos de homologación especializados para productos destinados a alimentación animal (FEED), incluyendo verificaciones de cumplimiento regulatorio."
      features={[
        { en: "FEED-specific questionnaire templates", es: "Plantillas de cuestionarios específicos para FEED" },
        { en: "Animal feed regulation compliance validation", es: "Validación de cumplimiento de regulación de alimentación animal" },
        { en: "Integration with existing homologation workflows", es: "Integración con flujos de homologación existentes" },
        { en: "Specialized documentation requirements tracking", es: "Seguimiento de requisitos de documentación especializada" },
      ]}
    />
  );
}
