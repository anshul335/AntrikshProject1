import { motion } from 'framer-motion';
import { Clock, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@shared/schema';

const priorityColors = {
  low: 'bg-chart-2 text-white',
  medium: 'bg-chart-4 text-white',
  high: 'bg-destructive text-destructive-foreground',
};

const statusLabels = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      data-testid={`card-task-${task.id}`}
    >
      <Card 
        className="p-4 cursor-pointer hover-elevate active-elevate-2"
        onClick={onClick}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-card-foreground flex-1" data-testid={`text-task-title-${task.id}`}>
              {task.title}
            </h3>
            <Badge className={`${priorityColors[task.priority]} text-xs`}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            <Badge variant="secondary" className="text-xs">
              {statusLabels[task.status]}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
