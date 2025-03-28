
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, BarChart3, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchBatteryBanks } from "@/services/batteryService";
import { generateExcelReport } from "@/services/reportService";

// Schema for historical report form
const historicalReportSchema = z.object({
  batteryBank: z.string().min(1, "Please select a battery bank"),
  dataType: z.string().min(1, "Please select a data type"),
  startDate: z.date(),
  endDate: z.date(),
});

// Schema for daily report form
const dailyReportSchema = z.object({
  date: z.date(),
  batteryBank: z.string().min(1, "Please select a battery bank"),
});

// Schema for monthly report form
const monthlyReportSchema = z.object({
  month: z.date(),
  batteryBank: z.string().min(1, "Please select a battery bank"),
});

// Sample data for charts
const generateSampleData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate random values
    const stringVoltage = 48 + Math.random() * 4; // 48-52V
    const chargerEfficiency = 88 + Math.random() * 7; // 88-95%
    const ambientTemperature = 22 + Math.random() * 8; // 22-30°C
    const stateOfCharge = 70 + Math.random() * 25; // 70-95%
    
    data.push({
      date: format(date, "MMM dd"),
      stringVoltage: parseFloat(stringVoltage.toFixed(2)),
      chargerEfficiency: parseFloat(chargerEfficiency.toFixed(2)),
      ambientTemperature: parseFloat(ambientTemperature.toFixed(1)),
      stateOfCharge: parseFloat(stateOfCharge.toFixed(1)),
    });
  }
  
  return data;
};

// Generate sample monthly data
const generateMonthlyData = (months: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // Generate random values
    const avgStringVoltage = 49 + Math.random() * 2; // 49-51V
    const avgEfficiency = 90 + Math.random() * 5; // 90-95%
    const maxTemperature = 28 + Math.random() * 7; // 28-35°C
    const minStateOfCharge = 65 + Math.random() * 20; // 65-85%
    
    data.push({
      date: format(date, "MMM yyyy"),
      avgStringVoltage: parseFloat(avgStringVoltage.toFixed(2)),
      avgEfficiency: parseFloat(avgEfficiency.toFixed(2)),
      maxTemperature: parseFloat(maxTemperature.toFixed(1)),
      minStateOfCharge: parseFloat(minStateOfCharge.toFixed(1)),
    });
  }
  
  return data;
};

const Reports = () => {
  const { toast } = useToast();
  const [activeReportType, setActiveReportType] = useState<string>("historical");
  const [dailyData] = useState(generateSampleData(30));
  const [monthlyData] = useState(generateMonthlyData(12));
  
  // Fetch battery banks for dropdown
  const bankQuery = useQuery({
    queryKey: ['batteryBanks'],
    queryFn: fetchBatteryBanks
  });
  
  // Mutation for generating reports
  const reportMutation = useMutation({
    mutationFn: (params: { reportType: 'historical' | 'daily' | 'monthly', data: any }) => 
      generateExcelReport(params.reportType, params.data),
    onSuccess: (fileName) => {
      toast({
        title: "Report Generated",
        description: `${fileName} has been downloaded.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Historical report form
  const historicalReportForm = useForm<z.infer<typeof historicalReportSchema>>({
    resolver: zodResolver(historicalReportSchema),
    defaultValues: {
      batteryBank: "",
      dataType: "",
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
    },
  });
  
  // Daily report form
  const dailyReportForm = useForm<z.infer<typeof dailyReportSchema>>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      date: new Date(),
      batteryBank: "",
    },
  });
  
  // Monthly report form
  const monthlyReportForm = useForm<z.infer<typeof monthlyReportSchema>>({
    resolver: zodResolver(monthlyReportSchema),
    defaultValues: {
      month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      batteryBank: "",
    },
  });
  
  const onHistoricalReportSubmit = (values: z.infer<typeof historicalReportSchema>) => {
    reportMutation.mutate({
      reportType: 'historical',
      data: {
        batteryBank: values.batteryBank,
        dataType: values.dataType,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString()
      }
    });
  };
  
  const onDailyReportSubmit = (values: z.infer<typeof dailyReportSchema>) => {
    reportMutation.mutate({
      reportType: 'daily',
      data: {
        batteryBank: values.batteryBank,
        date: values.date.toISOString()
      }
    });
  };
  
  const onMonthlyReportSubmit = (values: z.infer<typeof monthlyReportSchema>) => {
    reportMutation.mutate({
      reportType: 'monthly',
      data: {
        batteryBank: values.batteryBank,
        month: values.month.toISOString()
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      </div>
      
      <Tabs value={activeReportType} onValueChange={setActiveReportType}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="historical">
            <BarChart3 className="h-4 w-4 mr-2" />
            Historical
          </TabsTrigger>
          <TabsTrigger value="daily">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <FileText className="h-4 w-4 mr-2" />
            Monthly
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="historical" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Report</CardTitle>
              <CardDescription>
                Generate a historical report for a specific time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...historicalReportForm}>
                <form onSubmit={historicalReportForm.handleSubmit(onHistoricalReportSubmit)} className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <FormField
                      control={historicalReportForm.control}
                      name="batteryBank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery Bank</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select battery bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bankQuery.isLoading ? (
                                <SelectItem value="loading" disabled>Loading banks...</SelectItem>
                              ) : bankQuery.error ? (
                                <SelectItem value="error" disabled>Error loading banks</SelectItem>
                              ) : (
                                <>
                                  <SelectItem value="all">All Battery Banks</SelectItem>
                                  {bankQuery.data?.map(bank => (
                                    <SelectItem key={bank.id} value={bank.id}>
                                      {bank.name} ({bank.location})
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={historicalReportForm.control}
                      name="dataType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select data type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="voltage">Voltage</SelectItem>
                              <SelectItem value="current">Current</SelectItem>
                              <SelectItem value="temperature">Temperature</SelectItem>
                              <SelectItem value="stateOfCharge">State of Charge</SelectItem>
                              <SelectItem value="all">All Parameters</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={historicalReportForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("2020-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={historicalReportForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("2020-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <Button 
                      type="submit" 
                      disabled={reportMutation.isPending}
                    >
                      {reportMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Report"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
              <CardDescription>
                Historical data trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" domain={[40, 60]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="stringVoltage"
                      name="String Voltage (V)"
                      stroke="#F26522"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="stateOfCharge"
                      name="State of Charge (%)"
                      stroke="#4CAF50"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Report</CardTitle>
              <CardDescription>
                Generate a detailed report for a specific day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...dailyReportForm}>
                <form onSubmit={dailyReportForm.handleSubmit(onDailyReportSubmit)} className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <FormField
                      control={dailyReportForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Select Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("2020-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dailyReportForm.control}
                      name="batteryBank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery Bank</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select battery bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bankQuery.isLoading ? (
                                <SelectItem value="loading" disabled>Loading banks...</SelectItem>
                              ) : bankQuery.error ? (
                                <SelectItem value="error" disabled>Error loading banks</SelectItem>
                              ) : (
                                <>
                                  <SelectItem value="all">All Battery Banks</SelectItem>
                                  {bankQuery.data?.map(bank => (
                                    <SelectItem key={bank.id} value={bank.id}>
                                      {bank.name} ({bank.location})
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <Button 
                      type="submit" 
                      disabled={reportMutation.isPending}
                    >
                      {reportMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Report"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Data Visualization</CardTitle>
              <CardDescription>
                24-hour data trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={generateSampleData(24).map((item, index) => ({
                      ...item,
                      date: `${index}:00`,
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" domain={[45, 55]} />
                    <YAxis yAxisId="right" orientation="right" domain={[15, 40]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="stringVoltage"
                      name="String Voltage (V)"
                      stroke="#F26522"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ambientTemperature"
                      name="Temperature (°C)"
                      stroke="#2196F3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
              <CardDescription>
                Generate a monthly summary report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...monthlyReportForm}>
                <form onSubmit={monthlyReportForm.handleSubmit(onMonthlyReportSubmit)} className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <FormField
                      control={monthlyReportForm.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Select Month</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "MMMM yyyy")
                                  ) : (
                                    <span>Pick a month</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("2020-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={monthlyReportForm.control}
                      name="batteryBank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery Bank</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select battery bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bankQuery.isLoading ? (
                                <SelectItem value="loading" disabled>Loading banks...</SelectItem>
                              ) : bankQuery.error ? (
                                <SelectItem value="error" disabled>Error loading banks</SelectItem>
                              ) : (
                                <>
                                  <SelectItem value="all">All Battery Banks</SelectItem>
                                  {bankQuery.data?.map(bank => (
                                    <SelectItem key={bank.id} value={bank.id}>
                                      {bank.name} ({bank.location})
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <Button 
                      type="submit" 
                      disabled={reportMutation.isPending}
                    >
                      {reportMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Report"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Data Visualization</CardTitle>
              <CardDescription>
                12-month data trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" domain={[48, 52]} />
                    <YAxis yAxisId="right" orientation="right" domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgStringVoltage"
                      name="Avg. String Voltage (V)"
                      stroke="#F26522"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgEfficiency"
                      name="Avg. Efficiency (%)"
                      stroke="#4CAF50"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
