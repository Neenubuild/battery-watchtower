
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the hourly load
const generateLoadData = () => {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour - 23 + i + 24) % 24;
    
    // Generate load pattern - higher during day, lower at night
    let load;
    if (hour >= 8 && hour <= 18) {
      // Business hours - higher load
      load = 20 + Math.random() * 30;
    } else if (hour >= 19 && hour <= 22) {
      // Evening - medium load
      load = 15 + Math.random() * 15;
    } else {
      // Night - lower load
      load = 5 + Math.random() * 10;
    }
    
    data.push({
      hour: `${hour}:00`,
      load: parseFloat(load.toFixed(1)),
      isCurrentHour: hour === currentHour
    });
  }
  
  return data.slice(-12); // Show only the last 12 hours
};

export function BatteryLoadChart() {
  const loadData = generateLoadData();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Battery Load (Last 12 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={loadData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}A`}
              />
              <Tooltip 
                formatter={(value) => [`${value}A`, "Load Current"]}
              />
              <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                {loadData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isCurrentHour ? "#f97316" : "#3b82f6"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
