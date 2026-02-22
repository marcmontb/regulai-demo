"use client";

import ComingSoon from "@/components/ComingSoon";
import { FileText } from "lucide-react";

export default function SDSExtractionPage() {
  return (
    <ComingSoon
      icon={FileText}
      titleKey="nav.sdsExtraction"
      descriptionEn="AI-powered extraction and validation of regulatory and physicochemical data from Safety Data Sheets (SDS) for automated processing."
      descriptionEs="Extracción y validación con IA de datos regulatorios y fisicoquímicos de Fichas de Datos de Seguridad (SDS) para procesamiento automatizado."
      features={[
        { en: "PDF upload and AI-powered data extraction", es: "Carga de PDF y extracción de datos con IA" },
        { en: "Automatic field mapping to regulatory databases", es: "Mapeo automático de campos a bases de datos regulatorias" },
        { en: "Cross-validation with official regulatory sources", es: "Validación cruzada con fuentes regulatorias oficiales" },
        { en: "Optimized data export to SDS generation systems", es: "Exportación optimizada de datos a sistemas de generación de SDS" },
      ]}
    />
  );
}
