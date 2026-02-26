"use client";

import { useState, useCallback, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { materials, flowchartData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Sparkles, Loader2, CheckCircle2,
  Download, Thermometer, Gauge, FlaskConical, Clock,
} from "lucide-react";

const processColors: Record<string, { bg: string; border: string; text: string }> = {
  input: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
  output: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
  distillation: { bg: "#eef2ff", border: "#5e6ad2", text: "#3730a3" },
  reaction: { bg: "#fefce8", border: "#ca8a04", text: "#92400e" },
  separation: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  extraction: { bg: "#fdf4ff", border: "#a855f7", text: "#6b21a8" },
  purification: { bg: "#eef2ff", border: "#5e6ad2", text: "#3730a3" },
  analysis: { bg: "#fefce8", border: "#ca8a04", text: "#713f12" },
};

function ProcessNode({ data }: { data: Record<string, unknown> }) {
  const colors = processColors[(data.processType as string) || "input"] || processColors.input;
  const conditions = data.conditions as { key: string; value: string }[] | undefined;

  return (
    <div
      className="rounded-md px-3 py-2.5 min-w-[200px] max-w-[260px]"
      style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text }}
    >
      <div className="font-medium text-[13px]">{data.label as string}</div>
      {data.processType && (data.processType as string) !== "input" && (data.processType as string) !== "output" && (
        <div className="text-[10px] uppercase tracking-wider opacity-60 mt-0.5">{data.processType as string}</div>
      )}
      {conditions && conditions.length > 0 && (
        <div className="mt-1.5 space-y-0.5 border-t border-black/10 pt-1.5">
          {conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px]">
              <span className="opacity-50">{c.key}:</span>
              <span className="font-medium">{c.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { processNode: ProcessNode };

export default function FlowchartsPage() {
  const { t, locale } = useI18n();
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [approved, setApproved] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const availableMaterials = materials.filter((m) => flowchartData[m.id]);
  const currentData = selectedMaterial ? flowchartData[selectedMaterial] : null;

  const nodes: Node[] = useMemo(() => {
    if (!currentData) return [];
    return currentData.nodes.map((n) => ({
      id: n.id,
      type: "processNode",
      position: n.position,
      data: { label: n.label, processType: n.processType, conditions: n.conditions },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }));
  }, [currentData]);

  const edges: Edge[] = useMemo(() => {
    if (!currentData) return [];
    return currentData.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#d4d4d4", strokeWidth: 1.5 },
      labelStyle: { fontSize: 10, fill: "#6b6b6b" },
    }));
  }, [currentData]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowFlowchart(false);
    setApproved(false);
    setSelectedNode(null);
    await new Promise((r) => setTimeout(r, 3000));
    setIsGenerating(false);
    setShowFlowchart(true);
  };

  const handleNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const selectedNodeData = currentData?.nodes.find((n) => n.id === selectedNode);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-medium text-[#1a1a1a] tracking-tight">{t("flowcharts.title")}</h1>
        <p className="text-[13px] text-[#6b6b6b] mt-0.5">{t("flowcharts.subtitle")}</p>
      </div>

      <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
        <label className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider block mb-2">{t("flowcharts.selectMaterial")}</label>
        <div className="flex gap-2 flex-wrap">
          {availableMaterials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => { setSelectedMaterial(mat.id); setShowFlowchart(false); setApproved(false); }}
              className={cn(
                "px-3 py-2 rounded-md border text-[13px] transition-all duration-150",
                selectedMaterial === mat.id
                  ? "border-[#5e6ad2] bg-[#eef2ff] text-[#5e6ad2] font-medium"
                  : "border-[#f0f0f0] bg-white text-[#6b6b6b] hover:border-[#e0e0e0] hover:bg-[#f8f8f8]"
              )}
            >
              <div className="font-medium">{mat.name}</div>
              <div className="text-[11px] opacity-70 mt-0.5">CAS {mat.cas}</div>
            </button>
          ))}
        </div>

        {selectedMaterial && !showFlowchart && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-[#5e6ad2] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150 disabled:opacity-70"
          >
            {isGenerating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />{t("flowcharts.generating")}</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" />{t("flowcharts.generate")}</>
            )}
          </button>
        )}
      </div>

      {showFlowchart && currentData && (
        <div className="animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[13px] text-[#6b6b6b]">
              {t("flowcharts.consolidated")} — {currentData.nodes.length} {locale === "en" ? "steps" : "pasos"}
            </div>
            <div className="flex gap-2">
              {!approved ? (
                <button
                  onClick={() => setApproved(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t("flowcharts.approve")}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecfdf5] text-[#059669] rounded-md text-[13px] font-medium border border-[#dcfce7]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t("flowcharts.approved")}
                </div>
              )}
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5e6ad2] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150">
                <Download className="w-3.5 h-3.5" />
                {t("flowcharts.export")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-3 bg-white rounded-md border border-[#f0f0f0] overflow-hidden" style={{ height: 550 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.3}
                maxZoom={1.5}
              >
                <Background color="#e8e8e8" gap={20} />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    const pt = node.data?.processType as string;
                    return processColors[pt]?.border || "#d4d4d4";
                  }}
                  maskColor="rgba(255,255,255,0.85)"
                />
              </ReactFlow>
            </div>

            <div className="bg-white rounded-md border border-[#f0f0f0] p-3">
              <h3 className="text-[13px] font-medium text-[#1a1a1a] mb-2">
                {selectedNodeData ? selectedNodeData.label : (locale === "en" ? "Click a node for details" : "Haz clic en un nodo para ver detalles")}
              </h3>
              {selectedNodeData && (
                <div className="space-y-2.5">
                  {selectedNodeData.processType && (
                    <div>
                      <span className="text-[10px] text-[#a0a0a0] uppercase tracking-wider">{t("flowcharts.processStep")}</span>
                      <div className="text-[13px] font-medium text-[#1a1a1a] mt-0.5 capitalize">{selectedNodeData.processType}</div>
                    </div>
                  )}
                  {selectedNodeData.conditions && selectedNodeData.conditions.length > 0 && (
                    <div>
                      <span className="text-[10px] text-[#a0a0a0] uppercase tracking-wider">{t("flowcharts.conditions")}</span>
                      <div className="mt-1.5 space-y-1.5">
                        {selectedNodeData.conditions.map((c, i) => {
                          const icon = c.key.toLowerCase().includes("temp") ? Thermometer
                            : c.key.toLowerCase().includes("pressure") ? Gauge
                            : c.key.toLowerCase().includes("catalyst") || c.key.toLowerCase().includes("solvent") || c.key.toLowerCase().includes("oxidant") ? FlaskConical
                            : Clock;
                          const Icon = icon;
                          return (
                            <div key={i} className="flex items-center gap-2 bg-[#fafafa] rounded-md px-2.5 py-1.5 border border-[#f0f0f0]">
                              <Icon className="w-3 h-3 text-[#a0a0a0]" />
                              <div>
                                <div className="text-[10px] text-[#a0a0a0]">{c.key}</div>
                                <div className="text-[11px] font-medium text-[#1a1a1a]">{c.value}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
