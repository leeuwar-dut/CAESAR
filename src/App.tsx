import React, { useState, useEffect } from "react";
import { UserInputs, CalculationResults } from "./types";
import { DEFAULT_INFLATION_MEAN } from "./data";
import HistoricalTable from "./components/HistoricalTable";
import PathChart from "./components/PathChart";
import PlannerInputs from "./components/PlannerInputs";
import SummaryCards from "./components/SummaryCards";
import AIAssistant from "./components/AIAssistant";
import { 
  PiggyBank, 
  TableProperties, 
  Sparkles, 
  LineChart as ChartIcon, 
  HelpCircle,
  TrendingUp,
  BookmarkCheck,
  ChevronRight,
  Info
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "backtest" | "ai">("dashboard");

  // Load from local storage or set defaults
  const [inputs, setInputs] = useState<UserInputs>(() => {
    const saved = localStorage.getItem("fire_planner_inputs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      currentExpenses: 120000,
      yearsToRetire: 10,
      withdrawalRate: 4,
      inflationRate: DEFAULT_INFLATION_MEAN, // 默认设为回测均值 1.492%
      investmentReturn: 6,
      initialSavings: 0,
    };
  });

  // Persist inputs list
  useEffect(() => {
    localStorage.setItem("fire_planner_inputs", JSON.stringify(inputs));
  }, [inputs]);

  // Dynamic calculations engine
  const calculateResults = (): CalculationResults => {
    const N = inputs.yearsToRetire;
    const I_r = inputs.inflationRate / 100;
    const C = inputs.currentExpenses;
    const SWR = inputs.withdrawalRate / 100;
    const R = inputs.investmentReturn / 100;
    const S_0 = inputs.initialSavings;

    // 1. Future expenses adjusted for inflation (复利公式)
    const futureExpenses = C * Math.pow(1 + I_r, N);

    // 2. Target retirement capital under SWR rule
    const targetFund = futureExpenses / SWR;

    // 3. Nominal target ignoring inflation
    const nominalTargetFund = C / SWR;

    // 4. Calculate monthly savings required
    // Monthly rate
    const r_m = R / 12;
    const totalMonths = N * 12;

    // Compounded growth of initial savings
    const activeCompoundedInitial = S_0 * Math.pow(1 + r_m, totalMonths);
    const balanceNeeded = Math.max(0, targetFund - activeCompoundedInitial);

    let requiredMonthlySavings = 0;
    if (balanceNeeded > 0) {
      if (r_m === 0) {
        requiredMonthlySavings = balanceNeeded / totalMonths;
      } else {
        // Annuity target calculation (FV of an ordinary annuity)
        requiredMonthlySavings = (balanceNeeded * r_m) / (Math.pow(1 + r_m, totalMonths) - 1);
      }
    }

    // 5. Total compound interest earned
    const totalSavedPrincipal = S_0 + (requiredMonthlySavings * totalMonths);
    const totalInterestEarned = Math.max(0, targetFund - totalSavedPrincipal);

    // 6. Cumulative inflation divisor
    const cumulativeInflationFactor = Math.pow(1 + I_r, N);

    return {
      futureExpenses: Math.round(futureExpenses),
      targetFund: Math.round(targetFund),
      nominalTargetFund: Math.round(nominalTargetFund),
      requiredMonthlySavings: parseFloat(requiredMonthlySavings.toFixed(2)),
      totalInterestEarned: Math.round(totalInterestEarned),
      cumulativeInflationFactor: parseFloat(cumulativeInflationFactor.toFixed(3)),
    };
  };

  const results = calculateResults();
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] md:border-[12px] border-[#141414] flex flex-col font-sans antialiased pb-12">
      {/* Dynamic Header */}
      <header className="border-b-2 border-[#141414] p-6 flex flex-col md:flex-row justify-between items-baseline gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black uppercase tracking-tighter flex flex-wrap items-baseline gap-x-2">
            Retirement Projection 
            <span className="font-serif italic font-normal text-2xl lowercase text-slate-800">system v2.5</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mt-1">
            China Mainland Economic Context Analysis
          </p>
        </div>

        {/* System Identifier Tags */}
        <div className="text-left md:text-right font-mono text-[11px] leading-tight flex md:flex-col gap-x-4">
          <p className="uppercase"><span className="opacity-50">NODE:</span> CN-EAST-FIN-01</p>
          <p className="uppercase"><span className="opacity-50">DATE:</span> {currentDate}</p>
          <p className="uppercase"><span className="opacity-50">SWR RULE:</span> 4.0% BASELINE</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-8 flex-grow flex flex-col gap-6">
        {/* Intro Alert Box / System Status Notification */}
        <div className="bg-white border-2 border-[#141414] p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 relative">
          <div className="absolute -top-3 left-4 bg-[#141414] text-[#E4E3E0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414]">
            System Backtest Broadcast
          </div>
          <div className="flex gap-4">
            <span className="p-2.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] shrink-0 mt-1">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tight text-[#141414]">
                10-Year Historical Inflation Backtest Analysis (2016-2025) Average: <span className="font-mono font-black underline underline-offset-4 decoration-2">{DEFAULT_INFLATION_MEAN}% / YR</span>
              </h1>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed max-w-4xl">
                按照4%提取法则，您当前家庭年支出为 <strong>12.00 万元</strong>，规划在 <strong>10 年后退休</strong>。
                在不考虑物价波动的静态推算中您仅需储备 <strong>300.00 万元</strong>。但是在考虑过去10年中国大陆真实物价指数变动系数（平均每年 <strong>{DEFAULT_INFLATION_MEAN}%</strong>）后，
                10年后维持同等购买力的家庭年开支将上升至 <strong>{results.futureExpenses.toLocaleString()} 元</strong>。您实际的退休安全精算目标应当为 
                <strong className="text-[#141414] bg-[#E4E3E0] px-1.5 py-0.5 border border-[#141414] ml-1 font-mono">￥{results.targetFund.toLocaleString()} 元</strong>（缺口拉大约 {Math.round((results.targetFund / results.nominalTargetFund - 1) * 100)}%）。
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("backtest")}
            className="self-start md:self-center text-xs font-bold uppercase tracking-tight bg-[#141414] text-[#E4E3E0] hover:bg-slate-800 px-4 py-2.5 border border-[#141414] transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            详情表格 (View Backtest)
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-[#141414] w-full p-0 gap-1.5 bg-transparent overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 text-xs font-extrabold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-[#141414] text-[#E4E3E0] border-t-2 border-r-2 border-l-2 border-[#141414] rounded-t-lg"
                : "bg-white/50 text-[#141414] border-t border-r border-l border-[#141414]/40 hover:bg-white rounded-t-lg"
            }`}
          >
            <ChartIcon className="w-4 h-4" />
            01 / 退休精算主板
          </button>
          <button
            onClick={() => setActiveTab("backtest")}
            className={`px-6 py-3 text-xs font-extrabold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "backtest"
                ? "bg-[#141414] text-[#E4E3E0] border-t-2 border-r-2 border-l-2 border-[#141414] rounded-t-lg"
                : "bg-white/50 text-[#141414] border-t border-r border-l border-[#141414]/40 hover:bg-white rounded-t-lg"
            }`}
          >
            <TableProperties className="w-4 h-4" />
            02 / 十年通胀回测
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-6 py-3 text-xs font-extrabold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "ai"
                ? "bg-[#141414] text-[#E4E3E0] border-t-2 border-r-2 border-l-2 border-[#141414] rounded-t-lg"
                : "bg-white/50 text-[#141414] border-t border-r border-l border-[#141414]/40 hover:bg-white rounded-t-lg"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            03 / AI 财富顾问
          </button>
        </div>

        {/* Dynamic Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Calculation summary metrics cards */}
            <SummaryCards inputs={inputs} results={results} />

            {/* Inputs controls + Projections chart plot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sliders Input */}
              <div className="lg:col-span-4 lg:sticky lg:top-6">
                <PlannerInputs 
                  inputs={inputs} 
                  onChange={setInputs} 
                  averageInflation={DEFAULT_INFLATION_MEAN} 
                />
              </div>

              {/* Svg line chart mapping assets against targets */}
              <div className="lg:col-span-8">
                <PathChart inputs={inputs} results={results} />
              </div>
            </div>

            {/* Educational FIRE Guide Panel */}
            <div className="bg-white border-2 border-[#141414] p-6 md:p-8 space-y-4 relative">
              <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold uppercase tracking-widest border border-[#141414]">
                Reference Context
              </div>
              <h3 className="text-sm font-black uppercase text-[#141414] flex items-center gap-2 pt-2">
                <Info className="w-4 h-4" />
                关于 4% 退休提取回测法则在中国大陆的实践背景与资产应对
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-800 leading-relaxed pt-2">
                <div className="border-t border-[#141414]/20 pt-3">
                  <h4 className="font-bold text-[#141414] mb-2 flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 bg-[#141414] shrink-0" />
                    1. 4% 提取法则 (SWR) 定位
                  </h4>
                  <p className="opacity-80">
                    源自著名的《特里尼蒂研究》(Trinity Study)，指的是在退休初期，每年从蓄水池资产中提取 4% 用作支出目录。
                    只要资产配比维持在妥善的股债平衡状态，资产组合在通胀调整后有极高概率可实现永续或持续 30 年以上，确保退休金不发生断裂。
                  </p>
                </div>
                <div className="border-t border-[#141414]/20 pt-3">
                  <h4 className="font-bold text-[#141414] mb-2 flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 bg-[#141414] shrink-0" />
                    2. 通货膨胀对实际购买力的蚕食
                  </h4>
                  <p className="opacity-80">
                    通货膨胀每年平均以约 {DEFAULT_INFLATION_MEAN}% 的节奏温和蚕食纸币的购买力。
                    10年后若依然固执地以静态 12.00 万元作为标准提取（不增补通胀部分），这 12.00 万元由于物价上升只能购买相当于今天 10.30 万元的实物和服务，生活真实水平将逐年恶化。
                  </p>
                </div>
                <div className="border-t border-[#141414]/20 pt-3">
                  <h4 className="font-bold text-[#141414] mb-2 flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 bg-[#141414] shrink-0" />
                    3. 中国大陆本土化应对策略
                  </h4>
                  <p className="opacity-80">
                    在当前低通胀/低利率周期，大陆本土高收益大额存单不断下滑。退休者应分散配置：高股息沪深300红利资产提供约 4% 利息收益，
                    配合 5 年期长期国债锁定确定收益，辅以基本城镇职工养老保险/医保做底座、补充足额商业重疾保险，并在积累期充分拉满个人养老金年度免税政策空间。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backtest Analysis View */}
        {activeTab === "backtest" && (
          <HistoricalTable 
            averageInflation={DEFAULT_INFLATION_MEAN} 
            highlightedInflation={inputs.inflationRate} 
          />
        )}

        {/* AI Finance Assistant view */}
        {activeTab === "ai" && (
          <AIAssistant 
            inputs={inputs} 
            results={results} 
            averageInflation={DEFAULT_INFLATION_MEAN} 
          />
        )}
      </main>

      {/* Styled Footnote */}
      <footer className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-12 pt-4 border-t border-[#141414]/20 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono opacity-60">
        <span>COMPUTATION LOG: VALIDATED ON-SANDBOX</span>
        <span>SECURITY METRICS: FULL-STACK ACTIVE</span>
        <span>METADATA MODEL ID: RETIRE_PLANNER_2026</span>
      </footer>
    </div>
  );
}
export { DEFAULT_INFLATION_MEAN };
