import { 
  type Task, 
  type InsertTask, 
  type Message, 
  type InsertMessage,
  type Integration,
  type Activity,
  type Settings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Messages
  getMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: string): Promise<boolean>;
  convertMessageToTask(id: string): Promise<Task | undefined>;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  createActivity(action: string, description: string): Promise<Activity>;
  
  // Integrations
  getIntegrations(): Promise<Integration[]>;
  updateIntegration(id: string, data: Partial<Integration>): Promise<Integration | undefined>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(data: Partial<Settings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private messages: Map<string, Message>;
  private activities: Activity[];
  private integrations: Map<string, Integration>;
  private settings: Settings;

  constructor() {
    this.tasks = new Map();
    this.messages = new Map();
    this.activities = [];
    this.integrations = new Map();
    this.settings = {
      darkMode: false,
      notifications: true,
      profileName: 'Ankit Kumar',
      profileEmail: 'ankit@antriksh.com',
    };
    
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize tasks
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design new dashboard layout',
        description: 'Create wireframes and mockups for the updated dashboard interface',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Review pull requests',
        description: 'Review and approve pending pull requests from the team',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Document the new API endpoints and authentication flow',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Fix authentication bug',
        description: 'Resolve the issue with session timeout on mobile devices',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Deploy to production',
        description: 'Deploy the latest release to production environment',
        priority: 'medium',
        status: 'done',
        createdAt: new Date().toISOString(),
      },
    ];
    
    mockTasks.forEach(task => this.tasks.set(task.id, task));

    // Initialize messages
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'Sarah Chen',
        subject: 'Q4 Planning Meeting',
        preview: 'Hi team, let\'s schedule a meeting to discuss Q4 planning and objectives...',
        content: 'Hi team, let\'s schedule a meeting to discuss Q4 planning and objectives. Please share your availability for next week.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
      },
      {
        id: '2',
        sender: 'Mike Johnson',
        subject: 'API Integration Update',
        preview: 'The new payment gateway integration is ready for testing...',
        content: 'The new payment gateway integration is ready for testing. I\'ve deployed it to staging environment.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isRead: false,
      },
      {
        id: '3',
        sender: 'Emma Wilson',
        subject: 'Design System v2.0',
        preview: 'I\'ve updated the design system with new components and patterns...',
        content: 'I\'ve updated the design system with new components and patterns. Check out the Figma file for details.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
    ];
    
    mockMessages.forEach(msg => this.messages.set(msg.id, msg));

    // Initialize activities
    this.activities = [
      {
        id: '1',
        action: 'Task Created',
        description: 'Created "Design new dashboard layout"',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        action: 'Task Completed',
        description: 'Completed "Deploy to production"',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        action: 'Message Received',
        description: 'New message from Sarah Chen',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        action: 'Integration Connected',
        description: 'Connected Gmail integration',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Initialize integrations
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Gmail',
        description: 'Connect your Gmail account to sync emails and create tasks from messages',
        icon: 'gmail',
        isConnected: true,
      },
      {
        id: '2',
        name: 'Slack',
        description: 'Integrate Slack to receive notifications and manage tasks from channels',
        icon: 'slack',
        isConnected: false,
      },
      {
        id: '3',
        name: 'Google Drive',
        description: 'Access and attach files from Google Drive to your tasks',
        icon: 'drive',
        isConnected: true,
      },
      {
        id: '4',
        name: 'Notion',
        description: 'Sync your Notion pages and databases with tasks',
        icon: 'notion',
        isConnected: false,
      },
      {
        id: '5',
        name: 'Zoom',
        description: 'Schedule and join Zoom meetings directly from tasks',
        icon: 'zoom',
        isConnected: false,
      },
      {
        id: '6',
        name: 'Trello',
        description: 'Import boards and cards from Trello',
        icon: 'trello',
        isConnected: false,
      },
    ];
    
    mockIntegrations.forEach(int => this.integrations.set(int.id, int));
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(id, task);
    await this.createActivity('Task Created', `Created "${task.title}"`);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    await this.createActivity('Task Updated', `Updated "${task.title}"`);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task) return false;
    
    this.tasks.delete(id);
    await this.createActivity('Task Deleted', `Deleted "${task.title}"`);
    return true;
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { ...insertMessage, id };
    this.messages.set(id, message);
    await this.createActivity('Message Received', `New message from ${message.sender}`);
    return message;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;
    
    this.messages.delete(id);
    await this.createActivity('Message Deleted', `Deleted message from ${message.sender}`);
    return true;
  }

  async convertMessageToTask(id: string): Promise<Task | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const task = await this.createTask({
      title: message.subject,
      description: message.content,
      priority: 'medium',
      status: 'todo',
    });
    
    this.messages.delete(id);
    await this.createActivity('Message Converted', `Converted message to task: "${task.title}"`);
    return task;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return this.activities.slice(-10).reverse();
  }

  async createActivity(action: string, description: string): Promise<Activity> {
    const activity: Activity = {
      id: randomUUID(),
      action,
      description,
      timestamp: new Date().toISOString(),
    };
    this.activities.push(activity);
    return activity;
  }

  // Integration methods
  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async updateIntegration(id: string, data: Partial<Integration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updated = { ...integration, ...data };
    this.integrations.set(id, updated);
    
    const action = updated.isConnected ? 'Integration Connected' : 'Integration Disconnected';
    await this.createActivity(action, `${action.split(' ')[1]} ${updated.name}`);
    return updated;
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    this.settings = { ...this.settings, ...data };
    await this.createActivity('Settings Updated', 'Updated preferences');
    return this.settings;
  }
}

export const storage = new MemStorage();
