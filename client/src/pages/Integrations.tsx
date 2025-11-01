import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Link2, Mail, MessageSquare, HardDrive, Calendar, FileText, Video } from 'lucide-react';
import { SiGmail, SiSlack, SiGoogledrive, SiNotion, SiZoom, SiTrello } from 'react-icons/si';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Integration } from '@shared/schema';

const iconMap: Record<string, any> = {
  gmail: SiGmail,
  slack: SiSlack,
  drive: SiGoogledrive,
  notion: SiNotion,
  zoom: SiZoom,
  trello: SiTrello,
  calendar: Calendar,
  docs: FileText,
};

export default function Integrations() {
  const { toast } = useToast();
  const { data: integrations = [], isLoading } = useQuery<Integration[]>({
    queryKey: ['/api/integrations'],
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isConnected }: { id: string; isConnected: boolean }) =>
      apiRequest('PUT', `/api/integrations/${id}`, { isConnected: !isConnected }),
    onMutate: async ({ id, isConnected }) => {
      await queryClient.cancelQueries({ queryKey: ['/api/integrations'] });
      const previousIntegrations = queryClient.getQueryData<Integration[]>(['/api/integrations']);
      
      queryClient.setQueryData<Integration[]>(['/api/integrations'], (old) =>
        (old || []).map((integration) =>
          integration.id === id ? { ...integration, isConnected: !isConnected } : integration
        )
      );
      
      return { previousIntegrations };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['/api/integrations'], context?.previousIntegrations);
      toast({
        title: 'Error',
        description: 'Failed to update integration. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
    onSuccess: () => {
      toast({
        title: 'Integration updated',
        description: 'Connection status has been changed successfully.',
      });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
          Integrations
        </h1>
        <p className="text-muted-foreground">
          Connect your favorite tools and services to streamline your workflow
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 h-48 animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => {
            const IconComponent = iconMap[integration.icon] || Link2;
            
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                data-testid={`integration-${integration.id}`}
              >
                <Card className="p-6 hover-elevate h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    {integration.isConnected && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-chart-2/10 text-chart-2 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Connected</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>

                  <Button
                    variant={integration.isConnected ? 'outline' : 'default'}
                    className="mt-4 w-full"
                    onClick={() =>
                      toggleMutation.mutate({
                        id: integration.id,
                        isConnected: integration.isConnected,
                      })
                    }
                    disabled={toggleMutation.isPending}
                    data-testid={`button-toggle-${integration.id}`}
                  >
                    {integration.isConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
