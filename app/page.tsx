"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface PoolData {
  price: number;
  eth: number | null;
  wbtc: number | null;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export default function PoolDistributionChart() {
  const [data, setData] = useState<PoolData[]>([]);
  const activePrice = 27.8424411281;
  const DATA_POINTS = 100; // Variable to control number of data points

  const generatePoolData = () => {
    const data: PoolData[] = [];
    const startPrice = 26.0906695108;
    const endPrice = 28.2631197883;
    const step = (endPrice - startPrice) / DATA_POINTS;

    for (let i = 0; i < DATA_POINTS; i++) {
      const price = startPrice + (step * i);
      const isBeforeActive = price < activePrice;

      // Generate random values between 0.05 and 0.15
      const randomValue = Math.random() * (0.15 - 0.05) + 0.05;

      data.push({
        price,
        // Only set eth value if before active price, null otherwise
        eth: isBeforeActive ? randomValue : null,
        // Only set wbtc value if after active price, null otherwise
        wbtc: !isBeforeActive ? randomValue : null,
      });
    }
    return data;
  };

  const GlassyTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <p className="text-gray-600 text-sm">Price (WBTC/ETH)</p>
        <p className="text-gray-900 font-medium">{Number(label).toFixed(8)}</p>
        {payload[0]?.value && (
          <>
            <p className="text-gray-600 text-sm mt-2">ETH</p>
            <p className="text-emerald-600 font-medium">
              {payload[0]?.value?.toFixed(8)}
            </p>
          </>
        )}
        {payload[1]?.value && (
          <>
            <p className="text-gray-600 text-sm mt-2">WBTC</p>
            <p className="text-purple-600 font-medium">
              {payload[1]?.value?.toFixed(8)}
            </p>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    setData(generatePoolData());
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="w-full p-6 bg-white border border-gray-100">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-gray-900">Pool Distribution</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-gray-600">ETH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-sm text-gray-600">WBTC</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Active Bin: {activePrice} ETH per WBTC
                </div>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  barGap={0}
                  barCategoryGap={0}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="price"
                    tickFormatter={(value) => value.toFixed(8)}
                    fontSize={11}
                    stroke="#94a3b8"
                    interval={Math.floor(DATA_POINTS / 10)}
                  />
                  <YAxis hide />
                  <Tooltip content={<GlassyTooltip />} />
                  <ReferenceLine
                    x={activePrice}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    label={{
                      value: "Active Bin",
                      position: "top",
                      fill: "#64748b",
                      fontSize: 12
                    }}
                  />
                  <Bar
                    dataKey="eth"
                    fill="#10b981"
                    minPointSize={2}
                  />
                  <Bar
                    dataKey="wbtc"
                    fill="#8b5cf6"
                    minPointSize={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}