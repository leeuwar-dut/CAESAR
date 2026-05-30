import React from "react";
import { HISTORICAL_CPI_DATA, SOURCE_NOTES } from "../data";
import { TrendingUp, Award, Activity, Percent } from "lucide-react";

interface Props {
  averageInflation: number;
  highlightedInflation: number;
}

export default function HistoricalTable({ averageInflation, highlightedInflation }: Props) {
  return (
    <div className="bg-white border-2 border-[#141414] p-6 md:p-8 relative" id="historical-inflation-panel">
      <div className="absolute -top-3.5 left-4 bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
        02 / BACKTEST DATA
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 pt-2">
        <div>
          <h2 className="text-sm font-black uppercase text-[#141414] flex items-center gap-2">
            <Activity className="w-4 h-4" />
            中国大陆近10年通货膨胀率 (CPI) 数据回测
          </h2>
          <p className="text-slate-550 text-xs mt-1">
            采用国家统计局 (NBS) 的核心 CPI 指数作为历史事实校准，计算长线的物价偏离总数。
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#141414] text-[#E4E3E0] border border-[#141414] px-4 py-2 shrink-0 font-mono text-[11px] font-bold uppercase tracking-tight">
          <span>10-Year CPI Arithmetic Mean:</span>
          <span className="underline underline-offset-4 decoration-2 text-white">{averageInflation}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="space-y-6">
            <div className="p-5 bg-white border border-[#141414] relative">
              <div className="absolute -top-2.5 left-3 bg-white px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-[#141414]">
                Methodology
              </div>
              <h3 className="font-extrabold text-[#141414] text-xs flex items-center gap-1 uppercase mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                通胀均值计算口径
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                通胀系数均值采用 2016 年至 2025 年官方发布的 CPI 比上年涨跌幅度的算术平均值。
                历史均值为 <strong>{averageInflation}%</strong>。
                意味着过去 10 年，纸币购买力平均每年贬损该比例，构成了不可忽视的退休财富抗通胀损耗。
              </p>
            </div>

            <div className="p-5 bg-[#E4E3E0] border border-[#141414] relative">
              <div className="absolute -top-2.5 left-3 bg-[#141414] text-[#E4E3E0] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-[#141414]">
                Calculation Result
              </div>
              <h3 className="font-extrabold text-[#141414] text-xs flex items-center gap-1 uppercase mb-2">
                <Award className="w-3.5 h-3.5" />
                复利变动规律
              </h3>
              <p className="text-xs text-slate-850 leading-relaxed">
                家庭当前 12.00 万元的支出，滚存 10 次未来（按照年均 <strong>{highlightedInflation}%</strong> 估值），
                累计发生物价复利折弯约为 <strong>{(Math.pow(1 + highlightedInflation / 100, 10)).toFixed(3)} 倍</strong>。
                10年后需准备名义支出 <strong>{Math.round(12 * Math.pow(1 + highlightedInflation / 100, 10)).toFixed(2)} 万元</strong> 才能享受同质等效的货真财富标准。
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-50 p-3 border border-[#141414]/20">
            * NOTE: {SOURCE_NOTES}
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="overflow-hidden border-2 border-[#141414]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#141414] text-[#E4E3E0]">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-tight text-[10px] border-b border-[#141414] font-mono">年份 (Year)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-tight text-[10px] text-right border-b border-[#141414] font-mono">居民消费物价指数变动率 (NBS Index)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-tight text-[10px] text-center border-b border-[#141414] font-mono">偏离权重棒</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-tight text-[10px] text-right border-b border-[#141414] font-mono">数据归档</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414] text-[#141414]">
                {HISTORICAL_CPI_DATA.map((item, index) => {
                  const isLow = item.rate < 1.0;
                  const isHigh = item.rate >= 2.4;
                  return (
                    <tr 
                      key={item.year} 
                      className={`hover:bg-[#E4E3E0]/30 transition-colors ${
                        item.year === 2025 ? "bg-[#E4E3E0] font-black" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs flex items-center gap-1.5 focus:outline-none">
                        {item.year}
                        {item.year === 2025 && (
                          <span className="text-[8px] bg-[#141414] text-white px-1.5 py-0.5 border border-[#141414] font-mono font-bold uppercase tracking-wider">
                            LATEST
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={`inline-block px-1.5 py-0.5 ${
                          isLow ? "text-slate-600 font-normal" : isHigh ? "text-red-700 underline font-black" : "text-black font-semibold"
                        }`}>
                          {item.rate > 0 ? `+${item.rate.toFixed(2)}%` : `${item.rate.toFixed(2)}%`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24 mx-auto bg-[#E4E3E0] border border-[#141414] h-2.5 overflow-hidden">
                          <div 
                            className={`h-full ${
                              isHigh ? "bg-red-650" : isLow ? "bg-slate-500" : "bg-[#141414]"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, (item.rate / 3.5) * 100))}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-right font-mono text-[9px] uppercase">
                        {item.ref}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
