import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { TaskCard } from '@/components/TaskCard';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  MessageSquare,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import type { Task, Activity } from '@shared/schema';

export default function Dashboard() {
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const { data: activities = [], isLoading: isLoadingActivities } = useQuery<
    Activity[]
  >({
    queryKey: ['/api/activities'],
  });

  const recentTasks = tasks.slice(0, 4);

  // --- Dynamic Stats Calculations ---
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'done'
  ).length;

  const statCards = [
    {
      icon: ListTodo,
      label: 'Total Tasks',
      value: totalTasks,
      color: 'text-primary',
      isLoading: isLoadingTasks,
    },
    {
      icon: TrendingUp,
      label: 'In Progress',
      value: inProgressTasks,
      color: 'text-chart-4',
      isLoading: isLoadingTasks,
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completedTasks,
      color: 'text-chart-2',
      isLoading: isLoadingTasks,
    },
    {
      icon: MessageSquare,
      label: 'Messages', // Using activities count
      value: activities.length,
      color: 'text-chart-3',
      isLoading: isLoadingActivities,
    },
  ];
  // --- End of Dynamic Stats ---

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your tasks today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover-elevate" data-testid={`card-stat-${index}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    {/* Updated to show loading state */}
                    <p
                      className="text-3xl font-bold text-foreground h-9 flex items-center"
                      data-testid={`text-stat-value-${index}`}
                    >
                      {stat.isLoading ? (
                        <span className="h-8 w-12 bg-muted/50 animate-pulse rounded-md inline-block" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Tasks</h2>
          {/* Updated to use isLoadingTasks */}
          {isLoadingTasks ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4 h-32 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}