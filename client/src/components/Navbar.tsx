import { Search, Bell, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSearchStore } from '@/lib/searchStore'; // <-- 1. Import the store

export function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  // 2. Get the state and setter function
  const { searchTerm, setSearchTerm } = useSearchStore(); 

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-border bg-background sticky top-0 z-40 backdrop-blur-sm bg-background/95"
      data-testid="navbar"
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tasks, messages, or integrations..."
              className="w-full h-9 pl-10 pr-4 bg-muted/50 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              data-testid="input-search"
              // 3. Control the input value
              value={searchTerm}
              // 4. Update the store on change
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleDarkMode}
            data-testid="button-theme-toggle"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}