import { CPIItem } from "./types";

export const HISTORICAL_CPI_DATA: CPIItem[] = [
  { year: 2016, rate: 2.00, label: "2.0%", ref: "国家统计局年度经济数据" },
  { year: 2017, rate: 1.60, label: "1.6%", ref: "国家统计局年度经济数据" },
  { year: 2018, rate: 2.10, label: "2.1%", ref: "国家统计局年度经济数据" },
  { year: 2019, rate: 2.90, label: "2.9%", ref: "国家统计局年度经济数据" },
  { year: 2020, rate: 2.42, label: "2.42%", ref: "国家统计局年度经济数据" },
  { year: 2021, rate: 0.98, label: "0.98%", ref: "国家统计局年度经济数据" },
  { year: 2022, rate: 1.97, label: "1.97%", ref: "国家统计局年度经济数据" },
  { year: 2023, rate: 0.23, label: "0.23%", ref: "国家统计局年度经济数据" },
  { year: 2024, rate: 0.22, label: "0.22%", ref: "国家统计局年度经济数据" },
  { year: 2025, rate: 0.40, label: "0.40%", ref: "国家统计局统计指标/公报" },
];

export const DEFAULT_INFLATION_MEAN = 1.492; // 14.92 / 10
export const SOURCE_NOTES = "数据主要来源于中华人民共和国国家统计局 (NBS) 年度居民消费价格指数 (CPI) 数据。2025年数据结合最新国家及地方统计发展公报估算值。";
