import { useState } from 'react';
import { Bell, BellRing, X, Brain, TrendingUp, User, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserLearning, LearningNotification } from '@/hooks/use-user-learning';

export function LearningNotificationCenter() {
  const { notifications, unreadCount, markAsRead, clearAllNotifications } = useUserLearning();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_pattern':
        return <Brain className="h-4 w-4 text-blue-400" />;
      case 'pattern_update':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'insight':
        return <Target className="h-4 w-4 text-purple-400" />;
      case 'recommendation':
        return <User className="h-4 w-4 text-orange-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_pattern':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'pattern_update':
        return 'bg-green-500/10 border-green-500/20';
      case 'insight':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'recommendation':
        return 'bg-orange-500/10 border-orange-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleNotificationClick = (notification: LearningNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-gray-800/50"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-400" />
          ) : (
            <Bell className="h-5 w-5 text-gray-400" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-blue-500 hover:bg-blue-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-800" align="end">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-white">Learning Updates</h3>
            </div>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear all
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            AI insights about your preferences and patterns
          </p>
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Brain className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No learning updates yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Keep chatting and I'll learn your preferences
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    getNotificationColor(notification.type)
                  } ${
                    notification.isRead 
                      ? 'opacity-60 hover:opacity-80' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </CardTitle>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <CardDescription className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {notification.description}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {notification.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {notification.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}