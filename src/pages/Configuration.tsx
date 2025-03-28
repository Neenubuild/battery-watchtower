import { useState } from "react";
import { useBatteryData } from "@/hooks/useBatteryData";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { Settings, Bell, Smartphone, Wifi } from "lucide-react";

// Define the schema for system settings form
const systemSettingsSchema = z.object({
  dataRefreshRate: z.string().min(1, "Refresh rate is required"),
  smsAlertEnabled: z.boolean().default(true),
  emailAlertEnabled: z.boolean().default(true),
  buzzerEnabled: z.boolean().default(true),
  timeZone: z.string().min(1, "Time zone is required"),
  dataRetentionDays: z.string().min(1, "Data retention period is required"),
});

// Define the schema for alert thresholds
const alertThresholdsSchema = z.object({
  highStringVoltage: z.string().min(1, "Threshold is required"),
  lowStringVoltage: z.string().min(1, "Threshold is required"),
  highStringCurrent: z.string().min(1, "Threshold is required"),
  highCellTemperature: z.string().min(1, "Threshold is required"),
  lowCellVoltage: z.string().min(1, "Threshold is required"),
  highCellVoltage: z.string().min(1, "Threshold is required"),
  highAmbientTemperature: z.string().min(1, "Threshold is required"),
});

// Define the schema for communication settings
const communicationSettingsSchema = z.object({
  ipAddress: z.string().min(1, "IP address is required"),
  port: z.string().min(1, "Port is required"),
  apn: z.string().min(1, "APN is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  serverUrl: z.string().url("Please enter a valid URL"),
  uploadInterval: z.string().min(1, "Upload interval is required"),
});

// Define the schema for SMS alert settings
const smsAlertSettingsSchema = z.object({
  phone1: z.string().min(10, "Phone number must be at least 10 digits"),
  phone2: z.string().optional(),
  phone3: z.string().optional(),
  phone4: z.string().optional(),
  phone5: z.string().optional(),
});

const Configuration = () => {
  const { toast } = useToast();
  const { data } = useBatteryData();
  const [activeTab, setActiveTab] = useState("system");
  
  // System settings form
  const systemSettingsForm = useForm<z.infer<typeof systemSettingsSchema>>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      dataRefreshRate: "10",
      smsAlertEnabled: true,
      emailAlertEnabled: true,
      buzzerEnabled: true,
      timeZone: "UTC+05:30",
      dataRetentionDays: "90",
    },
  });
  
  // Alert thresholds form
  const alertThresholdsForm = useForm<z.infer<typeof alertThresholdsSchema>>({
    resolver: zodResolver(alertThresholdsSchema),
    defaultValues: {
      highStringVoltage: "52.5",
      lowStringVoltage: "44.0",
      highStringCurrent: "30.0",
      highCellTemperature: "35.0",
      lowCellVoltage: "1.95",
      highCellVoltage: "2.25",
      highAmbientTemperature: "40.0",
    },
  });
  
  // Communication settings form
  const communicationSettingsForm = useForm<z.infer<typeof communicationSettingsSchema>>({
    resolver: zodResolver(communicationSettingsSchema),
    defaultValues: {
      ipAddress: "192.168.1.100",
      port: "8080",
      apn: "internet",
      username: "",
      password: "",
      serverUrl: "https://cloud.scope.com/api/data",
      uploadInterval: "300",
    },
  });
  
  // SMS alert settings form
  const smsAlertSettingsForm = useForm<z.infer<typeof smsAlertSettingsSchema>>({
    resolver: zodResolver(smsAlertSettingsSchema),
    defaultValues: {
      phone1: "9876543210",
      phone2: "",
      phone3: "",
      phone4: "",
      phone5: "",
    },
  });
  
  const onSystemSettingSubmit = (values: z.infer<typeof systemSettingsSchema>) => {
    console.log("System settings:", values);
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };
  
  const onAlertThresholdsSubmit = (values: z.infer<typeof alertThresholdsSchema>) => {
    console.log("Alert thresholds:", values);
    toast({
      title: "Thresholds Saved",
      description: "Alert thresholds have been updated successfully.",
    });
  };
  
  const onCommunicationSettingsSubmit = (values: z.infer<typeof communicationSettingsSchema>) => {
    console.log("Communication settings:", values);
    toast({
      title: "Settings Saved",
      description: "Communication settings have been updated successfully.",
    });
  };
  
  const onSmsAlertSettingsSubmit = (values: z.infer<typeof smsAlertSettingsSchema>) => {
    console.log("SMS alert settings:", values);
    toast({
      title: "Settings Saved",
      description: "SMS alert contacts have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configuration</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="alert">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="communication">
            <Wifi className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="sms">
            <Smartphone className="h-4 w-4 mr-2" />
            SMS Contacts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure general system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...systemSettingsForm}>
                <form onSubmit={systemSettingsForm.handleSubmit(onSystemSettingSubmit)} className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <FormField
                      control={systemSettingsForm.control}
                      name="dataRefreshRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Refresh Rate (seconds)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" max="3600" />
                          </FormControl>
                          <FormDescription>
                            How often to refresh the data display
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={systemSettingsForm.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Zone</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC+00:00">UTC+00:00</SelectItem>
                              <SelectItem value="UTC+05:30">UTC+05:30 (IST)</SelectItem>
                              <SelectItem value="UTC+05:45">UTC+05:45 (NPT)</SelectItem>
                              <SelectItem value="UTC+06:00">UTC+06:00 (BST)</SelectItem>
                              <SelectItem value="UTC+06:30">UTC+06:30 (MMT)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={systemSettingsForm.control}
                      name="dataRetentionDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Retention Period (days)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" max="3650" />
                          </FormControl>
                          <FormDescription>
                            How long to keep historical data
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    
                    <FormField
                      control={systemSettingsForm.control}
                      name="smsAlertEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>SMS Alerts</FormLabel>
                            <FormDescription>
                              Enable SMS alerts for critical events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={systemSettingsForm.control}
                      name="emailAlertEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Email Alerts</FormLabel>
                            <FormDescription>
                              Enable email alerts for critical events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={systemSettingsForm.control}
                      name="buzzerEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Local Buzzer</FormLabel>
                            <FormDescription>
                              Enable on-site audible alerts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save System Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alert" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>
                Configure thresholds for various system alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...alertThresholdsForm}>
                <form onSubmit={alertThresholdsForm.handleSubmit(onAlertThresholdsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">String Level Alerts</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <FormField
                        control={alertThresholdsForm.control}
                        name="highStringVoltage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High String Voltage (V)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertThresholdsForm.control}
                        name="lowStringVoltage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Low String Voltage (V)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertThresholdsForm.control}
                        name="highStringCurrent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High String Current (A)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Cell Level Alerts</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <FormField
                        control={alertThresholdsForm.control}
                        name="highCellVoltage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High Cell Voltage (V)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertThresholdsForm.control}
                        name="lowCellVoltage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Low Cell Voltage (V)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertThresholdsForm.control}
                        name="highCellTemperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High Cell Temperature (°C)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Environment Alerts</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <FormField
                        control={alertThresholdsForm.control}
                        name="highAmbientTemperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High Ambient Temperature (°C)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Alert Thresholds</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
              <CardDescription>
                Configure network and data transmission settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...communicationSettingsForm}>
                <form onSubmit={communicationSettingsForm.handleSubmit(onCommunicationSettingsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Network Configuration</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={communicationSettingsForm.control}
                        name="ipAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IP Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={communicationSettingsForm.control}
                        name="port"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Port</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1" max="65535" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">GSM/GPRS Configuration</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={communicationSettingsForm.control}
                        name="apn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>APN</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={communicationSettingsForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={communicationSettingsForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Transmission</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={communicationSettingsForm.control}
                        name="serverUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Server URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={communicationSettingsForm.control}
                        name="uploadInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Interval (seconds)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="180" max="86400" />
                            </FormControl>
                            <FormDescription>
                              Minimum 180s, Maximum 86400s (24 hours)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Communication Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Alert Contacts</CardTitle>
              <CardDescription>
                Configure mobile numbers for SMS alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...smsAlertSettingsForm}>
                <form onSubmit={smsAlertSettingsForm.handleSubmit(onSmsAlertSettingsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={smsAlertSettingsForm.control}
                      name="phone1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Contact (Required)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mobile number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smsAlertSettingsForm.control}
                      name="phone2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact 2</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mobile number (optional)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smsAlertSettingsForm.control}
                      name="phone3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact 3</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mobile number (optional)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smsAlertSettingsForm.control}
                      name="phone4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact 4</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mobile number (optional)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smsAlertSettingsForm.control}
                      name="phone5"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact 5</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mobile number (optional)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save SMS Contacts</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                SMS alerts will be sent to these contacts when critical thresholds are breached.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuration;
