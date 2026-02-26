import type {
  Supplier, Material, HomologationComparison, QuestionnaireField,
  FlowchartNode, FlowchartEdge, ReachSubstance, ChangeRecord,
  KPIData, ActivityItem,
} from "./types";

export const suppliers: Supplier[] = [
  { id: "SUP001", name: "BASF SE", country: "Germany", category: "Solvents & Intermediates", status: "approved", lastAudit: "2025-11-15" },
  { id: "SUP002", name: "Evonik Industries AG", country: "Germany", category: "Specialty Additives", status: "approved", lastAudit: "2025-09-22" },
  { id: "SUP003", name: "Dow Chemical Company", country: "USA", category: "Polymers & Resins", status: "approved", lastAudit: "2025-06-10" },
  { id: "SUP004", name: "Solvay S.A.", country: "Belgium", category: "Surfactants & Specialty Chemicals", status: "under_review", lastAudit: "2025-12-01" },
  { id: "SUP005", name: "Wanhua Chemical Group", country: "China", category: "Isocyanates & Polyurethanes", status: "approved", lastAudit: "2026-01-08" },
];

export const materials: Material[] = [
  { id: "MAT001", name: "Toluene", cas: "108-88-3", category: "Solvent", supplierId: "SUP001", supplierName: "BASF SE", status: "active" },
  { id: "MAT002", name: "Butyl Acetate", cas: "123-86-4", category: "Solvent", supplierId: "SUP001", supplierName: "BASF SE", status: "active" },
  { id: "MAT003", name: "Titanium Dioxide", cas: "13463-67-7", category: "Pigment", supplierId: "SUP002", supplierName: "Evonik Industries AG", status: "active" },
  { id: "MAT004", name: "Epoxy Resin (DGEBA)", cas: "25068-38-6", category: "Resin", supplierId: "SUP003", supplierName: "Dow Chemical Company", status: "active" },
  { id: "MAT005", name: "SLES (Sodium Laureth Sulfate)", cas: "9004-82-4", category: "Surfactant", supplierId: "SUP004", supplierName: "Solvay S.A.", status: "under_review" },
  { id: "MAT006", name: "MDI (Methylene Diphenyl Diisocyanate)", cas: "101-68-8", category: "Isocyanate", supplierId: "SUP005", supplierName: "Wanhua Chemical Group", status: "active" },
  { id: "MAT007", name: "DOP (Dioctyl Phthalate)", cas: "117-81-7", category: "Plasticizer", supplierId: "SUP002", supplierName: "Evonik Industries AG", status: "pending" },
  { id: "MAT008", name: "Ethylene Glycol", cas: "107-21-1", category: "Glycol", supplierId: "SUP001", supplierName: "BASF SE", status: "active" },
];

export const homologationComparisons: Record<string, HomologationComparison[]> = {
  MAT001: [
    { field: "Purity (%)", category: "Quality", previousValue: "99.8", currentValue: "99.6", status: "changed", expectedRange: "99.5–99.9", riskLevel: "low" },
    { field: "Refractive Index (20°C)", category: "Physical", previousValue: "1.4969", currentValue: "1.4970", status: "unchanged", expectedRange: "1.4960–1.4980" },
    { field: "Density (20°C, g/mL)", category: "Physical", previousValue: "0.866", currentValue: "0.867", status: "unchanged", expectedRange: "0.864–0.870" },
    { field: "Moisture Content (ppm)", category: "Quality", previousValue: "< 100", currentValue: "< 100", status: "unchanged", expectedRange: "< 200" },
    { field: "Benzene Content (ppm)", category: "Safety", previousValue: "< 0.5", currentValue: "2.1", status: "out_of_spec", expectedRange: "< 1.0", riskLevel: "high" },
    { field: "CLP Classification", category: "Regulatory", previousValue: "Flam. Liq. 2, Repr. 2", currentValue: "Flam. Liq. 2, Repr. 2", status: "unchanged" },
    { field: "REACH Registration", category: "Regulatory", previousValue: "Registered (>1000 t/y)", currentValue: "Registered (>1000 t/y)", status: "unchanged" },
    { field: "Manufacturing Site", category: "Supply Chain", previousValue: "Ludwigshafen, Germany", currentValue: "Antwerp, Belgium", status: "changed", riskLevel: "medium" },
    { field: "Flash Point (°C)", category: "Safety", previousValue: "4", currentValue: "4", status: "unchanged", expectedRange: "4–6" },
    { field: "VOC Classification", category: "Regulatory", previousValue: "VOC (EU 2004/42/CE)", currentValue: "VOC (EU 2004/42/CE)", status: "unchanged" },
    { field: "Sulfur Content (ppm)", category: "Quality", previousValue: "< 1", currentValue: "< 1", status: "unchanged", expectedRange: "< 5" },
    { field: "Color (Pt-Co)", category: "Quality", previousValue: "5", currentValue: "10", status: "changed", expectedRange: "≤ 15", riskLevel: "low" },
    { field: "ISO 9001 Certificate", category: "Certification", previousValue: "Valid until 12/2025", currentValue: "", status: "missing", riskLevel: "high" },
    { field: "ISCC Plus Certificate", category: "Certification", previousValue: "Not available", currentValue: "Valid until 06/2027", status: "changed", riskLevel: "low" },
    { field: "Carbon Footprint (kg CO₂e/kg)", category: "ESG", previousValue: "0.82", currentValue: "0.76", status: "changed", riskLevel: "low" },
    { field: "Packaging", category: "Supply Chain", previousValue: "IBC 1000L", currentValue: "IBC 1000L", status: "unchanged" },
  ],
  MAT004: [
    { field: "Epoxide Equivalent Weight (g/eq)", category: "Quality", previousValue: "186", currentValue: "192", status: "changed", expectedRange: "182–192", riskLevel: "low" },
    { field: "Viscosity (25°C, mPa·s)", category: "Physical", previousValue: "11500", currentValue: "14200", status: "out_of_spec", expectedRange: "11000–13000", riskLevel: "high" },
    { field: "Color (Gardner)", category: "Quality", previousValue: "1", currentValue: "2", status: "changed", expectedRange: "≤ 3", riskLevel: "low" },
    { field: "Total Chlorine (ppm)", category: "Quality", previousValue: "800", currentValue: "850", status: "unchanged", expectedRange: "≤ 1200" },
    { field: "BPA Free Certification", category: "Regulatory", previousValue: "No", currentValue: "No", status: "unchanged" },
    { field: "CLP Classification", category: "Regulatory", previousValue: "Skin Sens. 1, Eye Irrit. 2", currentValue: "Skin Sens. 1, Eye Irrit. 2", status: "unchanged" },
    { field: "REACH SVHC (BPA Content)", category: "Regulatory", previousValue: "Contains BPA (SVHC)", currentValue: "Contains BPA (SVHC)", status: "unchanged" },
    { field: "Moisture (%)", category: "Quality", previousValue: "0.03", currentValue: "0.05", status: "changed", expectedRange: "≤ 0.1", riskLevel: "low" },
    { field: "Shelf Life (months)", category: "Quality", previousValue: "24", currentValue: "24", status: "unchanged", expectedRange: "≥ 18" },
    { field: "Manufacturing Site", category: "Supply Chain", previousValue: "Midland, Michigan", currentValue: "Midland, Michigan", status: "unchanged" },
  ],
};

export const questionnaireTemplates = [
  { id: "TPL001", name: "REACH Compliance Questionnaire", fields: 22 },
  { id: "TPL002", name: "Food Contact Materials Declaration", fields: 16 },
  { id: "TPL003", name: "Cosmetics Raw Material Assessment", fields: 28 },
];

export const questionnaireResponses: Record<string, QuestionnaireField[]> = {
  "TPL001-MAT001": [
    { id: "Q1", question: "Is the substance registered under REACH?", aiAnswer: "Yes. Toluene (CAS 108-88-3) is registered under REACH at the >1,000,000 tonnes/year tonnage band. Lead registrant: BASF SE (Registration No: 01-2119471310-51).", confidence: 0.99, source: "ECHA Database + Internal Registry", editable: true },
    { id: "Q2", question: "Is the substance on the SVHC Candidate List?", aiAnswer: "No. Toluene is not currently listed on the SVHC Candidate List. However, it is classified as Repr. 2 under CLP.", confidence: 0.98, source: "ECHA Candidate List (Feb 2026)", editable: true },
    { id: "Q3", question: "Provide the CLP classification and labelling.", aiAnswer: "Flam. Liq. 2 (H225), Repr. 2 (H361d), STOT RE 2 (H373), Asp. Tox. 1 (H304). Pictograms: GHS02, GHS07, GHS08. Signal word: Danger.", confidence: 0.99, source: "C&L Inventory", editable: true },
    { id: "Q4", question: "Are there any Annex XVII restrictions?", aiAnswer: "Yes. Entry 48: Shall not be placed on the market or used as a substance or in mixtures in concentrations ≥ 0.1% by mass in adhesives or spray paints intended for sale to the general public.", confidence: 0.97, source: "REACH Annex XVII", editable: true },
    { id: "Q5", question: "Provide the Derived No-Effect Levels (DNELs).", aiAnswer: "Workers, inhalation (long-term systemic): 192 mg/m³. Workers, dermal (long-term systemic): 384 mg/kg bw/day. General population, inhalation (long-term): 56.5 mg/m³.", confidence: 0.94, source: "ECHA DNEL Data", editable: true },
    { id: "Q6", question: "Is a Safety Data Sheet available in the required languages?", aiAnswer: "Yes. SDS available in EN, ES, FR, IT, PT, DE, EL, TR conforming to Regulation (EC) 2020/878 (Annex II format). Last revision: January 2026.", confidence: 0.96, source: "SDS Repository", editable: true },
    { id: "Q7", question: "Does the substance require authorization (Annex XIV)?", aiAnswer: "No. Toluene is not listed on REACH Annex XIV (Authorization List).", confidence: 0.99, source: "REACH Annex XIV", editable: true },
    { id: "Q8", question: "Provide VOC classification details.", aiAnswer: "Classified as a VOC under EU Directive 2004/42/CE (Paints Directive). Included in VOC emission calculations for industrial coatings. Vapour pressure at 20°C: 2.9 kPa.", confidence: 0.95, source: "EU Paints Directive + Product Data", editable: true },
    { id: "Q9", question: "Is there an Occupational Exposure Limit (OEL)?", aiAnswer: "Yes. EU IOELV: 50 ppm (192 mg/m³) TWA 8h, 100 ppm (384 mg/m³) STEL 15min. (Directive 2006/15/EC). National OELs may vary.", confidence: 0.96, source: "EU OEL Directive", editable: true },
    { id: "Q10", question: "Provide environmental hazard classification.", aiAnswer: "Not classified as hazardous to the aquatic environment under CLP. However, classified under the Water Framework Directive as a priority substance. LC50 fish: 5.8 mg/L (96h). Readily biodegradable.", confidence: 0.93, source: "ECHA Environmental Data + WFD", editable: true },
  ],
  "TPL002-MAT004": [
    { id: "Q1", question: "Is the substance authorized for food contact applications?", aiAnswer: "Epoxy Resin (DGEBA, CAS 25068-38-6) can be used in food contact materials subject to EU Regulation (EC) No 1935/2004. Listed in Regulation (EU) No 10/2011 (plastics) with a Specific Migration Limit for BPA of 0.05 mg/kg food.", confidence: 0.95, source: "EU Food Contact Regulation DB", editable: true },
    { id: "Q2", question: "Provide BPA (Bisphenol A) migration data.", aiAnswer: "BPA migration from cured epoxy: < 0.01 mg/kg (well below SML of 0.05 mg/kg). Note: BPA is banned in infant food contact materials. SML expected to be lowered to 0.04 mg/kg in upcoming amendment.", confidence: 0.93, source: "Migration Test Reports + Regulatory Monitoring", editable: true },
    { id: "Q3", question: "Does the product comply with FDA 21 CFR?", aiAnswer: "Yes. Compliant with FDA 21 CFR 175.300 (Resinous and polymeric coatings). Extraction limits met for water, 8% ethanol, and heptane food simulants.", confidence: 0.91, source: "Supplier FDA Compliance Declaration", editable: true },
    { id: "Q4", question: "Provide overall migration test results.", aiAnswer: "Overall migration: < 3.5 mg/dm² (limit: 10 mg/dm²). Tested per EU 10/2011, Annex V. Simulants: 3% acetic acid (2h at 70°C), 10% ethanol (2h at 70°C), olive oil (2h at 70°C).", confidence: 0.94, source: "Certificate of Analysis — Migration Tests", editable: true },
    { id: "Q5", question: "Is the substance suitable for high-temperature food contact?", aiAnswer: "Cured epoxy coatings are suitable for repeated use up to 121°C (sterilization conditions). For single-use above 121°C, dedicated testing required per Regulation (EU) 10/2011.", confidence: 0.89, source: "Supplier Technical Data + Regulation", editable: true },
    { id: "Q6", question: "Are there any SVHC concerns for food contact?", aiAnswer: "BPA (CAS 80-05-7) is listed as SVHC (Repr. 1B). Present as residual monomer in DGEBA resin. Article 33 communication obligation applies if BPA concentration > 0.1% w/w in articles. Alternative BPA-free grades (DGEF) available from Dow.", confidence: 0.96, source: "ECHA SVHC List + Internal Product Database", editable: true },
  ],
  "TPL003-MAT005": [
    { id: "Q1", question: "Is the substance compliant with EU Cosmetics Regulation (EC) No 1223/2009?", aiAnswer: "Yes. SLES (CAS 9004-82-4) is permitted in cosmetics products. Not listed in Annexes II-VI. Widely used as a cleansing agent in shampoos, body washes, and facial cleansers.", confidence: 0.98, source: "EU Cosmetics Regulation DB", editable: true },
    { id: "Q2", question: "Provide INCI name and function.", aiAnswer: "INCI: SODIUM LAURETH SULFATE. Function: Surfactant — Cleansing agent, foaming agent. CosIng reference number: 37040.", confidence: 0.99, source: "CosIng Database", editable: true },
    { id: "Q3", question: "What is the 1,4-Dioxane residual content?", aiAnswer: "Current batch: < 5 ppm (limit for cosmetics grade: < 10 ppm recommended, though no statutory limit in EU). Solvay achieves low residuals via vacuum stripping. FDA monitoring threshold: 10 ppm.", confidence: 0.94, source: "Certificate of Analysis + Internal Quality Records", editable: true },
    { id: "Q4", question: "Is the product palm oil derived? RSPO status?", aiAnswer: "Current grade uses lauryl alcohol from palm kernel oil. RSPO Mass Balance certified (Certificate No: RSPO-2024-4567). Segregated grade available at premium.", confidence: 0.92, source: "Supplier Sustainability Declaration", editable: true },
    { id: "Q5", question: "Provide microbiological specification.", aiAnswer: "Total plate count: < 100 CFU/g. Yeast & Mold: < 10 CFU/g. Pseudomonas aeruginosa: Absent/g. Staphylococcus aureus: Absent/g. Candida albicans: Absent/g. Compliant with ISO 17516:2014.", confidence: 0.96, source: "Quality Specification Sheet", editable: true },
    { id: "Q6", question: "Has the product been tested on animals?", aiAnswer: "No. Solvay confirms compliance with the EU cosmetics animal testing ban. No animal testing performed for this ingredient or its raw materials for cosmetic purposes after the regulatory cut-off date.", confidence: 0.97, source: "Supplier Animal Testing Declaration", editable: true },
  ],
};

export const flowchartData: Record<string, { nodes: FlowchartNode[]; edges: FlowchartEdge[] }> = {
  MAT001: {
    nodes: [
      { id: "n1", type: "input", label: "Naphtha / Reformate Feed", processType: "input", position: { x: 250, y: 0 } },
      { id: "n2", type: "process", label: "Catalytic Reforming", processType: "reaction", conditions: [{ key: "Temperature", value: "480-530°C" }, { key: "Pressure", value: "15-35 bar" }, { key: "Catalyst", value: "Pt/Re on Al₂O₃" }], position: { x: 250, y: 100 } },
      { id: "n3", type: "process", label: "BTX Extraction", processType: "extraction", conditions: [{ key: "Solvent", value: "Sulfolane / NMP" }, { key: "Temperature", value: "80-120°C" }], position: { x: 250, y: 200 } },
      { id: "n4", type: "process", label: "Extractive Distillation", processType: "distillation", conditions: [{ key: "Temperature", value: "110°C (top)" }, { key: "Pressure", value: "1 atm" }, { key: "Reflux Ratio", value: "4:1" }], position: { x: 250, y: 300 } },
      { id: "n5", type: "process", label: "Benzene Removal Column", processType: "separation", conditions: [{ key: "Target", value: "Benzene < 1 ppm" }, { key: "Temperature", value: "80-110°C" }], position: { x: 250, y: 400 } },
      { id: "n6", type: "process", label: "Clay Treatment & Drying", processType: "purification", conditions: [{ key: "Adsorbent", value: "Activated clay" }, { key: "Moisture Target", value: "< 100 ppm" }], position: { x: 250, y: 500 } },
      { id: "n7", type: "process", label: "Quality Control", processType: "analysis", conditions: [{ key: "Tests", value: "GC purity, Pt-Co color, moisture, benzene" }], position: { x: 250, y: 600 } },
      { id: "n8", type: "output", label: "Toluene (CAS 108-88-3)", processType: "output", position: { x: 250, y: 700 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3", label: "Reformate stream" },
      { id: "e3", source: "n3", target: "n4" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6" },
      { id: "e6", source: "n6", target: "n7" },
      { id: "e7", source: "n7", target: "n8", label: "Pass" },
    ],
  },
  MAT004: {
    nodes: [
      { id: "n1", type: "input", label: "Bisphenol A + Epichlorohydrin", processType: "input", position: { x: 250, y: 0 } },
      { id: "n2", type: "process", label: "Condensation Reaction", processType: "reaction", conditions: [{ key: "Temperature", value: "60-70°C" }, { key: "Catalyst", value: "NaOH (40% aq.)" }, { key: "Duration", value: "4-6 hours" }], position: { x: 250, y: 100 } },
      { id: "n3", type: "process", label: "Dehydrochlorination", processType: "reaction", conditions: [{ key: "Temperature", value: "70-80°C" }, { key: "Base", value: "NaOH excess" }, { key: "Duration", value: "1-2 hours" }], position: { x: 250, y: 200 } },
      { id: "n4", type: "process", label: "Brine Washing", processType: "separation", conditions: [{ key: "Washes", value: "3× hot water" }, { key: "Target", value: "NaCl removal" }], position: { x: 250, y: 300 } },
      { id: "n5", type: "process", label: "Vacuum Stripping", processType: "distillation", conditions: [{ key: "Temperature", value: "150-160°C" }, { key: "Pressure", value: "10-20 mbar" }, { key: "Target", value: "Residual ECH < 5 ppm" }], position: { x: 250, y: 400 } },
      { id: "n6", type: "process", label: "Filtration & Blending", processType: "purification", conditions: [{ key: "Filter", value: "5 µm cartridge" }, { key: "EEW Adjustment", value: "182-192 g/eq" }], position: { x: 250, y: 500 } },
      { id: "n7", type: "process", label: "Quality Control", processType: "analysis", conditions: [{ key: "Tests", value: "EEW, viscosity, color, total Cl, moisture" }], position: { x: 250, y: 600 } },
      { id: "n8", type: "output", label: "Epoxy Resin DGEBA (CAS 25068-38-6)", processType: "output", position: { x: 250, y: 700 } },
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
  MAT003: {
    nodes: [
      { id: "n1", type: "input", label: "Ilmenite Ore (FeTiO₃)", processType: "input", position: { x: 250, y: 0 } },
      { id: "n2", type: "process", label: "Chlorination", processType: "reaction", conditions: [{ key: "Temperature", value: "900-1000°C" }, { key: "Reagent", value: "Cl₂ + Coke" }, { key: "Product", value: "TiCl₄ (crude)" }], position: { x: 250, y: 100 } },
      { id: "n3", type: "process", label: "Purification / Distillation", processType: "distillation", conditions: [{ key: "Temperature", value: "136°C (bp TiCl₄)" }, { key: "Target", value: "Remove FeCl₃, VOCl₃" }], position: { x: 250, y: 200 } },
      { id: "n4", type: "process", label: "Vapor Phase Oxidation", processType: "reaction", conditions: [{ key: "Temperature", value: "1200-1700°C" }, { key: "Oxidant", value: "O₂" }, { key: "Seed", value: "AlCl₃ for rutile" }], position: { x: 250, y: 300 } },
      { id: "n5", type: "process", label: "Cooling & Collection", processType: "separation", conditions: [{ key: "Method", value: "Flue gas cooling" }, { key: "Particle Size", value: "0.2-0.3 µm" }], position: { x: 250, y: 400 } },
      { id: "n6", type: "process", label: "Surface Treatment & Milling", processType: "purification", conditions: [{ key: "Coating", value: "Al₂O₃ / SiO₂" }, { key: "Mill", value: "Jet mill to target PSD" }], position: { x: 250, y: 500 } },
      { id: "n7", type: "process", label: "Quality Control", processType: "analysis", conditions: [{ key: "Tests", value: "TiO₂ content, PSD, tinting strength, oil absorption" }], position: { x: 250, y: 600 } },
      { id: "n8", type: "output", label: "Titanium Dioxide (CAS 13463-67-7)", processType: "output", position: { x: 250, y: 700 } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3", label: "Crude TiCl₄" },
      { id: "e3", source: "n3", target: "n4", label: "Pure TiCl₄" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6" },
      { id: "e6", source: "n6", target: "n7" },
      { id: "e7", source: "n7", target: "n8", label: "Pass" },
    ],
  },
};

export const reachSubstances: ReachSubstance[] = [
  {
    id: "RS001", name: "Toluene", cas: "108-88-3", annualQuota: 1000000, consumed: 780000, unit: "kg",
    alertLevel: "warning",
    monthlyData: [
      { month: "Jan", current: 62000, previous: 58000 }, { month: "Feb", current: 65000, previous: 61000 },
      { month: "Mar", current: 71000, previous: 64000 }, { month: "Apr", current: 68000, previous: 62000 },
      { month: "May", current: 72000, previous: 65000 }, { month: "Jun", current: 69000, previous: 68000 },
      { month: "Jul", current: 75000, previous: 63000 }, { month: "Aug", current: 61000, previous: 59000 },
      { month: "Sep", current: 68000, previous: 66000 }, { month: "Oct", current: 74000, previous: 67000 },
      { month: "Nov", current: 55000, previous: 62000 }, { month: "Dec", current: 40000, previous: 58000 },
    ],
  },
  {
    id: "RS002", name: "Butyl Acetate", cas: "123-86-4", annualQuota: 200000, consumed: 45000, unit: "kg",
    alertLevel: "normal",
    monthlyData: [
      { month: "Jan", current: 3800, previous: 3600 }, { month: "Feb", current: 4100, previous: 3900 },
      { month: "Mar", current: 3950, previous: 3750 }, { month: "Apr", current: 4200, previous: 4000 },
      { month: "May", current: 4050, previous: 3850 }, { month: "Jun", current: 3900, previous: 3700 },
      { month: "Jul", current: 4300, previous: 4100 }, { month: "Aug", current: 3750, previous: 3600 },
      { month: "Sep", current: 4100, previous: 3900 }, { month: "Oct", current: 4150, previous: 3950 },
      { month: "Nov", current: 2350, previous: 3800 }, { month: "Dec", current: 2350, previous: 3700 },
    ],
  },
  {
    id: "RS003", name: "Titanium Dioxide", cas: "13463-67-7", annualQuota: 600000, consumed: 580000, unit: "kg",
    alertLevel: "critical",
    monthlyData: [
      { month: "Jan", current: 52000, previous: 45000 }, { month: "Feb", current: 54000, previous: 47000 },
      { month: "Mar", current: 51000, previous: 46000 }, { month: "Apr", current: 55000, previous: 48000 },
      { month: "May", current: 53000, previous: 47000 }, { month: "Jun", current: 50000, previous: 45000 },
      { month: "Jul", current: 56000, previous: 49000 }, { month: "Aug", current: 48000, previous: 44000 },
      { month: "Sep", current: 54000, previous: 47000 }, { month: "Oct", current: 57000, previous: 50000 },
      { month: "Nov", current: 25000, previous: 46000 }, { month: "Dec", current: 25000, previous: 44000 },
    ],
  },
  {
    id: "RS004", name: "MDI", cas: "101-68-8", annualQuota: 500000, consumed: 120000, unit: "kg",
    alertLevel: "normal",
    monthlyData: [
      { month: "Jan", current: 10000, previous: 9500 }, { month: "Feb", current: 11000, previous: 10200 },
      { month: "Mar", current: 10500, previous: 9800 }, { month: "Apr", current: 11500, previous: 10500 },
      { month: "May", current: 10800, previous: 10000 }, { month: "Jun", current: 10200, previous: 9600 },
      { month: "Jul", current: 11200, previous: 10800 }, { month: "Aug", current: 9800, previous: 9200 },
      { month: "Sep", current: 10600, previous: 10000 }, { month: "Oct", current: 10400, previous: 9800 },
      { month: "Nov", current: 7000, previous: 9500 }, { month: "Dec", current: 7000, previous: 9200 },
    ],
  },
  {
    id: "RS005", name: "Ethylene Glycol", cas: "107-21-1", annualQuota: 800000, consumed: 340000, unit: "kg",
    alertLevel: "normal",
    monthlyData: [
      { month: "Jan", current: 28000, previous: 26000 }, { month: "Feb", current: 30000, previous: 28000 },
      { month: "Mar", current: 29000, previous: 27000 }, { month: "Apr", current: 31000, previous: 29000 },
      { month: "May", current: 30000, previous: 28000 }, { month: "Jun", current: 28500, previous: 27000 },
      { month: "Jul", current: 31500, previous: 29500 }, { month: "Aug", current: 27000, previous: 25500 },
      { month: "Sep", current: 30000, previous: 28000 }, { month: "Oct", current: 29000, previous: 27500 },
      { month: "Nov", current: 13000, previous: 26000 }, { month: "Dec", current: 13000, previous: 25500 },
    ],
  },
  {
    id: "RS006", name: "DOP (DEHP)", cas: "117-81-7", annualQuota: 150000, consumed: 112000, unit: "kg",
    alertLevel: "warning",
    monthlyData: [
      { month: "Jan", current: 9500, previous: 8500 }, { month: "Feb", current: 10200, previous: 9200 },
      { month: "Mar", current: 9800, previous: 8800 }, { month: "Apr", current: 10500, previous: 9500 },
      { month: "May", current: 10000, previous: 9000 }, { month: "Jun", current: 9600, previous: 8700 },
      { month: "Jul", current: 10300, previous: 9600 }, { month: "Aug", current: 9200, previous: 8400 },
      { month: "Sep", current: 10100, previous: 9200 }, { month: "Oct", current: 10800, previous: 9400 },
      { month: "Nov", current: 6000, previous: 8600 }, { month: "Dec", current: 6000, previous: 8300 },
    ],
  },
];

export const changeRecords: ChangeRecord[] = [
  {
    id: "CHG001", type: "regulatory",
    title: "Titanium Dioxide — Proposed Consumer Restriction Extension",
    description: "The European Commission is evaluating extending the restriction on TiO2 in powder mixtures and spray products for consumers. This could impact paints, coatings, and construction materials containing TiO2 in powder form above 1% concentration.",
    date: "2026-02-15", status: "under_review",
    affectedClients: [
      { name: "Pinturas Mediterráneo S.L.", products: ["Decorative Paints Range", "Industrial Primer Line"], notified: false },
      { name: "CoatingTech Europe GmbH", products: ["Powder Coatings", "Marine Coatings"], notified: false },
      { name: "Construcciones Ibéricas S.A.", products: ["White Cement Admixtures", "Self-leveling Compounds"], notified: false },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe are writing to inform you of an important regulatory development affecting Titanium Dioxide (CAS 13463-67-7) in your product portfolio.\n\nThe European Commission is evaluating an extension of the restriction on TiO2 in consumer products. Key points:\n\n1. TiO2 classified as Carc. 2 by inhalation (powder form ≥1% particles ≤10 µm)\n2. Proposed restriction: limitations on TiO2 in spray products and powder mixtures for consumers\n3. Timeline: ECHA opinion expected Q3 2026\n\nAffected products in your portfolio:\n[PRODUCT_LIST]\n\nWe recommend reviewing formulations containing TiO2 and considering liquid dispersion alternatives where feasible.\n\nPlease contact our Regulatory Affairs team for guidance.\n\nBest regards,\nRegulatory Affairs Department\nQuimidroga S.A.",
  },
  {
    id: "CHG002", type: "specification",
    title: "Toluene — Benzene Impurity Specification Tightened",
    description: "Following customer quality requirements and occupational health guidelines, the internal specification for benzene content in Toluene has been tightened from < 1.0 ppm to < 0.5 ppm, effective from new BASF supply contract.",
    date: "2026-02-10", status: "notified",
    affectedClients: [
      { name: "Lacasa Coatings S.A.", products: ["Automotive Basecoat", "Industrial Lacquer"], notified: true },
      { name: "Adhesivos Técnicos Ibérica", products: ["Contact Adhesive Range"], notified: true },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe would like to inform you of a specification update for Toluene (CAS 108-88-3).\n\nEffective from March 1, 2026, we are tightening our internal specification for benzene content from < 1.0 ppm to < 0.5 ppm. This change reflects our commitment to higher quality standards and improved workplace safety.\n\nBenefits: Lower benzene exposure risk for your operators, improved compliance with occupational health regulations.\n\nUpdated Certificates of Analysis will reflect the new specification from the effective date. No price impact.\n\nPlease contact us if you have any questions.\n\nBest regards,\nRegulatory Affairs Department\nQuimidroga S.A.",
  },
  {
    id: "CHG003", type: "supplier",
    title: "BASF SE — Toluene Production Site Change (Ludwigshafen → Antwerp)",
    description: "Supplier BASF SE has notified transfer of Toluene production from Ludwigshafen to Antwerp facility. New site audit required. No specification changes reported by supplier.",
    date: "2026-02-01", status: "detected",
    affectedClients: [
      { name: "Lacasa Coatings S.A.", products: ["Automotive Basecoat"], notified: false },
      { name: "Pinturas Mediterráneo S.L.", products: ["Decorative Paints Range"], notified: false },
      { name: "Adhesivos Técnicos Ibérica", products: ["Contact Adhesive Range", "PU Adhesive Line"], notified: false },
      { name: "Industrias Químicas del Sur", products: ["Thinners & Reducers"], notified: false },
    ],
    aiDraftEmail: "Dear valued partner,\n\nWe are writing to inform you of a supply chain change affecting Toluene (CAS 108-88-3) supplied by BASF SE.\n\nOur supplier has notified us of the transfer of Toluene production from their Ludwigshafen facility to their Antwerp, Belgium site. We want to assure you that:\n\n1. Product specification and quality standards remain unchanged\n2. A comprehensive audit of the Antwerp facility has been scheduled for Q1 2026\n3. Regulatory documentation including SDS will be updated with new manufacturing site\n4. No interruption in supply is expected\n\nWe will provide updated documentation as soon as the site audit is completed.\n\nPlease do not hesitate to reach out with any concerns.\n\nBest regards,\nRegulatory Affairs Department\nQuimidroga S.A.",
  },
  {
    id: "CHG004", type: "formulation",
    title: "DOP (DEHP) — SVHC Authorization Deadline Reminder",
    description: "DEHP (DOP, CAS 117-81-7) is on the REACH Authorization List. Downstream users relying on BASF's authorization must ensure continued compliance. Transition to non-SVHC alternatives (DOTP, DINP) recommended.",
    date: "2026-01-20", status: "completed",
    affectedClients: [
      { name: "PlastiSur S.L.", products: ["Flexible PVC Compounds", "Cable Sheathing"], notified: true },
      { name: "Ibérica de Plásticos", products: ["PVC Film", "Flooring Compounds"], notified: true },
    ],
    aiDraftEmail: "Dear valued partner,\n\nThis is a reminder regarding DEHP (DOP, CAS 117-81-7) — a substance on the REACH Authorization List (Annex XIV).\n\nKey points:\n- DEHP requires authorization for use in the EU\n- Current authorization decisions cover specific uses only\n- Transition to non-SVHC alternatives is strongly recommended\n\nAvailable alternatives from our portfolio:\n- DOTP (CAS 6422-86-2) — Evonik Industries, drop-in replacement\n- DINP (CAS 68515-48-0) — BASF SE, suitable for most PVC applications\n\nOur technical team can support you with reformulation trials and compatibility testing.\n\nBest regards,\nRegulatory Affairs Department\nQuimidroga S.A.",
  },
];

export const kpiData: KPIData = {
  pendingHomologations: 14,
  openQuestionnaires: 9,
  reachAlerts: 4,
  pendingChanges: 6,
};

export const activityFeed: ActivityItem[] = [
  { id: "A1", type: "homologation", title: "Toluene (BASF SE)", description: "Questionnaire comparison completed — 2 anomalies detected (benzene content, missing ISO cert)", timestamp: "2026-02-22T09:30:00Z", status: "alert" },
  { id: "A2", type: "questionnaire", title: "REACH questionnaire — Lacasa Coatings", description: "AI auto-response generated (10 fields, avg. confidence 96.2%)", timestamp: "2026-02-22T08:45:00Z", status: "completed" },
  { id: "A3", type: "change", title: "TiO2 — Proposed restriction extension", description: "Regulatory change detected, 3 clients potentially affected", timestamp: "2026-02-21T16:20:00Z", status: "alert" },
  { id: "A4", type: "reach", title: "TiO2 — REACH quota alert", description: "96.7% of annual quota consumed (580,000 / 600,000 kg)", timestamp: "2026-02-21T14:00:00Z", status: "alert" },
  { id: "A5", type: "flowchart", title: "Epoxy Resin DGEBA flowchart generated", description: "Consolidated manufacturing flowchart from Dow Chemical documentation", timestamp: "2026-02-21T11:30:00Z", status: "completed" },
  { id: "A6", type: "homologation", title: "Epoxy Resin (Dow Chemical)", description: "Supplier re-homologation — viscosity out of spec flagged", timestamp: "2026-02-20T15:10:00Z", status: "alert" },
  { id: "A7", type: "questionnaire", title: "Food contact questionnaire — PlastiSur S.L.", description: "AI auto-response generated (6 fields, avg. confidence 93.5%)", timestamp: "2026-02-20T10:00:00Z", status: "completed" },
  { id: "A8", type: "change", title: "BASF SE — Toluene site relocation", description: "Supplier change detected, 4 clients potentially affected", timestamp: "2026-02-19T09:00:00Z", status: "in_progress" },
];
