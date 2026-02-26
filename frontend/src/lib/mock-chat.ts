export interface ToolCall {
  tool: string;
  label: string;
  duration: number;
  result?: string;
}

export interface AgenticResponse {
  steps: ToolCall[];
  text: string;
  sources?: string[];
  navigateTo?: string;
}

interface PatternRule {
  patterns: RegExp[];
  response: AgenticResponse;
}

const rules: PatternRule[] = [
  {
    patterns: [/reach.*(toluene|tolueno)/i, /tolu.*(reach|status|registro)/i],
    response: {
      steps: [
        { tool: "search_echa_database", label: "Querying ECHA registration database...", duration: 600, result: "Found: Toluene (108-88-3), registered >1000 t/y" },
        { tool: "query_internal_registry", label: "Checking internal REACH registry...", duration: 400, result: "No SVHC flag, Annex XVII Entry 48 applies" },
        { tool: "check_restrictions", label: "Verifying restriction status...", duration: 300 },
      ],
      text: "**Toluene (CAS 108-88-3) — REACH Status**\n\nRegistered under REACH at the >1,000,000 tonnes/year band. Lead registrant: BASF SE.\n\n- SVHC status: Not on the Candidate List\n- Authorization: Not required\n- Restriction: Annex XVII Entry 48 — restricted in adhesives and spray paints for sale to the general public (concentration ≥ 0.1%)\n- CLP Classification: Flam. Liq. 2, Repr. 2, STOT RE 2, Asp. Tox. 1\n\nLast ECHA dossier update: November 2025.",
      sources: ["ECHA Database", "Internal REACH Registry"],
    },
  },
  {
    patterns: [/reach.*(butyl acetate|acetato de butilo)/i, /butyl acetate.*(reach|status)/i],
    response: {
      steps: [
        { tool: "search_echa_database", label: "Querying ECHA registration database...", duration: 500, result: "Butyl Acetate (123-86-4), 100k–1M t/y" },
        { tool: "check_restrictions", label: "Checking Annex XVII restrictions...", duration: 300 },
      ],
      text: "**Butyl Acetate (CAS 123-86-4) — REACH Status**\n\nRegistered under REACH at the 100,000–1,000,000 tonnes/year band.\n\n- SVHC status: Not on the Candidate List\n- Authorization: Not required\n- No specific restrictions under Annex XVII\n- CLP Classification: Flam. Liq. 3, STOT SE 3\n\nWidely used as a solvent in paints, coatings, and lacquers. No regulatory concerns anticipated.",
      sources: ["ECHA Database", "Product Master Data"],
    },
  },
  {
    patterns: [/reach.*(tio2|titanium|dióxido de titanio)/i, /titanium.*(reach|status|svhc)/i, /tio2/i],
    response: {
      steps: [
        { tool: "search_echa_database", label: "Querying ECHA registration database...", duration: 550, result: "TiO2 (13463-67-7), >1M t/y, Carc. 2 (inhalation)" },
        { tool: "query_regulatory_monitor", label: "Checking regulatory monitoring feeds...", duration: 450, result: "Proposed restriction on consumer mixtures under evaluation" },
      ],
      text: "**Titanium Dioxide (CAS 13463-67-7) — REACH Status**\n\nRegistered under REACH at >1,000,000 tonnes/year band.\n\n- CLP Classification: Carc. 2 (by inhalation, powder form with ≥1% particles ≤10 μm)\n- SVHC status: Not currently on the Candidate List\n- Restriction: Under evaluation — proposed restriction on intentional use in mixtures for consumers\n\n⚠️ **Alert**: The European Commission is reviewing additional restrictions for TiO2 in consumer products. Monitoring recommended.",
      sources: ["ECHA Database", "EU Commission Communications"],
    },
  },
  {
    patterns: [/supplier.*(epoxy|epoxi)/i, /epoxy.*(supplier|proveedor)/i, /(proveedor|supplier).*(resina|resin)/i, /^validate supplier$/i, /^validar proveedor$/i],
    response: {
      steps: [
        { tool: "search_supplier_database", label: "Searching supplier database...", duration: 500, result: "4 epoxy resin suppliers in portfolio" },
        { tool: "query_approval_status", label: "Checking approval and audit status...", duration: 400 },
      ],
      text: "**Epoxy Resin Suppliers (Active in Quimidroga portfolio)**\n\n| Supplier | Country | Grade | Status |\n|---|---|---|---|\n| Dow Chemical | USA | DER 331 (liquid DGEBA) | ✅ Approved |\n| Hexion Inc. | USA | EPON 828 | ✅ Approved |\n| Kukdo Chemical | South Korea | KER 828 | 🔄 Under review |\n| Nan Ya Plastics | Taiwan | NPEL-128 | ✅ Approved |\n\nAll grades registered under REACH. Standard lead time: 4-6 weeks ex-warehouse Barcelona.",
      sources: ["Supplier Database", "Procurement Records"],
    },
  },
  {
    patterns: [/food.*(contact|contacto).*(butyl|acetate)/i, /butyl acetate.*(food|aliment)/i],
    response: {
      steps: [
        { tool: "query_food_contact_regulation", label: "Checking EU food contact regulations...", duration: 500, result: "Not listed for direct food contact" },
        { tool: "search_migration_limits", label: "Retrieving migration limits for coatings...", duration: 350 },
      ],
      text: "**Butyl Acetate — Food Contact Assessment**\n\nButyl Acetate (CAS 123-86-4) is **not** listed as authorized for direct food contact applications under EU Regulation (EC) No 1935/2004.\n\nHowever, it is permitted as a solvent in food-contact coatings and inks provided:\n- Residual levels in the final article comply with migration limits\n- SML (Specific Migration Limit): Not specifically listed — subject to overall migration limit of 10 mg/dm²\n\nRecommendation: Request a formal Declaration of Compliance from the coating manufacturer.",
      sources: ["EU Regulation DB", "Internal Compliance Records"],
    },
  },
  {
    patterns: [/svhc.*(solvent|disolvente)/i, /(solvent|disolvente).*(svhc|candidate|candidat)/i],
    response: {
      steps: [
        { tool: "query_echa_candidate_list", label: "Fetching ECHA Candidate List...", duration: 600, result: "3 solvents with SVHC status" },
        { tool: "cross_reference_portfolio", label: "Cross-referencing with product portfolio...", duration: 400 },
      ],
      text: "**Solvents Requiring SVHC Declaration in Quimidroga Portfolio**\n\n| Substance | CAS | SVHC Status | Notes |\n|---|---|---|---|\n| NMP (N-Methyl-2-pyrrolidone) | 872-50-4 | ✅ SVHC (Repr. 1B) | Authorization required from May 2025 |\n| DMF (Dimethylformamide) | 68-12-2 | ✅ SVHC (Repr. 1B) | Under authorization evaluation |\n| DMAC (Dimethylacetamide) | 127-19-5 | ✅ SVHC (Repr. 1B) | Authorization deadline pending |\n| Toluene | 108-88-3 | ❌ Not SVHC | Restricted in consumer products (Annex XVII) |\n| Butyl Acetate | 123-86-4 | ❌ Not SVHC | No restrictions |\n| Xylene | 1330-20-7 | ❌ Not SVHC | Annex XVII restrictions apply |",
      sources: ["ECHA Candidate List", "Internal REACH Registry"],
    },
  },
  {
    patterns: [/draft.*(notification|notificación|email)/i, /(notif|email).*(tio2|titanium)/i, /^redactar notificación$/i],
    response: {
      steps: [
        { tool: "fetch_regulatory_update", label: "Fetching latest TiO2 regulatory update...", duration: 500, result: "Commission evaluation Q3 2026" },
        { tool: "generate_email_draft", label: "Generating notification draft...", duration: 700 },
      ],
      text: "**Draft Notification — TiO2 REACH Update**\n\nSubject: Regulatory Update — Titanium Dioxide (CAS 13463-67-7)\n\nDear valued partner,\n\nWe are writing to inform you of an important regulatory development regarding Titanium Dioxide.\n\nThe European Commission is evaluating an additional restriction proposal for TiO2 in consumer mixtures. Key points:\n\n1. CLP classification as Carc. 2 by inhalation (powder form) remains in effect\n2. Proposed restriction: limitations on TiO2 in spray products and powder mixtures for consumers\n3. Timeline: Final opinion expected Q3 2026\n\nAffected products in your portfolio have been flagged in the system. We recommend reviewing formulations containing TiO2 above 1% concentration.\n\nPlease contact our Regulatory Affairs team for guidance.\n\nBest regards,\nRegulatory Affairs Department\nQuimidroga S.A.",
      sources: ["AI Draft Engine", "EU Commission CARACAL Agenda"],
    },
  },
  {
    patterns: [/mdi.*(status|reach|safety|seguridad)/i, /(isocyanate|isocianato)/i],
    response: {
      steps: [
        { tool: "search_echa_database", label: "Querying ECHA for MDI...", duration: 500, result: "Registered >1M t/y" },
        { tool: "check_restrictions", label: "Checking Annex XVII Entry 74 (diisocyanates)...", duration: 400, result: "Training requirement applies" },
      ],
      text: "**MDI (CAS 101-68-8) — Regulatory Summary**\n\nRegistered under REACH at >1,000,000 tonnes/year.\n\n- SVHC status: Not on the Candidate List\n- Restriction: Annex XVII Entry 74 — diisocyanates restricted since August 2023. Industrial/professional users must complete training before use\n- CLP: Resp. Sens. 1, STOT SE 3, Skin Irrit. 2, Eye Irrit. 2\n- OEL: 0.005 mg/m³ (8h TWA)\n\n⚠️ Training certification required for all downstream users under the restriction. Ensure your clients have valid certificates.",
      sources: ["ECHA Database", "REACH Restriction Annex XVII"],
    },
  },
  {
    patterns: [/sles.*(status|reach|compliance)/i, /(surfactant|tensioactivo).*(reach|comply|complian)/i, /sodium laureth/i],
    response: {
      steps: [
        { tool: "search_echa_database", label: "Querying REACH registration for SLES...", duration: 500, result: "100k–1M t/y" },
        { tool: "query_cosmetics_regulation", label: "Checking Cosmetics Regulation compliance...", duration: 400 },
      ],
      text: "**SLES (CAS 9004-82-4) — Compliance Overview**\n\nSodium Laureth Sulfate is registered under REACH. Tonnage band: 100,000–1,000,000 t/y.\n\n- SVHC: Not on Candidate List\n- No Annex XVII restrictions\n- Cosmetics: Compliant under (EC) 1223/2009, widely used up to 25% in rinse-off products\n- Detergent Regulation (EC) 648/2004: Meets biodegradability requirements (>60% in 28 days)\n- Ecolabel: Compatible with EU Ecolabel criteria for detergents\n\n1,4-Dioxane residual content should be monitored (recommended < 10 ppm for cosmetics grade).",
      sources: ["ECHA Database", "Cosmetics Regulation DB", "Detergent Regulation DB"],
    },
  },
  {
    patterns: [/ethylene glycol.*(reach|status|safety)/i, /glycol.*(antifreeze|construction)/i],
    response: {
      steps: [
        { tool: "search_echa_database", label: "Querying ECHA for Ethylene Glycol...", duration: 500, result: "Registered >1M t/y" },
        { tool: "query_internal_registry", label: "Checking internal safety records...", duration: 350 },
      ],
      text: "**Ethylene Glycol (CAS 107-21-1) — Regulatory Summary**\n\nRegistered under REACH at >1,000,000 tonnes/year.\n\n- SVHC: Not on Candidate List\n- CLP: Acute Tox. 4 (oral)\n- Restriction: Annex XVII Entry 51 — classified as harmful; must carry appropriate labeling\n- Used in: antifreeze, coolants, construction admixtures, polyester resin production\n\nDERs (Derived No-Effect Levels):\n- Workers, dermal: 106 mg/kg bw/day\n- Workers, inhalation: 35 mg/m³",
      sources: ["ECHA Database", "Internal Safety Records"],
    },
  },
  {
    patterns: [/dop.*(plasticizer|status|reach|pvc)/i, /(phthalate|ftalato).*(reach|status|restrict)/i, /dioctyl/i],
    response: {
      steps: [
        { tool: "query_echa_candidate_list", label: "Checking SVHC and Authorization List...", duration: 550, result: "DEHP on Annex XIV" },
        { tool: "search_alternatives", label: "Searching alternative plasticizers...", duration: 400, result: "DOTP, DINP available" },
      ],
      text: "**DOP / DEHP (CAS 117-81-7) — REACH Status**\n\n⚠️ **Critical Alert**: DEHP (Di(2-ethylhexyl) phthalate) is on the SVHC Candidate List and the Authorization List (Annex XIV).\n\n- Authorization required since February 2015\n- Classified: Repr. 1B\n- Restriction: Annex XVII Entry 51 — prohibited in toys and childcare articles >0.1%\n- Alternatives: DINP, DOTP, bio-based plasticizers available\n\nRecommendation: Transition clients to non-SVHC alternatives. DOTP (CAS 6422-86-2) is available from Evonik Industries as drop-in replacement.",
      sources: ["ECHA Candidate List", "Authorization List", "Internal Product Database"],
    },
  },
  {
    patterns: [/(quota|cuota|consumption|consumo).*(status|alert|alerta)/i, /reach.*(quota|cuota|consumption|status|estado)/i, /check.*(reach|estado)/i, /consultar.*(reach|estado)/i],
    response: {
      steps: [
        { tool: "query_internal_registry", label: "Fetching REACH consumption data...", duration: 600, result: "6 substances with quota tracking" },
        { tool: "calculate_utilization", label: "Calculating quota utilization...", duration: 400 },
      ],
      text: "**REACH Quota Summary — Current Status**\n\n| Substance | Consumed | Quota | Status |\n|---|---|---|---|\n| Toluene | 780 t / 1,000 t | 78% | ⚠️ Warning |\n| Butyl Acetate | 45 t / 200 t | 22.5% | ✅ Normal |\n| TiO2 | 580 t / 600 t | 96.7% | 🔴 Critical |\n| Epoxy Resin | 120 t / 500 t | 24% | ✅ Normal |\n| Ethylene Glycol | 340 t / 800 t | 42.5% | ✅ Normal |\n\n3 substances above 75% threshold. 1 requires immediate attention (TiO2).",
      sources: ["Internal REACH Registry", "ERP Consumption Data"],
    },
  },
  {
    patterns: [/(open|show|go to|abrir|ver|ir a).*(reach|reach dashboard|panel reach)/i],
    response: {
      steps: [
        { tool: "navigate_module", label: "Opening REACH Management...", duration: 500 },
      ],
      text: "Opening the REACH Management dashboard.",
      navigateTo: "/reach",
    },
  },
  {
    patterns: [/(open|show|go to|abrir|ver|ir a).*(homologation|homologación|supplier)/i],
    response: {
      steps: [
        { tool: "navigate_module", label: "Opening Supplier Homologation...", duration: 500 },
      ],
      text: "Opening the Supplier Homologation module.",
      navigateTo: "/homologation",
    },
  },
  {
    patterns: [/(open|show|go to|abrir|ver|ir a).*(dashboard|panel|inicio)/i],
    response: {
      steps: [
        { tool: "navigate_module", label: "Opening Dashboard...", duration: 400 },
      ],
      text: "Opening the Dashboard.",
      navigateTo: "/dashboard",
    },
  },
  {
    patterns: [/(open|show|go to|abrir|ver|ir a).*(questionnaire|cuestionario)/i],
    response: {
      steps: [
        { tool: "navigate_module", label: "Opening Client Questionnaires...", duration: 500 },
      ],
      text: "Opening the Client Questionnaires module.",
      navigateTo: "/questionnaires",
    },
  },
  {
    patterns: [/(open|show|go to|abrir|ver|ir a).*(flowchart|diagrama|flujo)/i],
    response: {
      steps: [
        { tool: "navigate_module", label: "Opening Manufacturing Flowcharts...", duration: 500 },
      ],
      text: "Opening the Manufacturing Flowcharts module.",
      navigateTo: "/flowcharts",
    },
  },
  {
    patterns: [/(open|show|go to|abrir|ver|ir a).*(changes|cambios)/i],
    response: {
      steps: [
        { tool: "navigate_module", label: "Opening Change Management...", duration: 500 },
      ],
      text: "Opening the Change Management module.",
      navigateTo: "/changes",
    },
  },
  {
    patterns: [/(what|qué).*(quimidroga|platform|plataforma).*(do|offer|hace|ofrece)/i, /help|ayuda|capabilities|capacidades/i],
    response: {
      steps: [
        { tool: "query_capabilities", label: "Loading platform capabilities...", duration: 400 },
      ],
      text: "I'm the **Quimidroga AI** regulatory assistant. I can help you with:\n\n1. **REACH Compliance** — Check registration status, SVHC alerts, quota monitoring\n2. **Product Lookups** — Find specifications, suppliers, CAS numbers\n3. **Regulatory Queries** — CLP classification, restrictions, authorization status\n4. **Draft Notifications** — Generate email drafts for regulatory changes\n5. **Supplier Information** — Approved suppliers, audit status, alternative sourcing\n\nTry asking me something like:\n- \"What is the REACH status of Toluene?\"\n- \"Which solvents are SVHC listed?\"\n- \"Draft a notification for the TiO2 update\"\n- \"Open the REACH dashboard\"",
      sources: [],
    },
  },
  {
    patterns: [/clp.*(toluene|butyl|mdi|epoxy|glycol|sles)/i, /(classification|clasificación).*(toluene|butyl|mdi)/i],
    response: {
      steps: [
        { tool: "query_cl_inventory", label: "Querying ECHA C&L Inventory...", duration: 550, result: "7 substances matched" },
        { tool: "format_classifications", label: "Formatting hazard classes...", duration: 300 },
      ],
      text: "**CLP Classifications — Key Products**\n\n| Substance | Hazard Classes | Pictograms |\n|---|---|---|\n| Toluene | Flam. Liq. 2, Repr. 2, STOT RE 2, Asp. Tox. 1 | GHS02, GHS07, GHS08 |\n| Butyl Acetate | Flam. Liq. 3, STOT SE 3 | GHS02, GHS07 |\n| MDI | Resp. Sens. 1, STOT SE 3, Skin/Eye Irrit. | GHS07, GHS08 |\n| Epoxy Resin (DGEBA) | Skin Sens. 1, Eye Irrit. 2, Aquatic Chronic 2 | GHS07, GHS09 |\n| Ethylene Glycol | Acute Tox. 4 (oral) | GHS07 |\n| SLES | Eye Dam. 1 | GHS05 |\n| TiO2 | Carc. 2 (inhalation, powder) | GHS08 |",
      sources: ["ECHA C&L Inventory", "Internal SDS Database"],
    },
  },
  {
    patterns: [/(hola|hello|hi|buenos días|good morning)/i],
    response: {
      steps: [
        { tool: "welcome", label: "Ready to help...", duration: 300 },
      ],
      text: "Hello! I'm the Quimidroga AI assistant. How can I help you today?\n\nI can answer questions about REACH compliance, product specifications, supplier information, CLP classifications, and more. I can also open modules like the REACH dashboard or Supplier Homologation for you.\n\nWhat would you like to know?",
      sources: [],
    },
  },
  {
    patterns: [/gracias|thank/i],
    response: {
      steps: [],
      text: "You're welcome! Let me know if you need anything else. I'm here to help with any regulatory or product-related queries.",
      sources: [],
    },
  },
];

const fallbackResponse: AgenticResponse = {
  steps: [
    { tool: "search_knowledge_base", label: "Searching knowledge base...", duration: 500, result: "No direct match" },
    { tool: "suggest_alternatives", label: "Preparing suggestions...", duration: 400 },
  ],
  text: "I don't have specific data for that query in the demo, but in the full platform I would search across:\n\n- ECHA registration database\n- Internal product master data\n- Supplier qualification records\n- SDS document repository\n- Regulatory change monitoring feeds\n\nCould you try rephrasing, or ask about a specific product (e.g., Toluene, Epoxy Resin, TiO2) or topic (REACH status, CLP classification, SVHC list)? You can also say \"Open the REACH dashboard\" to go to that module.",
  sources: [],
};

export function getMockResponse(message: string): AgenticResponse {
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(message)) {
        return rule.response;
      }
    }
  }
  return fallbackResponse;
}

export function getRandomDelay(): number {
  return 800 + Math.random() * 1200;
}
