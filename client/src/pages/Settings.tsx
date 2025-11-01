import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useTheme } from '@/contexts/ThemeContext';
import { Save, User, Mail, Bell, Moon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, type Settings as SettingsType } from '@shared/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function Settings() {
  const { toast } = useToast();
  const { darkMode, setDarkMode } = useTheme();
  const { data: settings } = useQuery<SettingsType>({
    queryKey: ['/api/settings'],
  });

  const form = useForm<SettingsType>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      profileName: '',
      profileEmail: '',
      notifications: true,
      darkMode: false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: (data: SettingsType) =>
      apiRequest('PUT', '/api/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    },
  });

  const onSubmit = (data: SettingsType) => {
    saveMutation.mutate({
      ...data,
      darkMode,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            className="pl-10"
                            placeholder="Enter your full name"
                            data-testid="input-profile-name"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profileEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            className="pl-10"
                            placeholder="Enter your email address"
                            data-testid="input-profile-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Moon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <FormLabel htmlFor="dark-mode" className="cursor-pointer">
                        Dark Mode
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme across the application
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    data-testid="switch-dark-mode"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-chart-3/10">
                          <Bell className="w-5 h-5 text-chart-3" />
                        </div>
                        <div>
                          <FormLabel htmlFor="notifications" className="cursor-pointer">
                            Enable Notifications
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts for tasks and messages
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-notifications"
                      />
                    </div>
                  )}
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              data-testid="button-save-settings"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
}
