import React from "react";
import { UserInputs } from "../types";
import { HelpCircle, RefreshCw, Layers, Calendar, Landmark, Settings2 } from "lucide-react";

interface Props {
  inputs: UserInputs;
  onChange: (inputs: UserInputs) => void;
  averageInflation: number;
}

export default function PlannerInputs({ inputs, onChange, averageInflation }: Props) {
  const handleChange = (field: keyof UserInputs, val: number) => {
    onChange({
      ...inputs,
      [field]: val,
    });
  };

  const resetToDefault = () => {
    onChange({
      currentExpenses: 120000,
      yearsToRetire: 10,
      withdrawalRate: 4,
      inflationRate: averageInflation,
      investmentReturn: 6,
      initialSavings: 0,
    });
  };

  return (
    <div className="bg-white border-2 border-[#141414] p-6 md:p-8 relative" id="parameters-options-panel">
      <div className="absolute -top-3.5 left-4 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
        01 / FIXED INPUTS
      </div>
      <div className="flex items-center justify-between border-b-2 border-[#141414] pb-4 mb-6 pt-2">
        <h2 className="text-sm font-black uppercase text-[#141414] flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          测算核心参数面板
        </h2>
        <button
          onClick={resetToDefault}
          className="text-xs font-bold text-[#141414] hover:underline flex items-center gap-1 cursor-pointer"
          title="恢复至初始提案"
        >
          <RefreshCw className="w-3 h-3" />
          [重置]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-y-6">
        {/* Current Annual Expenses */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#141414]"></span>
            家庭当前年支出 (RMB 元)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-900 font-mono text-xs font-bold">￥</span>
            </div>
            <input
              type="number"
              value={inputs.currentExpenses}
              onChange={(e) => handleChange("currentExpenses", Number(e.target.value))}
              placeholder="e.g. 120000"
              className="block w-full border-2 border-[#141414] py-2.5 pl-8 pr-12 text-sm text-[#141414] focus:outline-none focus:bg-slate-50 font-mono font-bold"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 font-bold text-[10px]">万/年</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            等值每月生活支出约 <span className="font-bold">{(inputs.currentExpenses / 12).toFixed(0)}</span> 元。
          </p>
        </div>

        {/* Years to Retirement */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#141414]"></span>
            计划退休年限 (距离退休年数)
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="40"
              value={inputs.yearsToRetire}
              onChange={(e) => handleChange("yearsToRetire", Number(e.target.value))}
              className="w-full h-1.5 bg-[#141414] appearance-none cursor-pointer mt-4 mb-2"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>1 年后</span>
              <span className="text-xs font-bold text-[#E4E3E0] bg-[#141414] border border-[#141414] px-2 py-0.5">
                {inputs.yearsToRetire} 年后退休
              </span>
              <span>40 年后</span>
            </div>
          </div>
        </div>

        {/* Withdrawal Rate (SWR) */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#141414]"></span>
            安全年度提取率 (SWR RULE)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="1"
              max="15"
              value={inputs.withdrawalRate}
              onChange={(e) => handleChange("withdrawalRate", Number(e.target.value))}
              className="block w-full border-2 border-[#141414] py-2.5 px-3 pr-10 text-sm text-[#141414] focus:outline-none focus:bg-slate-50 font-mono font-bold"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-900 font-mono text-xs font-bold">%</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            按 <strong>4%法则</strong> 相当于需要累积当前年支出的 <strong>25 倍</strong> 本金。
          </p>
        </div>

        {/* Estimated Inflation Rate */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#141414]"></span>
            预估未来年化通胀率 (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={inputs.inflationRate}
              onChange={(e) => handleChange("inflationRate", Number(e.target.value))}
              className="block w-full border-2 border-[#141414] py-2.5 px-3 pr-10 text-sm text-[#141414] focus:outline-none focus:bg-slate-50 font-mono font-bold"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-900 font-mono text-xs font-bold">%</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-500">
              * 10年回测均值: <strong>{averageInflation}%</strong>
            </span>
            <button 
              onClick={() => handleChange("inflationRate", averageInflation)}
              className="text-[#141414] font-bold underline hover:no-underline cursor-pointer"
            >
              [恢复均值]
            </button>
          </div>
        </div>

        {/* Investment Earn rate */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#141414]"></span>
            积累期生息资产复利年化回报率 (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="25"
              value={inputs.investmentReturn}
              onChange={(e) => handleChange("investmentReturn", Number(e.target.value))}
              placeholder="e.g. 6"
              className="block w-full border-2 border-[#141414] py-2.5 px-3 pr-10 text-sm text-[#141414] focus:outline-none focus:bg-slate-50 font-mono font-bold"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-900 font-mono text-xs font-bold">%</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            资产池投资的整体年化加权收益率目标。
          </p>
        </div>

        {/* Initial Savings */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#141414]"></span>
            已拥有的蓄水池起步储蓄 (RMB 元)
          </label>
          <div className="relative">
            <input
              type="number"
              value={inputs.initialSavings}
              onChange={(e) => handleChange("initialSavings", Number(e.target.value))}
              placeholder="已有本金数量"
              className="block w-full border-2 border-[#141414] py-2.5 px-3 pr-12 text-sm text-[#141414] focus:outline-none focus:bg-slate-50 font-mono font-bold"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 font-bold text-xs">元</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            已存下的种子退休自筹本金。
          </p>
        </div>
      </div>
    </div>
  );
}
