import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@shared/schema';
import { useSearchStore } from '@/lib/searchStore';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-muted' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-chart-4/10' },
  { id: 'done', title: 'Done', color: 'bg-chart-2/10' },
];

export default function Boards() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { searchTerm } = useSearchStore();

  // 1. Define the specific status type from your Task schema
  type TaskStatus = Task['status'];

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/tasks/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['/api/tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['/api/tasks']);
      queryClient.setQueryData<Task[]>(['/api/tasks'], (old) =>
        (old || []).filter((task: Task) => task.id !== id)
      );
      return { previousTasks };
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['/api/tasks'], context?.previousTasks);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onSuccess: () => {
      toast({
        title: 'Task deleted',
        description: 'The task has been removed successfully.',
      });
    },
  });

  const updateStatusMutation = useMutation({
    // 2. Use the specific TaskStatus type instead of 'string'
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      apiRequest('PUT', `/api/tasks/${id}`, { status }),
    onMutate: async ({ id, status }: { id: string; status: TaskStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['/api/tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['/api/tasks']);
      queryClient.setQueryData<Task[]>(['/api/tasks'], (old) =>
        (old || []).map((task: Task) =>
          task.id === id ? { ...task, status } : task
        )
      );
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['/api/tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
  });

  const getTasksByStatus = (status: string) => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    return tasks.filter((task) => {
      const statusMatch = task.status === status;
      if (!statusMatch) return false;
      if (!searchTerm) return true;
      const titleMatch = (task.title || '')
        .toLowerCase()
        .includes(lowerCaseSearch);
      const descriptionMatch = (task.description || '')
        .toLowerCase()
        .includes(lowerCaseSearch);
      return titleMatch || descriptionMatch;
    });
  };

  const handleTaskClick = (task: Task) => {
    // 3. Type the statusOrder array to ensure nextStatus is TaskStatus
    const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateStatusMutation.mutate({ id: task.id, status: nextStatus });
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Boards
          </h1>
          <p className="text-muted-foreground">
            Organize and track your tasks with Kanban boards
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          data-testid="button-add-task"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column, colIndex) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    {column.title}
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <Card className={`p-4 min-h-[400px] ${column.color}`} data-testid={`column-${column.id}`}>
                <div className="space-y-3">
                  {isLoading ? (
                    <>
                      {[1, 2].map((i) => (
                        <Card key={i} className="p-4 h-32 animate-pulse bg-muted" />
                      ))}
                    </>
                  ) : columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <div key={task.id} className="group relative">
                        <TaskCard task={task} onClick={() => handleTaskClick(task)} />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(task.id);
                          }}
                          data-testid={`button-delete-task-${task.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                      {searchTerm
                        ? 'No tasks match search'
                        : 'No tasks in this column'}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}