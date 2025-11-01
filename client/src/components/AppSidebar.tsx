import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query'; // 1. Import useQuery
import type { Settings as SettingsType } from '@shared/schema'; // 2. Import the type
import {
  LayoutDashboard,
  Trello,
  Inbox,
  Puzzle,
  Settings,
  Rocket,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/boards', icon: Trello, label: 'Boards' },
  { path: '/inbox', icon: Inbox, label: 'Inbox' },
  { path: '/integrations', icon: Puzzle, label: 'Integrations' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const [location] = useLocation();

  // Fetch settings from the cache
  const { data: settings } = useQuery<SettingsType>({
    queryKey: ['/api/settings'],
    // The staleTime line has been removed.
  });

  // Create a helper to get initials from the name
  const getInitials = (name?: string) => {
    const parts = (name || 'U').split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return (first + last).toUpperCase();
  };

  const initials = getInitials(settings?.profileName);

  return (
    <Sidebar data-testid="sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground" data-testid="text-app-title">
              Tracko
            </h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`link-${item.label.toLowerCase()}`}
                    >
                      <Link href={item.path}>
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate" data-testid="text-username">
              {settings?.profileName || 'Loading...'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {settings?.profileEmail || '...'}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
