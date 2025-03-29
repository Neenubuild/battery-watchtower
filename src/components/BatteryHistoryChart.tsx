
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the chart
const generateHistoricalData = (days = 7, dataType = "voltage") => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    let value;
    if (dataType === "voltage") {
      // Voltage between 48-52V with some fluctuation
      value = 48 + Math.random() * 4;
    } else if (dataType === "temperature") {
      // Temperature between 20-30°C with some fluctuation
      value = 20 + Math.random() * 10;
    } else if (dataType === "soc") {
      // State of Charge between 70-100% with some decline
      value = 100 - (i * 3) - (Math.random() * 5);
      value = Math.max(70, value);
    }
    
    data.push({
      date: date.toLocaleDateString(),
      value: parseFloat(value?.toFixed(2) || "0"),
    });
  }
  
  return data;
};

interface BatteryHistoryChartProps {
  bankId?: string;
  className?: string;
}

export function BatteryHistoryChart({ bankId, className }: BatteryHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const [dataType, setDataType] = useState<"voltage" | "temperature" | "soc">("voltage");
  
  const chartData = generateHistoricalData(
    timeRange === "week" ? 7 : 30,
    dataType
  );
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Battery History</CardTitle>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Tabs defaultValue="voltage" onValueChange={(v) => setDataType(v as any)}>
              <TabsList className="h-8">
                <TabsTrigger value="voltage" className="text-xs px-2">Voltage</TabsTrigger>
                <TabsTrigger value="temperature" className="text-xs px-2">Temperature</TabsTrigger>
                <TabsTrigger value="soc" className="text-xs px-2">State of Charge</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-2">
          <Tabs defaultValue="week" onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList className="h-7">
              <TabsTrigger value="week" className="text-xs px-2">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                tickFormatter={(value) => {
                  // Show fewer tick labels on small screens
                  const date = new Date(value);
                  return date.getDate().toString();
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (dataType === "voltage") return `${value}V`;
                  if (dataType === "temperature") return `${value}°C`;
                  return `${value}%`;
                }}
                domain={
                  dataType === "voltage" ? [48, 52] :
                  dataType === "temperature" ? [20, 35] :
                  [60, 100]
                }
              />
              <Tooltip 
                formatter={(value) => {
                  if (dataType === "voltage") return [`${value}V`, "Voltage"];
                  if (dataType === "temperature") return [`${value}°C`, "Temperature"];
                  return [`${value}%`, "State of Charge"];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#f97316" 
                fill="url(#colorValue)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
