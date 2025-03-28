
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { Settings, Bell, Smartphone, Wifi } from "lucide-react";
import { fetchSystemConfig, updateSystemConfig } from "@/services/batteryService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the schema for system settings form
const systemSettingsSchema = z.object({
  dataRefreshRate: z.coerce.number().min(30).max(3600),
  cellVoltageMin: z.coerce.number().min(1.5).max(2.5),
  cellVoltageMax: z.coerce.number().min(2.0).max(3.0),
  cellTempMax: z.coerce.number().min(20).max(60),
  stringVoltageMin: z.coerce.number().min(40).max(55),
  stringVoltageMax: z.coerce.number().min(45).max(60),
  currentMax: z.coerce.number().min(10).max(100)
});

// Define schema for notification settings
const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  notificationEmails: z.string().optional(),
  notificationPhones: z.string().optional(),
  alertsWarning: z.boolean(),
  alertsCritical: z.boolean(),
  alertsOffline: z.boolean()
});

// Define schema for communication settings
const communicationSettingsSchema = z.object({
  communicationMode: z.enum(["gprs", "ethernet", "both"]),
  apn: z.string().optional(),
  serverAddress: z.string().url(),
  serverPort: z.coerce.number().min(1).max(65535),
  transmissionInterval: z.coerce.number().min(180).max(86400)
});

const Configuration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("system");
  
  // Fetch system configuration from backend
  const configQuery = useQuery({
    queryKey: ['systemConfig'],
    queryFn: fetchSystemConfig
  });
  
  // System settings form
  const systemForm = useForm<z.infer<typeof systemSettingsSchema>>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      dataRefreshRate: 60,
      cellVoltageMin: 1.95,
      cellVoltageMax: 2.25,
      cellTempMax: 35,
      stringVoltageMin: 48,
      stringVoltageMax: 54,
      currentMax: 30
    }
  });
  
  // Notification settings form
  const notificationForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailEnabled: true,
      smsEnabled: true,
      notificationEmails: "",
      notificationPhones: "",
      alertsWarning: true,
      alertsCritical: true,
      alertsOffline: true
    }
  });
  
  // Communication settings form
  const communicationForm = useForm<z.infer<typeof communicationSettingsSchema>>({
    resolver: zodResolver(communicationSettingsSchema),
    defaultValues: {
      communicationMode: "gprs",
      apn: "internet",
      serverAddress: "https://bms.example.com",
      serverPort: 443,
      transmissionInterval: 300
    }
  });
  
  // Update forms with data from backend when available
  useEffect(() => {
    if (configQuery.data) {
      const config = configQuery.data;
      
      // Update system settings form
      systemForm.reset({
        dataRefreshRate: config.data_refresh_rate,
        cellVoltageMin: config.cell_voltage_min,
        cellVoltageMax: config.cell_voltage_max,
        cellTempMax: config.cell_temp_max,
        stringVoltageMin: config.string_voltage_min,
        stringVoltageMax: config.string_voltage_max,
        currentMax: config.string_current_max
      });
      
      // Update notification settings form
      const emails = config.notification_emails?.join(', ') || '';
      const phones = config.notification_sms?.join(', ') || '';
      
      notificationForm.reset({
        emailEnabled: emails.length > 0,
        smsEnabled: phones.length > 0,
        notificationEmails: emails,
        notificationPhones: phones,
        alertsWarning: true,
        alertsCritical: true,
        alertsOffline: true
      });
    }
  }, [configQuery.data, systemForm, notificationForm]);
  
  // Handle system settings form submission
  const systemSettingsMutation = useMutation({
    mutationFn: (data: z.infer<typeof systemSettingsSchema>) => {
      return updateSystemConfig({
        id: configQuery.data?.id,
        data_refresh_rate: data.dataRefreshRate,
        cell_voltage_min: data.cellVoltageMin,
        cell_voltage_max: data.cellVoltageMax,
        cell_temp_max: data.cellTempMax,
        string_voltage_min: data.stringVoltageMin,
        string_voltage_max: data.stringVoltageMax,
        string_current_max: data.currentMax
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save system settings.",
        variant: "destructive",
      });
    }
  });
  
  const onSystemSubmit = (data: z.infer<typeof systemSettingsSchema>) => {
    systemSettingsMutation.mutate(data);
  };
  
  // Handle notification settings form submission
  const notificationSettingsMutation = useMutation({
    mutationFn: (data: z.infer<typeof notificationSettingsSchema>) => {
      // Parse email and phone lists
      const emailList = data.emailEnabled && data.notificationEmails ? 
        data.notificationEmails.split(',').map(e => e.trim()).filter(e => e) : 
        [];
      
      const phoneList = data.smsEnabled && data.notificationPhones ? 
        data.notificationPhones.split(',').map(p => p.trim()).filter(p => p) : 
        [];
      
      return updateSystemConfig({
        id: configQuery.data?.id,
        notification_emails: emailList,
        notification_sms: phoneList
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
      toast({
        title: "Settings Saved",
        description: "Notification settings have been updated successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    }
  });
  
  const onNotificationSubmit = (data: z.infer<typeof notificationSettingsSchema>) => {
    notificationSettingsMutation.mutate(data);
  };
  
  // Handle communication settings form submission
  const onCommunicationSubmit = (data: z.infer<typeof communicationSettingsSchema>) => {
    console.log("Communication settings:", data);
    toast({
      title: "Settings Saved",
      description: "Communication settings have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="notification">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="communication">
            <Wifi className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Parameters</CardTitle>
              <CardDescription>
                Configure threshold values and system behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...systemForm}>
                <form onSubmit={systemForm.handleSubmit(onSystemSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={systemForm.control}
                        name="dataRefreshRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Refresh Rate (seconds)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              How often data is refreshed in the interface
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">Cell Parameters</h3>
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <FormField
                          control={systemForm.control}
                          name="cellVoltageMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Cell Voltage (V)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={systemForm.control}
                          name="cellVoltageMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Cell Voltage (V)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={systemForm.control}
                          name="cellTempMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Cell Temperature (°C)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">String Parameters</h3>
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <FormField
                          control={systemForm.control}
                          name="stringVoltageMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min String Voltage (V)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={systemForm.control}
                          name="stringVoltageMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max String Voltage (V)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={systemForm.control}
                          name="currentMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Current (A)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={systemSettingsMutation.isPending}>
                    {systemSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notification" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium mb-3">Notification Methods</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormField
                                control={notificationForm.control}
                                name="emailEnabled"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Email Notifications
                                      </FormLabel>
                                      <FormDescription>
                                        Receive alert notifications via email
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
                          </div>
                        </div>
                        
                        {notificationForm.watch("emailEnabled") && (
                          <FormField
                            control={notificationForm.control}
                            name="notificationEmails"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Addresses</FormLabel>
                                <FormControl>
                                  <Input placeholder="email1@example.com, email2@example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Comma-separated list of email addresses
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <FormField
                          control={notificationForm.control}
                          name="smsEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  SMS Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive alert notifications via SMS
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
                        
                        {notificationForm.watch("smsEnabled") && (
                          <FormField
                            control={notificationForm.control}
                            name="notificationPhones"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Numbers</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1234567890, +0987654321" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Comma-separated list of phone numbers with country code
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">Alert Types</h3>
                      <div className="space-y-2">
                        <FormField
                          control={notificationForm.control}
                          name="alertsWarning"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Warning Alerts</FormLabel>
                                <FormDescription>
                                  Parameters outside normal range
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
                          control={notificationForm.control}
                          name="alertsCritical"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Critical Alerts</FormLabel>
                                <FormDescription>
                                  Serious conditions requiring immediate attention
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
                          control={notificationForm.control}
                          name="alertsOffline"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Offline Alerts</FormLabel>
                                <FormDescription>
                                  When devices go offline or lose communication
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
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={notificationSettingsMutation.isPending}>
                    {notificationSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
              <CardDescription>
                Configure how the remote devices communicate with the server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...communicationForm}>
                <form onSubmit={communicationForm.handleSubmit(onCommunicationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={communicationForm.control}
                      name="communicationMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication Mode</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select communication mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gprs">GPRS/GSM</SelectItem>
                              <SelectItem value="ethernet">Ethernet</SelectItem>
                              <SelectItem value="both">Dual Mode (GPRS + Ethernet)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How devices will connect to the server
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {(communicationForm.watch("communicationMode") === "gprs" || 
                     communicationForm.watch("communicationMode") === "both") && (
                      <FormField
                        control={communicationForm.control}
                        name="apn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>APN Settings</FormLabel>
                            <FormControl>
                              <Input placeholder="internet" {...field} />
                            </FormControl>
                            <FormDescription>
                              Access Point Name for mobile data connection
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={communicationForm.control}
                        name="serverAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Server Address</FormLabel>
                            <FormControl>
                              <Input placeholder="https://bms.example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={communicationForm.control}
                        name="serverPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Server Port</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={communicationForm.control}
                      name="transmissionInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Transmission Interval (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            How frequently devices should send data to the server (180s minimum)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuration;
