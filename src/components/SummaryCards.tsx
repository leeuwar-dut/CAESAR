import React from "react";
import { UserInputs, CalculationResults } from "../types";
import { Coins, Flame, DollarSign, CalendarCheck2, ShieldCheck, TrendingDown } from "lucide-react";

interface Props {
  inputs: UserInputs;
  results: CalculationResults;
}

export function formatRMB(val: number) {
  if (val >= 10000) {
    return `${(val / 10000).toFixed(2)} 万`;
  }
  return `${Math.round(val).toLocaleString()} `;
}

export default function SummaryCards({ inputs, results }: Props) {
  const inflationImpactCount = results.targetFund - results.nominalTargetFund;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 pt-2" id="projection-indicators-grid">
      {/* Target Retirement Fund adjusted */}
      <div className="bg-[#141414] text-[#E4E3E0] p-6 border-2 border-[#141414] relative flex flex-col justify-between min-h-[160px]">
        <div className="absolute -top-3.5 left-4 bg-[#141414] text-[#E4E3E0] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#E4E3E0] font-mono">
          01 / SWR TARGET FUND (REAL)
        </div>
        <div className="mt-2">
          <span className="text-[11px] font-bold uppercase opacity-60 block tracking-tight">
            10年后真实退休金池目标
          </span>
          <span className="font-serif italic text-xs text-slate-400">考虑 CPI 复利通胀</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black font-mono tracking-tight text-white block">
            ￥{formatRMB(results.targetFund)}
          </span>
          <span className="text-[10px] text-slate-400 mt-2 block font-mono">
            = 等下首年 {results.futureExpenses.toLocaleString()} 元/年取出
          </span>
        </div>
      </div>

      {/* Target retirement fund nominal */}
      <div className="bg-white text-[#141414] p-6 border-2 border-[#141414] relative flex flex-col justify-between min-h-[160px]">
        <div className="absolute -top-3.5 left-4 bg-white text-[#141414] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
          02 / NOMINAL VALUE (STATIC)
        </div>
        <div className="mt-2">
          <span className="text-[11px] font-bold uppercase opacity-60 block tracking-tight">
            忽视通胀名义退休目标池
          </span>
          <span className="font-serif italic text-xs text-slate-500">静态本金 (首年25倍支出)</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black font-mono tracking-tight text-[#141414] block">
            ￥{formatRMB(results.nominalTargetFund)}
          </span>
          <span className="text-[10px] text-red-700/95 font-bold mt-2 block flex items-center gap-1 font-mono">
            [⚠️ 资产缺口: {formatRMB(inflationImpactCount)} (约 {((results.targetFund / results.nominalTargetFund - 1) * 100).toFixed(1)}%)]
          </span>
        </div>
      </div>

      {/* Future Annual Expenses */}
      <div className="bg-white text-[#141414] p-6 border-2 border-[#141414] relative flex flex-col justify-between min-h-[160px]">
        <div className="absolute -top-3.5 left-4 bg-white text-[#141414] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
          03 / REAL ANNUITY OUTFLOW
        </div>
        <div className="mt-2">
          <span className="text-[11px] font-bold uppercase opacity-60 block tracking-tight">
            10年后等效购买力生活费/年
          </span>
          <span className="font-serif italic text-xs text-slate-500">物价变动后年开销名义值</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black font-mono tracking-tight text-[#141414] block">
            ￥{results.futureExpenses.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 mt-2 block font-mono">
            每月对应开支额: {Math.round(results.futureExpenses / 12).toLocaleString()} 元/月
          </span>
        </div>
      </div>

      {/* Required Monthly Savings */}
      <div className="bg-[#E4E3E0] text-[#141414] p-6 border-2 border-[#141414] relative flex flex-col justify-between min-h-[160px]">
        <div className="absolute -top-3.5 left-4 bg-[#141414] text-[#E4E3E0] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
          04 / REQUIRED MONTHLY INVESTMENT
        </div>
         <div className="mt-2">
          <span className="text-[11px] font-bold uppercase opacity-60 block tracking-tight">
            每月额外所需结余投资额
          </span>
          <span className="font-serif italic text-xs text-slate-600">假设按 {inputs.investmentReturn}% 年化收益计算</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black font-mono tracking-tight text-[#141414] block">
            ￥{Math.round(results.requiredMonthlySavings).toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-800 font-bold mt-2 block font-mono">
            ✓ 10年产生的利息部分: {formatRMB(results.totalInterestEarned)}
          </span>
        </div>
      </div>
    </div>
  );
}
