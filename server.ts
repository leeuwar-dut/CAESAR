import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Mainland China historical CPI inflation rates (2016-2025)
const HISTORICAL_CPI_DATA = [
  { year: 2016, rate: 2.00, label: "2.0%", ref: "国家统计局年度经济数据" },
  { year: 2017, rate: 1.60, label: "1.6%", ref: "国家统计局年度经济数据" },
  { year: 2018, rate: 2.10, label: "2.1%", ref: "国家统计局年度经济数据" },
  { year: 2019, rate: 2.90, label: "2.9%", ref: "国家统计局年度经济数据" },
  { year: 2020, rate: 2.42, label: "2.42%", ref: "国家统计局年度经济数据" },
  { year: 2021, rate: 0.98, label: "0.98%", ref: "国家统计局年度经济数据" },
  { year: 2022, rate: 1.97, label: "1.97%", ref: "国家统计局年度经济数据" },
  { year: 2023, rate: 0.23, label: "0.23%", ref: "国家统计局年度经济数据" },
  { year: 2024, rate: 0.22, label: "0.22%", ref: "国家统计局年度经济数据" },
  { year: 2025, rate: 0.40, label: "0.40%", ref: "国家统计局及统计公报 (估计/初值)" },
];

// API: Get historical inflation items
app.get("/api/inflation-data", (req, res) => {
  const total = HISTORICAL_CPI_DATA.reduce((sum, item) => sum + item.rate, 0);
  const average = parseFloat((total / HISTORICAL_CPI_DATA.length).toFixed(3));
  res.json({
    data: HISTORICAL_CPI_DATA,
    average: average, // 1.492% or approx 1.5%
  });
});

// API: AI Finance Coach
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      res.status(400).json({ error: "消息不能为空" });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        reply: "⚠️ **应用暂未配置 API Key**。您仍可完美使用所有的图形、回测计算器和理财路径规划功能。如果想激活此 AI 智能财务助理，请点击右上角的 **Settings** 并添加 `GEMINI_API_KEY`。"
      });
      return;
    }

    const systemPrompt = `你是一位专注中国大陆财务规划、FIRE (财务自由，提前退休) 运动与资产配置的资深理财顾问。
请根据以下用户输入的财务背景，提供专业、冷静、科学的定制化理财分析、资产配置建议和通胀对冲策略：
---
用户当前家庭年支出：${context?.currentExpenses || 120000} 元
计划退休年限：${context?.yearsToRetire || 10} 年
安全提取率 (SWR)：${context?.withdrawalRate || 4} %
历史回测中国大陆10年通胀均值：${context?.averageInflation || 1.49} %
预估退休后年支出 (经通胀调整)：${context?.futureExpenses || 139140} 元
退休金储蓄目标值：${context?.targetFund || 3478500} 元
预估积累期投资年化收益率：${context?.investmentReturn || 6} %
---
请确保你的回答：
1. 语言亲切、专业、理性、不含销售推销，分析简明扼要。
2. 结合中国大陆的实际情况（如：银行大额存单低利息、国债理财、沪深300红利成长、公募基金、社会基本养老保险/社保、个人养老金制度等）。
3. 务必直接针对用户的具体提问，给出切实可行、脚踏实地的建议（比如：在接下来的 ${context?.yearsToRetire || 10} 年内，每月需要多少储蓄、如何应对通缩/低通胀、资产如何分散、如何安全提取、生息资产配置比例等）。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "AI 顾问暂时离线，请稍后再试: " + (error.message || "") });
  }
});

// Configure Vite middleware or static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
