import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, ListPlus, MailOpen } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@shared/schema';

export default function Inbox() {
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/messages/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['/api/messages'] });
      const previousMessages = queryClient.getQueryData<Message[]>(['/api/messages']);
      queryClient.setQueryData<Message[]>(['/api/messages'], (old) =>
        (old || []).filter((message) => message.id !== id)
      );
      return { previousMessages };
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['/api/messages'], context?.previousMessages);
      toast({
        title: 'Error',
        description: 'Failed to delete message. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onSuccess: () => {
      toast({
        title: 'Message deleted',
        description: 'The message has been removed from your inbox.',
      });
    },
  });

  const convertMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/messages/${id}/convert`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['/api/messages'] });
      await queryClient.cancelQueries({ queryKey: ['/api/tasks'] });
      const previousMessages = queryClient.getQueryData<Message[]>(['/api/messages']);
      const previousTasks = queryClient.getQueryData(['/api/tasks']);
      
      const message = (previousMessages || []).find(m => m.id === id);
      
      queryClient.setQueryData<Message[]>(['/api/messages'], (old) =>
        (old || []).filter((message) => message.id !== id)
      );
      
      if (message) {
        const optimisticTask = {
          id: 'temp-' + Date.now(),
          title: message.subject,
          description: message.content,
          priority: 'medium' as const,
          status: 'todo' as const,
          createdAt: new Date().toISOString(),
        };
        
        queryClient.setQueryData(['/api/tasks'], (old: any) =>
          [...(old || []), optimisticTask]
        );
      }
      
      return { previousMessages, previousTasks };
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['/api/messages'], context?.previousMessages);
      queryClient.setQueryData(['/api/tasks'], context?.previousTasks);
      toast({
        title: 'Error',
        description: 'Failed to convert message. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onSuccess: () => {
      toast({
        title: 'Converted to task',
        description: 'Message has been converted to a task successfully.',
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
          Inbox
        </h1>
        <p className="text-muted-foreground">
          Manage your messages and convert them to tasks
        </p>
      </motion.div>

      <div className="max-w-4xl">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 h-40 animate-pulse bg-muted" />
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                data-testid={`message-${message.id}`}
              >
                <Card className={`p-6 hover-elevate ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${message.isRead ? 'bg-muted' : 'bg-primary/10'}`}>
                          {message.isRead ? (
                            <MailOpen className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Mail className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground" data-testid={`text-message-sender-${message.id}`}>
                              {message.sender}
                            </p>
                            {!message.isRead && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-foreground mb-2">
                            {message.subject}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {message.preview}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => convertMutation.mutate(message.id)}
                        disabled={convertMutation.isPending}
                        data-testid={`button-convert-${message.id}`}
                      >
                        <ListPlus className="w-4 h-4 mr-2" />
                        Convert to Task
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMutation.mutate(message.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${message.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No messages</h3>
            <p className="text-sm text-muted-foreground">
              Your inbox is empty. New messages will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
