import React, { useState } from "react";
import { UserInputs, CalculationResults } from "../types";
import { LineChart, BarChart2, Lightbulb, Wallet, Milestone } from "lucide-react";

interface Props {
  inputs: UserInputs;
  results: CalculationResults;
}

export default function PathChart({ inputs, results }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const years = Array.from({ length: inputs.yearsToRetire + 1 }, (_, i) => i);

  // Generate projections year by year
  const dataPoints = years.map((year) => {
    // Inflation factor
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, year);
    const nominalExpenses = inputs.currentExpenses;
    const realExpenses = nominalExpenses * inflationFactor;
    
    // Retirement target requirement at that year
    const targetRetirementTarget = realExpenses * (100 / inputs.withdrawalRate);

    // Accumulated assets
    // Using regular simple interest rate or monthly savings rate
    // Accumulated compound formula
    let assets = inputs.initialSavings;
    const monthlyRate = (inputs.investmentReturn / 100) / 12;
    const months = year * 12;

    for (let m = 0; m < months; m++) {
      assets = assets * (1 + monthlyRate) + results.requiredMonthlySavings;
    }

    return {
      year,
      inflationFactor,
      realExpenses,
      targetRetirementTarget,
      accumulatedAssets: Math.round(assets),
      nominalTargetFund: nominalExpenses * (100 / inputs.withdrawalRate) * inflationFactor,
    };
  });

  const maxVal = Math.max(
    ...dataPoints.map((d) => Math.max(d.targetRetirementTarget, d.accumulatedAssets))
  ) * 1.1 || 1000000;

  // Chart configuration dimensions
  const width = 600;
  const height = 280;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert coordinate to SVG Cartesian coordinates
  const getXCoordinate = (index: number) => {
    return paddingLeft + (index / inputs.yearsToRetire) * chartWidth;
  };

  const getYCoordinate = (value: number) => {
    return paddingTop + chartHeight - (value / maxVal) * chartHeight;
  };

  const currentHoverPoint = hoverIndex !== null ? dataPoints[hoverIndex] : null;

  return (
    <div className="bg-white border-2 border-[#141414] p-6 md:p-8 relative" id="visual-projection-panel">
      <div className="absolute -top-3.5 left-4 bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
        02 / PROJECTION GRAPH
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-2">
        <div>
          <h2 className="text-sm font-black uppercase text-[#141414] flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            资产积累及退休目标曲线 (按年测算)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            测算未来 {inputs.yearsToRetire} 年储蓄积累值与经通胀演变后的【4% 退休提取目标线】。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#141414] font-bold uppercase tracking-tight">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-[#141414] inline-block"></span>
            资产预估曲线
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-red-600 inline-block border-t border-red-600 border-dashed"></span>
            退休金目标线(抗通胀)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* SVG Plot */}
        <div className="xl:col-span-8">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2.1/1" }}>
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-full select-none"
              style={{ overflow: "visible" }}
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                const y = paddingTop + chartHeight * p;
                const val = Math.round(((1 - p) * maxVal) / 10000) * 10000;
                return (
                  <g key={i} className="opacity-40">
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={width - paddingRight} 
                      y2={y} 
                      stroke="#141414" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" 
                    />
                    <text 
                      x={paddingLeft - 10} 
                      y={y + 3} 
                      textAnchor="end" 
                      className="text-[9px] font-mono font-bold fill-[#141414]"
                    >
                      {(val / 10000).toFixed(0)}万
                    </text>
                  </g>
                );
              })}

              {/* X Axis labels */}
              {dataPoints.map((d, i) => {
                const x = getXCoordinate(i);
                const shouldShow = inputs.yearsToRetire <= 15 || i % 2 === 0 || i === inputs.yearsToRetire;
                if (!shouldShow) return null;
                return (
                  <g key={i}>
                    <line 
                      x1={x} 
                      y1={paddingTop + chartHeight} 
                      x2={x} 
                      y2={paddingTop + chartHeight + 4} 
                      stroke="#141414" 
                      strokeWidth="1.5"
                    />
                    <text 
                      x={x} 
                      y={paddingTop + chartHeight + 14} 
                      textAnchor="middle" 
                      className="text-[9px] font-mono font-bold fill-[#141414]"
                    >
                      {i === 0 ? "今天" : `${i}年后`}
                    </text>
                  </g>
                );
              })}

              {/* Area under assets curve */}
              <path
                d={`M ${getXCoordinate(0)} ${getYCoordinate(0)} 
                    ${dataPoints.map((d, i) => `L ${getXCoordinate(i)} ${getYCoordinate(d.accumulatedAssets)}`).join(" ")}
                    L ${getXCoordinate(inputs.yearsToRetire)} ${paddingTop + chartHeight}
                    L ${getXCoordinate(0)} ${paddingTop + chartHeight} Z`}
                fill="url(#density-grad)"
                className="opacity-10"
              />

              {/* Target line (Inflation Adjusted Target) */}
              <path
                d={dataPoints.map((d, i) => `${i === 0 ? "M" : "L"} ${getXCoordinate(i)} ${getYCoordinate(d.targetRetirementTarget)}`).join(" ")}
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />

              {/* Assets Accumulation Line */}
              <path
                d={dataPoints.map((d, i) => `${i === 0 ? "M" : "L"} ${getXCoordinate(i)} ${getYCoordinate(d.accumulatedAssets)}`).join(" ")}
                fill="none"
                stroke="#141414"
                strokeWidth="4"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />

              {/* Data points dots */}
              {dataPoints.map((d, i) => {
                const x = getXCoordinate(i);
                const yA = getYCoordinate(d.accumulatedAssets);
                const yT = getYCoordinate(d.targetRetirementTarget);
                const isHovered = hoverIndex === i;

                return (
                  <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
                    {/* Interactive background slider line */}
                    {isHovered && (
                      <line 
                        x1={x} 
                        y1={paddingTop} 
                        x2={x} 
                        y2={paddingTop + chartHeight} 
                        stroke="#141414" 
                        strokeWidth="1.5" 
                        strokeDasharray="1,1" 
                      />
                    )}
                    {/* Asset Point */}
                    <circle 
                      cx={x} 
                      cy={yA} 
                      r={isHovered ? 6 : 3.5} 
                      fill="#141414" 
                      stroke="#FFFFFF" 
                      strokeWidth={isHovered ? 2.5 : 1.5} 
                    />
                    {/* Target Point */}
                    <circle 
                      cx={x} 
                      cy={yT} 
                      r={isHovered ? 5 : 3} 
                      fill="#DC2626" 
                      stroke="#FFFFFF" 
                      strokeWidth={isHovered ? 2 : 1} 
                    />
                  </g>
                );
              })}

              {/* Define density colors gradient */}
              <defs>
                <linearGradient id="density-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#141414" />
                  <stop offset="100%" stopColor="#141414" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Info panel */}
        <div className="xl:col-span-4 flex flex-col justify-between">
          <div className="p-5 bg-[#E4E3E0] border-2 border-[#141414] relative">
            <h3 className="font-extrabold uppercase text-[#141414] text-xs flex items-center gap-2 mb-3 border-b border-[#141414]/20 pb-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              动态核算物理透视
            </h3>
            
            {currentHoverPoint ? (
              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs text-[#141414] border-b border-[#141414]/20 pb-1.5 font-bold">
                  <span>时间节点</span>
                  <span className="font-mono bg-[#141414] text-[#E4E3E0] px-1.5 py-0.5 text-[10px]">
                    {currentHoverPoint.year === 0 ? "START (今天)" : `${currentHoverPoint.year}Y NODE`}
                  </span>
                </div>
                
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-slate-700 uppercase font-bold">物价累计偏离指数</span>
                  <span className="text-xs font-bold font-mono">
                    {currentHoverPoint.inflationFactor.toFixed(3)}x
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-slate-700 uppercase font-bold">实际购买力年开销</span>
                  <span className="text-xs font-bold font-mono">
                    ¥{Math.round(currentHoverPoint.realExpenses).toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-[#141414]/10 my-1"></div>

                <div>
                  <div className="text-[9px] text-[#DC2626] uppercase font-extrabold tracking-tight">安全储备基金门槛 (SWR Target)</div>
                  <div className="text-base font-black font-mono text-[#DC2626]">
                    ￥{Math.round(currentHoverPoint.targetRetirementTarget).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-800 uppercase font-extrabold tracking-tight">积累已投资产池预估 (Accumulated)</div>
                  <div className="text-base font-black font-mono text-[#141414]">
                    ￥{currentHoverPoint.accumulatedAssets.toLocaleString()}
                  </div>
                </div>

                {currentHoverPoint.accumulatedAssets >= currentHoverPoint.targetRetirementTarget ? (
                  <div className="text-white text-[10px] font-bold uppercase bg-emerald-800 p-2 text-center border border-emerald-950">
                    ✓ SAFE / DETACH / FIRE ACHIEVED
                  </div>
                ) : (
                  <div className="text-slate-750 text-[10px] leading-tight font-serif italic border-t border-[#141414]/10 pt-2">
                    需再积累 <strong>{Math.round(currentHoverPoint.targetRetirementTarget - currentHoverPoint.accumulatedAssets).toLocaleString()} 元</strong> 填补物价折旧豁口。
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[#141414] py-6 text-center text-xs font-serif italic">
                <span className="block mb-2 font-bold font-sans not-italic uppercase text-[10px] tracking-widest text-slate-700">👇 HOVER MATRIX 点</span>
                按年度节点查看未来物价、所需年费和本金缺口的动态演化图表。
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between items-center bg-white p-3 border border-[#141414]">
              <span className="opacity-70">INTEREST EXCELLENCE:</span>
              <strong className="font-bold underline">{inputs.investmentReturn}% / YR</strong>
            </div>

            <div className="flex justify-between items-center bg-white p-3 border border-[#141414]">
              <span className="opacity-70">MONTHLY SAVINGS TARGET:</span>
              <strong className="font-bold text-lg text-indigo-900">￥{Math.round(results.requiredMonthlySavings).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
