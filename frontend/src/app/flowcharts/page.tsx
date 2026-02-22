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
  GitBranch, Sparkles, Loader2, CheckCircle2,
  Download, Thermometer, Gauge, FlaskConical, Clock,
} from "lucide-react";

const processColors: Record<string, { bg: string; border: string; text: string }> = {
  input: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
  output: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
  distillation: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  reaction: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  separation: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  extraction: { bg: "#fdf4ff", border: "#a855f7", text: "#6b21a8" },
  purification: { bg: "#f0f9ff", border: "#0ea5e9", text: "#0c4a6e" },
  analysis: { bg: "#fefce8", border: "#eab308", text: "#713f12" },
};

function ProcessNode({ data }: { data: Record<string, unknown> }) {
  const colors = processColors[(data.processType as string) || "input"] || processColors.input;
  const conditions = data.conditions as { key: string; value: string }[] | undefined;

  return (
    <div
      className="rounded-lg px-4 py-3 shadow-sm min-w-[220px] max-w-[280px]"
      style={{ background: colors.bg, border: `2px solid ${colors.border}`, color: colors.text }}
    >
      <div className="font-semibold text-sm">{data.label as string}</div>
      {data.processType && (data.processType as string) !== "input" && (data.processType as string) !== "output" && (
        <div className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">{data.processType as string}</div>
      )}
      {conditions && conditions.length > 0 && (
        <div className="mt-2 space-y-1 border-t border-black/10 pt-2">
          {conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px]">
              <span className="opacity-60">{c.key}:</span>
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
      style: { stroke: "#94a3b8", strokeWidth: 2 },
      labelStyle: { fontSize: 11, fill: "#64748b" },
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-accent" />
          {t("flowcharts.title")}
        </h1>
        <p className="text-navy-500 mt-1">{t("flowcharts.subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <label className="text-sm font-medium text-navy-700 block mb-2">{t("flowcharts.selectMaterial")}</label>
        <div className="flex gap-3 flex-wrap">
          {availableMaterials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => { setSelectedMaterial(mat.id); setShowFlowchart(false); setApproved(false); }}
              className={cn(
                "px-4 py-2.5 rounded-lg border text-sm transition-all",
                selectedMaterial === mat.id
                  ? "border-accent bg-accent/5 text-accent font-medium"
                  : "border-border bg-white text-navy-600 hover:border-navy-300"
              )}
            >
              <div className="font-medium">{mat.name}</div>
              <div className="text-xs text-navy-400 mt-0.5">CAS {mat.cas}</div>
            </button>
          ))}
        </div>

        {selectedMaterial && !showFlowchart && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-70"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{t("flowcharts.generating")}</>
            ) : (
              <><Sparkles className="w-4 h-4" />{t("flowcharts.generate")}</>
            )}
          </button>
        )}
      </div>

      {showFlowchart && currentData && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-navy-500">
              {t("flowcharts.consolidated")} — {currentData.nodes.length} {locale === "en" ? "steps" : "pasos"}
            </div>
            <div className="flex gap-2">
              {!approved ? (
                <button
                  onClick={() => setApproved(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("flowcharts.approve")}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("flowcharts.approved")}
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                <Download className="w-4 h-4" />
                {t("flowcharts.export")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 bg-white rounded-xl border border-border overflow-hidden" style={{ height: 600 }}>
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
                <Background color="#e2e8f0" gap={20} />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    const pt = node.data?.processType as string;
                    return processColors[pt]?.border || "#94a3b8";
                  }}
                  maskColor="rgba(248,250,252,0.8)"
                />
              </ReactFlow>
            </div>

            <div className="bg-white rounded-xl border border-border p-4">
              <h3 className="font-semibold text-navy-800 text-sm mb-3">
                {selectedNodeData ? selectedNodeData.label : (locale === "en" ? "Click a node for details" : "Haz clic en un nodo para ver detalles")}
              </h3>
              {selectedNodeData && (
                <div className="space-y-3">
                  {selectedNodeData.processType && (
                    <div className="text-xs">
                      <span className="text-navy-400 uppercase tracking-wider">{t("flowcharts.processStep")}</span>
                      <div className="font-medium text-navy-700 mt-0.5 capitalize">{selectedNodeData.processType}</div>
                    </div>
                  )}
                  {selectedNodeData.conditions && selectedNodeData.conditions.length > 0 && (
                    <div>
                      <span className="text-xs text-navy-400 uppercase tracking-wider">{t("flowcharts.conditions")}</span>
                      <div className="mt-1.5 space-y-2">
                        {selectedNodeData.conditions.map((c, i) => {
                          const icon = c.key.toLowerCase().includes("temp") ? Thermometer
                            : c.key.toLowerCase().includes("pressure") ? Gauge
                            : c.key.toLowerCase().includes("catalyst") || c.key.toLowerCase().includes("solvent") || c.key.toLowerCase().includes("oxidant") ? FlaskConical
                            : Clock;
                          const Icon = icon;
                          return (
                            <div key={i} className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
                              <Icon className="w-3.5 h-3.5 text-navy-400" />
                              <div>
                                <div className="text-[10px] text-navy-400">{c.key}</div>
                                <div className="text-xs font-medium text-navy-700">{c.value}</div>
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
