import type {
  Supplier, Material, HomologationComparison, QuestionnaireField,
  FlowchartNode, FlowchartEdge, ReachSubstance, ChangeRecord,
  KPIData, ActivityItem,
} from "./types";

export const suppliers: Supplier[] = [
  { id: "SUP001", name: "ChemNova GmbH", country: "Germany", category: "Specialty Chemicals", status: "approved", lastAudit: "2025-11-15" },
  { id: "SUP002", name: "Pacific Aromatics Ltd", country: "Singapore", category: "Essential Oils & Aromatics", status: "approved", lastAudit: "2025-09-22" },
  { id: "SUP003", name: "EuroSynth S.A.", country: "France", category: "Synthetic Compounds", status: "pending", lastAudit: "2025-06-10" },
  { id: "SUP004", name: "Atlantic Fragrances Inc", country: "USA", category: "Fragrance Ingredients", status: "under_review", lastAudit: "2025-12-01" },
  { id: "SUP005", name: "Sakura Chemical Co.", country: "Japan", category: "Fine Chemicals", status: "approved", lastAudit: "2026-01-08" },
];

export const materials: Material[] = [
  { id: "MAT001", name: "Linalool", cas: "78-70-6", category: "Terpene Alcohol", supplierId: "SUP001", supplierName: "ChemNova GmbH", status: "active" },
  { id: "MAT002", name: "Limonene", cas: "5989-27-5", category: "Terpene", supplierId: "SUP002", supplierName: "Pacific Aromatics Ltd", status: "active" },
  { id: "MAT003", name: "Citral", cas: "5392-40-5", category: "Aldehyde", supplierId: "SUP001", supplierName: "ChemNova GmbH", status: "pending" },
  { id: "MAT004", name: "Vanillin", cas: "121-33-5", category: "Phenolic Aldehyde", supplierId: "SUP003", supplierName: "EuroSynth S.A.", status: "active" },
  { id: "MAT005", name: "Eugenol", cas: "97-53-0", category: "Phenylpropanoid", supplierId: "SUP002", supplierName: "Pacific Aromatics Ltd", status: "under_review" },
  { id: "MAT006", name: "Geraniol", cas: "106-24-1", category: "Terpene Alcohol", supplierId: "SUP004", supplierName: "Atlantic Fragrances Inc", status: "active" },
  { id: "MAT007", name: "Menthol", cas: "2216-51-5", category: "Cyclic Monoterpene", supplierId: "SUP005", supplierName: "Sakura Chemical Co.", status: "active" },
  { id: "MAT008", name: "Cinnamaldehyde", cas: "104-55-2", category: "Aldehyde", supplierId: "SUP002", supplierName: "Pacific Aromatics Ltd", status: "pending" },
];

export const homologationComparisons: Record<string, HomologationComparison[]> = {
  MAT001: [
    { field: "Purity (%)", category: "Quality", previousValue: "97.5", currentValue: "96.8", status: "changed", expectedRange: "96.0–99.0", riskLevel: "low" },
    { field: "Refractive Index (20°C)", category: "Physical", previousValue: "1.4600", currentValue: "1.4620", status: "unchanged", expectedRange: "1.458–1.463" },
    { field: "Density (20°C, g/mL)", category: "Physical", previousValue: "0.860", currentValue: "0.858", status: "unchanged", expectedRange: "0.855–0.865" },
    { field: "Heavy Metals (ppm)", category: "Safety", previousValue: "< 10", currentValue: "< 10", status: "unchanged", expectedRange: "< 20" },
    { field: "Allergen Declaration", category: "Regulatory", previousValue: "Linalool: Yes", currentValue: "Linalool: Yes", status: "unchanged" },
    { field: "IFRA Compliance", category: "Regulatory", previousValue: "Compliant (49th Am.)", currentValue: "Compliant (50th Am.)", status: "changed", riskLevel: "low" },
    { field: "Manufacturing Site", category: "Supply Chain", previousValue: "Frankfurt, Germany", currentValue: "Ludwigshafen, Germany", status: "changed", riskLevel: "medium" },
    { field: "Optical Rotation", category: "Quality", previousValue: "-12.5°", currentValue: "-18.2°", status: "out_of_spec", expectedRange: "-10° to -16°", riskLevel: "high" },
    { field: "Residual Solvents", category: "Safety", previousValue: "< 50 ppm", currentValue: "< 50 ppm", status: "unchanged", expectedRange: "< 100 ppm" },
    { field: "Kosher Certificate", category: "Certification", previousValue: "Valid until 12/2025", currentValue: "Valid until 12/2026", status: "changed", riskLevel: "low" },
    { field: "Halal Certificate", category: "Certification", previousValue: "Valid until 06/2026", currentValue: "Valid until 06/2027", status: "changed", riskLevel: "low" },
    { field: "GMO Status", category: "Regulatory", previousValue: "Non-GMO", currentValue: "Non-GMO", status: "unchanged" },
    { field: "Country of Origin", category: "Supply Chain", previousValue: "Germany", currentValue: "Germany", status: "unchanged" },
    { field: "Sustainability Score", category: "ESG", previousValue: "B+", currentValue: "A-", status: "changed", riskLevel: "low" },
    { field: "Carbon Footprint (kg CO2e/kg)", category: "ESG", previousValue: "2.4", currentValue: "2.1", status: "changed", riskLevel: "low" },
    { field: "Packaging Material", category: "Supply Chain", previousValue: "Steel drum 190kg", currentValue: "Steel drum 190kg", status: "unchanged" },
    { field: "Shelf Life (months)", category: "Quality", previousValue: "24", currentValue: "18", status: "out_of_spec", expectedRange: "≥ 24", riskLevel: "high" },
    { field: "Flash Point (°C)", category: "Safety", previousValue: "76", currentValue: "75", status: "unchanged", expectedRange: "≥ 71" },
  ],
  MAT002: [
    { field: "Purity (%)", category: "Quality", previousValue: "96.0", currentValue: "97.2", status: "changed", expectedRange: "95.0–99.0", riskLevel: "low" },
    { field: "Peroxide Value", category: "Safety", previousValue: "5.2", currentValue: "12.8", status: "out_of_spec", expectedRange: "< 10", riskLevel: "high" },
    { field: "Color (Gardner)", category: "Quality", previousValue: "1", currentValue: "2", status: "changed", expectedRange: "≤ 2", riskLevel: "low" },
    { field: "Allergen Declaration", category: "Regulatory", previousValue: "Limonene: Yes", currentValue: "Limonene: Yes", status: "unchanged" },
    { field: "REACH Registration", category: "Regulatory", previousValue: "Registered", currentValue: "Registered", status: "unchanged" },
    { field: "Origin", category: "Supply Chain", previousValue: "Cold-pressed, Orange peel", currentValue: "Cold-pressed, Orange peel", status: "unchanged" },
    { field: "Kosher Certificate", category: "Certification", previousValue: "Valid", currentValue: "", status: "missing", riskLevel: "high" },
  ],
};

export const questionnaireTemplates = [
  { id: "TPL001", name: "Cosmetics Regulatory Questionnaire", fields: 24 },
  { id: "TPL002", name: "Food Contact Materials Questionnaire", fields: 18 },
  { id: "TPL003", name: "Fragrance Industry (IFRA) Compliance", fields: 32 },
];

export const questionnaireResponses: Record<string, QuestionnaireField[]> = {
  "TPL001-MAT001": [
    { id: "Q1", question: "Is the product compliant with EU Cosmetics Regulation (EC) No 1223/2009?", aiAnswer: "Yes. Linalool (CAS 78-70-6) is listed in Annex III as an allergen requiring declaration when concentration exceeds 0.001% in leave-on products and 0.01% in rinse-off products.", confidence: 0.98, source: "Product Master Data + EU Regulation DB", editable: true },
    { id: "Q2", question: "Provide the INCI name of the substance.", aiAnswer: "LINALOOL", confidence: 0.99, source: "Product Master Data", editable: true },
    { id: "Q3", question: "Is the substance listed as a CMR (Carcinogenic, Mutagenic, Reprotoxic) substance?", aiAnswer: "No. Linalool is not classified as CMR under CLP Regulation (EC) No 1272/2008.", confidence: 0.97, source: "CLP Classification DB", editable: true },
    { id: "Q4", question: "Provide the maximum usage level in finished cosmetic products.", aiAnswer: "No specific maximum usage level defined by regulation. Subject to IFRA guidelines: maximum 4.3% in fine fragrance (50th Amendment).", confidence: 0.92, source: "IFRA Standards + Internal Specification", editable: true },
    { id: "Q5", question: "Is the substance of natural origin? Specify the source.", aiAnswer: "Available in both natural and synthetic grades. Current supply from ChemNova GmbH is synthetic grade, produced via chemical synthesis.", confidence: 0.95, source: "Supplier Questionnaire + Specification Sheet", editable: true },
    { id: "Q6", question: "Does the product contain nanomaterials?", aiAnswer: "No. The product is supplied as a liquid and does not contain nanomaterials as defined under EU Cosmetics Regulation.", confidence: 0.99, source: "Product Specification", editable: true },
    { id: "Q7", question: "Has the product been tested on animals?", aiAnswer: "No. ChemNova GmbH confirms compliance with EU animal testing ban. No animal testing performed for cosmetics purposes after the regulatory cut-off date.", confidence: 0.94, source: "Supplier Declaration", editable: true },
    { id: "Q8", question: "Provide allergen classification details.", aiAnswer: "Linalool is listed as one of the 26 fragrance allergens under EU Cosmetics Regulation. Must be declared on labeling above threshold concentrations (0.001% leave-on, 0.01% rinse-off).", confidence: 0.98, source: "Product Master Data + Regulatory DB", editable: true },
    { id: "Q9", question: "Is the product palm oil free or RSPO certified?", aiAnswer: "Synthetic grade - not derived from palm oil. No RSPO certification required.", confidence: 0.91, source: "Supplier Technical Data Sheet", editable: true },
    { id: "Q10", question: "Provide stability data and recommended storage conditions.", aiAnswer: "Stable under normal conditions. Store in cool, dry place, away from direct sunlight. Shelf life: 24 months from manufacture date when stored at 15-25°C in original sealed packaging.", confidence: 0.93, source: "Product Specification + Stability Studies", editable: true },
  ],
  "TPL002-MAT004": [
    { id: "Q1", question: "Is the substance authorized for food contact under EU Regulation (EC) No 1935/2004?", aiAnswer: "Vanillin (CAS 121-33-5) is authorized as a flavoring substance under Regulation (EC) No 1334/2008 and is not restricted for food contact material applications.", confidence: 0.96, source: "EU Food Regulation DB", editable: true },
    { id: "Q2", question: "Provide the E-number if applicable.", aiAnswer: "Not applicable. Vanillin is classified as a flavoring substance, not a food additive, therefore no E-number is assigned.", confidence: 0.98, source: "Product Master Data", editable: true },
    { id: "Q3", question: "Does the substance comply with FEMA GRAS status?", aiAnswer: "Yes. Vanillin has FEMA GRAS number 3107.", confidence: 0.99, source: "FEMA Database", editable: true },
    { id: "Q4", question: "Provide heavy metals content analysis.", aiAnswer: "Lead: < 1.0 ppm, Arsenic: < 0.5 ppm, Cadmium: < 0.1 ppm, Mercury: < 0.1 ppm. All values within EU limits for food contact materials.", confidence: 0.94, source: "Certificate of Analysis (Batch VAN-2026-001)", editable: true },
    { id: "Q5", question: "Is the product suitable for organic food applications?", aiAnswer: "Current grade is synthetic vanillin produced by EuroSynth S.A. Not suitable for organic certified products. Natural vanillin grade available upon request.", confidence: 0.92, source: "Supplier Specification + Internal Records", editable: true },
    { id: "Q6", question: "Provide microbiological data.", aiAnswer: "Total plate count: < 100 CFU/g, Yeast & Mold: < 10 CFU/g, E. coli: Absent/10g, Salmonella: Absent/25g.", confidence: 0.95, source: "Certificate of Analysis", editable: true },
  ],
};

export const flowchartData: Record<string, { nodes: FlowchartNode[]; edges: FlowchartEdge[] }> = {
  MAT001: {
    nodes: [
      { id: "n1", type: "input", label: "Raw Turpentine Oil", processType: "input", position: { x: 250, y: 0 } },
      { id: "n2", type: "process", label: "Fractional Distillation", processType: "distillation", conditions: [{ key: "Temperature", value: "195-200°C" }, { key: "Pressure", value: "1 atm" }, { key: "Duration", value: "4-6 hours" }], position: { x: 250, y: 100 } },
      { id: "n3", type: "process", label: "Alpha-Pinene Isolation", processType: "separation", conditions: [{ key: "Temperature", value: "155-160°C" }, { key: "Purity", value: "> 95%" }], position: { x: 250, y: 200 } },
      { id: "n4", type: "process", label: "Pyrolysis", processType: "reaction", conditions: [{ key: "Temperature", value: "400-500°C" }, { key: "Catalyst", value: "None (thermal)" }, { key: "Duration", value: "2-3 seconds" }], position: { x: 250, y: 300 } },
      { id: "n5", type: "process", label: "Selective Hydrogenation", processType: "reaction", conditions: [{ key: "Temperature", value: "80-100°C" }, { key: "Pressure", value: "5-10 bar H₂" }, { key: "Catalyst", value: "Lindlar catalyst (Pd/CaCO₃)" }], position: { x: 250, y: 400 } },
      { id: "n6", type: "process", label: "Purification Distillation", processType: "distillation", conditions: [{ key: "Temperature", value: "198-200°C" }, { key: "Pressure", value: "Reduced (50 mbar)" }, { key: "Target Purity", value: "> 97%" }], position: { x: 250, y: 500 } },
      { id: "n7", type: "process", label: "Quality Control", processType: "analysis", conditions: [{ key: "Tests", value: "GC, Refractive Index, Optical Rotation" }], position: { x: 250, y: 600 } },
      { id: "n8", type: "output", label: "Linalool (CAS 78-70-6)", processType: "output", position: { x: 250, y: 700 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4" },
      { id: "e4", source: "n4", target: "n5", label: "Myrcene intermediate" },
      { id: "e5", source: "n5", target: "n6" },
      { id: "e6", source: "n6", target: "n7" },
      { id: "e7", source: "n7", target: "n8", label: "Pass" },
    ],
  },
  MAT002: {
    nodes: [
      { id: "n1", type: "input", label: "Fresh Orange Peel", processType: "input", position: { x: 250, y: 0 } },
      { id: "n2", type: "process", label: "Cold Pressing", processType: "extraction", conditions: [{ key: "Temperature", value: "< 40°C" }, { key: "Pressure", value: "200-400 bar" }, { key: "Duration", value: "Continuous" }], position: { x: 250, y: 100 } },
      { id: "n3", type: "process", label: "Centrifugal Separation", processType: "separation", conditions: [{ key: "Speed", value: "8000-12000 rpm" }, { key: "Temperature", value: "20-25°C" }], position: { x: 250, y: 200 } },
      { id: "n4", type: "process", label: "Winterization", processType: "purification", conditions: [{ key: "Temperature", value: "-20°C" }, { key: "Duration", value: "24-48 hours" }], position: { x: 250, y: 300 } },
      { id: "n5", type: "process", label: "Vacuum Distillation", processType: "distillation", conditions: [{ key: "Temperature", value: "175-178°C" }, { key: "Pressure", value: "20-50 mbar" }, { key: "Target", value: "d-Limonene > 95%" }], position: { x: 250, y: 400 } },
      { id: "n6", type: "process", label: "Quality Control & Filtration", processType: "analysis", conditions: [{ key: "Tests", value: "GC, Peroxide value, Optical rotation" }], position: { x: 250, y: 500 } },
      { id: "n7", type: "output", label: "D-Limonene (CAS 5989-27-5)", processType: "output", position: { x: 250, y: 600 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6" },
      { id: "e6", source: "n6", target: "n7", label: "Pass" },
    ],
  },
  MAT004: {
    nodes: [
      { id: "n1", type: "input", label: "Guaiacol + Glyoxylic Acid", processType: "input", position: { x: 250, y: 0 } },
      { id: "n2", type: "process", label: "Condensation Reaction", processType: "reaction", conditions: [{ key: "Temperature", value: "40-50°C" }, { key: "Catalyst", value: "Alkaline (NaOH)" }, { key: "pH", value: "10-12" }], position: { x: 250, y: 100 } },
      { id: "n3", type: "process", label: "Oxidative Decarboxylation", processType: "reaction", conditions: [{ key: "Temperature", value: "80-90°C" }, { key: "Oxidant", value: "Cu²⁺ catalyst / O₂" }, { key: "Duration", value: "3-4 hours" }], position: { x: 250, y: 200 } },
      { id: "n4", type: "process", label: "Acidification & Extraction", processType: "separation", conditions: [{ key: "pH", value: "2-3 (HCl)" }, { key: "Solvent", value: "Toluene" }], position: { x: 250, y: 300 } },
      { id: "n5", type: "process", label: "Vacuum Distillation", processType: "distillation", conditions: [{ key: "Temperature", value: "154-156°C" }, { key: "Pressure", value: "25 mbar" }, { key: "Target Purity", value: "> 99%" }], position: { x: 250, y: 400 } },
      { id: "n6", type: "process", label: "Crystallization", processType: "purification", conditions: [{ key: "Solvent", value: "Water" }, { key: "Temperature", value: "Cooling to 5°C" }], position: { x: 250, y: 500 } },
      { id: "n7", type: "process", label: "Quality Control", processType: "analysis", conditions: [{ key: "Tests", value: "HPLC, Melting point, Color" }], position: { x: 250, y: 600 } },
      { id: "n8", type: "output", label: "Vanillin (CAS 121-33-5)", processType: "output", position: { x: 250, y: 700 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6" },
      { id: "e6", source: "n6", target: "n7" },
      { id: "e7", source: "n7", target: "n8", label: "Pass" },
    ],
  },
};

export const reachSubstances: ReachSubstance[] = [
  {
    id: "RS001", name: "Limonene", cas: "5989-27-5", annualQuota: 100000, consumed: 78500, unit: "kg",
    alertLevel: "warning",
    monthlyData: [
      { month: "Jan", current: 6200, previous: 5800 }, { month: "Feb", current: 6500, previous: 6100 },
      { month: "Mar", current: 7100, previous: 6400 }, { month: "Apr", current: 6800, previous: 6200 },
      { month: "May", current: 7200, previous: 6500 }, { month: "Jun", current: 6900, previous: 6800 },
      { month: "Jul", current: 7500, previous: 6300 }, { month: "Aug", current: 6100, previous: 5900 },
      { month: "Sep", current: 6800, previous: 6600 }, { month: "Oct", current: 7400, previous: 6700 },
      { month: "Nov", current: 5500, previous: 6200 }, { month: "Dec", current: 4000, previous: 5800 },
    ],
  },
  {
    id: "RS002", name: "Linalool", cas: "78-70-6", annualQuota: 50000, consumed: 22300, unit: "kg",
    alertLevel: "normal",
    monthlyData: [
      { month: "Jan", current: 1800, previous: 1600 }, { month: "Feb", current: 2100, previous: 1900 },
      { month: "Mar", current: 1950, previous: 1750 }, { month: "Apr", current: 2200, previous: 2000 },
      { month: "May", current: 2050, previous: 1850 }, { month: "Jun", current: 1900, previous: 1700 },
      { month: "Jul", current: 2300, previous: 2100 }, { month: "Aug", current: 1750, previous: 1600 },
      { month: "Sep", current: 2100, previous: 1900 }, { month: "Oct", current: 2150, previous: 1950 },
      { month: "Nov", current: 1000, previous: 1800 }, { month: "Dec", current: 1000, previous: 1700 },
    ],
  },
  {
    id: "RS003", name: "Citral", cas: "5392-40-5", annualQuota: 25000, consumed: 23800, unit: "kg",
    alertLevel: "critical",
    monthlyData: [
      { month: "Jan", current: 2100, previous: 1800 }, { month: "Feb", current: 2200, previous: 1900 },
      { month: "Mar", current: 2050, previous: 1850 }, { month: "Apr", current: 2300, previous: 2000 },
      { month: "May", current: 2150, previous: 1950 }, { month: "Jun", current: 1950, previous: 1800 },
      { month: "Jul", current: 2100, previous: 1700 }, { month: "Aug", current: 1800, previous: 1600 },
      { month: "Sep", current: 2200, previous: 1900 }, { month: "Oct", current: 2350, previous: 2050 },
      { month: "Nov", current: 1300, previous: 1850 }, { month: "Dec", current: 1300, previous: 1750 },
    ],
  },
  {
    id: "RS004", name: "Eugenol", cas: "97-53-0", annualQuota: 30000, consumed: 14200, unit: "kg",
    alertLevel: "normal",
    monthlyData: [
      { month: "Jan", current: 1200, previous: 1100 }, { month: "Feb", current: 1350, previous: 1200 },
      { month: "Mar", current: 1280, previous: 1150 }, { month: "Apr", current: 1400, previous: 1250 },
      { month: "May", current: 1320, previous: 1200 }, { month: "Jun", current: 1250, previous: 1100 },
      { month: "Jul", current: 1380, previous: 1300 }, { month: "Aug", current: 1150, previous: 1050 },
      { month: "Sep", current: 1300, previous: 1150 }, { month: "Oct", current: 1270, previous: 1200 },
      { month: "Nov", current: 650, previous: 1100 }, { month: "Dec", current: 650, previous: 1050 },
    ],
  },
  {
    id: "RS005", name: "Cinnamaldehyde", cas: "104-55-2", annualQuota: 15000, consumed: 11200, unit: "kg",
    alertLevel: "warning",
    monthlyData: [
      { month: "Jan", current: 950, previous: 850 }, { month: "Feb", current: 1050, previous: 920 },
      { month: "Mar", current: 1000, previous: 880 }, { month: "Apr", current: 1100, previous: 950 },
      { month: "May", current: 1020, previous: 910 }, { month: "Jun", current: 980, previous: 870 },
      { month: "Jul", current: 1080, previous: 960 }, { month: "Aug", current: 900, previous: 820 },
      { month: "Sep", current: 1020, previous: 900 }, { month: "Oct", current: 1100, previous: 940 },
      { month: "Nov", current: 550, previous: 860 }, { month: "Dec", current: 450, previous: 830 },
    ],
  },
  {
    id: "RS006", name: "Geraniol", cas: "106-24-1", annualQuota: 20000, consumed: 8900, unit: "kg",
    alertLevel: "normal",
    monthlyData: [
      { month: "Jan", current: 750, previous: 700 }, { month: "Feb", current: 820, previous: 760 },
      { month: "Mar", current: 790, previous: 730 }, { month: "Apr", current: 860, previous: 790 },
      { month: "May", current: 810, previous: 750 }, { month: "Jun", current: 770, previous: 710 },
      { month: "Jul", current: 850, previous: 780 }, { month: "Aug", current: 720, previous: 670 },
      { month: "Sep", current: 830, previous: 760 }, { month: "Oct", current: 800, previous: 740 },
      { month: "Nov", current: 450, previous: 710 }, { month: "Dec", current: 350, previous: 680 },
    ],
  },
];

export const changeRecords: ChangeRecord[] = [
  {
    id: "CHG001", type: "regulatory",
    title: "IFRA 50th Amendment — Linalool Usage Limits Updated",
    description: "The International Fragrance Association has published the 50th Amendment to the IFRA Standards. Maximum usage levels for Linalool in several product categories have been updated. Fine fragrance limit adjusted from 4.5% to 4.3%.",
    date: "2026-02-15", status: "under_review",
    affectedClients: [
      { name: "Prestige Cosmetics Europe", products: ["Eau de Parfum Collection", "Body Mist Line"], notified: false },
      { name: "NaturaBella S.r.l.", products: ["Organic Skincare Range"], notified: false },
      { name: "Global Scents Corp.", products: ["Fine Fragrance Portfolio", "Home Care Fragrances"], notified: false },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe are writing to inform you of an important regulatory update affecting products in your portfolio.\n\nThe International Fragrance Association (IFRA) has published the 50th Amendment to its Standards, which includes updated maximum usage levels for Linalool (CAS 78-70-6) across several product categories.\n\nKey changes:\n- Fine fragrance category: Maximum concentration adjusted from 4.5% to 4.3%\n- Leave-on cosmetic products: No change in limits\n- Rinse-off products: No change in limits\n\nAffected products in your portfolio:\n[PRODUCT_LIST]\n\nWe recommend reviewing your formulations to ensure compliance with the updated standards. Our technical team is available to assist with any reformulation requirements.\n\nPlease do not hesitate to contact us for further information.\n\nBest regards,\nRegulatory Affairs Department",
  },
  {
    id: "CHG002", type: "specification",
    title: "Limonene — Peroxide Value Specification Tightened",
    description: "Based on stability study results and customer quality requirements, the internal specification for Peroxide Value in D-Limonene has been tightened from < 20 meq/kg to < 10 meq/kg.",
    date: "2026-02-10", status: "notified",
    affectedClients: [
      { name: "CleanPro Industries", products: ["Industrial Degreaser", "Citrus Cleaner Concentrate"], notified: true },
      { name: "FreshHome Products Ltd", products: ["Air Freshener Line"], notified: true },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe would like to inform you of a specification update for D-Limonene (CAS 5989-27-5).\n\nEffective from March 1, 2026, we are tightening our internal specification for Peroxide Value from < 20 meq/kg to < 10 meq/kg. This change reflects our commitment to delivering higher quality standards and improved product stability.\n\nThis specification change may result in improved shelf life and color stability of your finished products. No reformulation is expected to be necessary on your end.\n\nUpdated Certificates of Analysis will reflect the new specification from the effective date.\n\nPlease contact us if you have any questions.\n\nBest regards,\nRegulatory Affairs Department",
  },
  {
    id: "CHG003", type: "supplier",
    title: "ChemNova GmbH — Manufacturing Site Relocation",
    description: "Supplier ChemNova GmbH has notified relocation of Linalool production from Frankfurt to Ludwigshafen facility. New site audit required. No formulation changes reported.",
    date: "2026-02-01", status: "detected",
    affectedClients: [
      { name: "Prestige Cosmetics Europe", products: ["Eau de Parfum Collection"], notified: false },
      { name: "AromaPharm GmbH", products: ["Pharmaceutical Grade Excipients"], notified: false },
      { name: "NaturaBella S.r.l.", products: ["Organic Skincare Range", "Hair Care Line"], notified: false },
      { name: "LuxeBeauty Asia", products: ["Premium Skincare"], notified: false },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe are writing to inform you of a supply chain change affecting Linalool (CAS 78-70-6) supplied by ChemNova GmbH.\n\nOur supplier has notified us of the relocation of their Linalool production facility from Frankfurt to Ludwigshafen, Germany. We want to assure you that:\n\n1. The product specification and quality standards remain unchanged\n2. A comprehensive audit of the new facility has been scheduled\n3. Regulatory documentation will be updated accordingly\n4. No interruption in supply is expected\n\nWe will provide updated documentation including the new manufacturing site details as soon as the audit is completed.\n\nPlease do not hesitate to reach out with any concerns.\n\nBest regards,\nRegulatory Affairs Department",
  },
  {
    id: "CHG004", type: "formulation",
    title: "Vanillin — Alternative Synthesis Route Approved",
    description: "EuroSynth S.A. has validated an alternative synthesis route for Vanillin using bio-based guaiacol from lignin. Product meets same specifications but manufacturing process documentation needs updating.",
    date: "2026-01-20", status: "completed",
    affectedClients: [
      { name: "Global Flavors Inc.", products: ["Vanilla Flavor Compound", "Bakery Flavor Range"], notified: true },
      { name: "SweetTaste Co.", products: ["Confectionery Flavors"], notified: true },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe are pleased to inform you of an update regarding Vanillin (CAS 121-33-5) supplied by EuroSynth S.A.\n\nAn alternative synthesis route has been validated, utilizing bio-based guaiacol derived from lignin. This sustainable manufacturing approach:\n\n- Meets identical product specifications as the current grade\n- Reduces the carbon footprint by approximately 30%\n- Has passed all required quality and regulatory validations\n\nUpdated manufacturing process documentation and flowcharts are available upon request. No changes to your formulations or labeling are required.\n\nBest regards,\nRegulatory Affairs Department",
  },
];

export const kpiData: KPIData = {
  pendingHomologations: 12,
  openQuestionnaires: 8,
  reachAlerts: 3,
  pendingChanges: 5,
};

export const activityFeed: ActivityItem[] = [
  { id: "A1", type: "homologation", title: "Linalool (ChemNova GmbH)", description: "Questionnaire comparison completed — 2 anomalies detected", timestamp: "2026-02-22T09:30:00Z", status: "alert" },
  { id: "A2", type: "questionnaire", title: "Cosmetics questionnaire — Prestige Cosmetics", description: "AI auto-response generated (10 fields, avg. confidence 95.7%)", timestamp: "2026-02-22T08:45:00Z", status: "completed" },
  { id: "A3", type: "change", title: "IFRA 50th Amendment — Linalool", description: "Regulatory change detected, 3 clients potentially affected", timestamp: "2026-02-21T16:20:00Z", status: "alert" },
  { id: "A4", type: "reach", title: "Citral — REACH quota alert", description: "95.2% of annual quota consumed (23,800 / 25,000 kg)", timestamp: "2026-02-21T14:00:00Z", status: "alert" },
  { id: "A5", type: "flowchart", title: "D-Limonene flowchart generated", description: "Consolidated manufacturing flowchart from 2 supplier sources", timestamp: "2026-02-21T11:30:00Z", status: "completed" },
  { id: "A6", type: "homologation", title: "Vanillin (EuroSynth S.A.)", description: "Supplier re-homologation approved — all fields within spec", timestamp: "2026-02-20T15:10:00Z", status: "completed" },
  { id: "A7", type: "questionnaire", title: "Food contact questionnaire — Global Flavors Inc.", description: "AI auto-response generated (6 fields, avg. confidence 95.8%)", timestamp: "2026-02-20T10:00:00Z", status: "completed" },
  { id: "A8", type: "change", title: "ChemNova GmbH — Site relocation", description: "Supplier change detected, 4 clients potentially affected", timestamp: "2026-02-19T09:00:00Z", status: "in_progress" },
];
