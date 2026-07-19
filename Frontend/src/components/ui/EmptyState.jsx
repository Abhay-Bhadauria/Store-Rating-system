import { Inbox } from 'lucide-react';
import { cn } from '@utils';

export default function EmptyState({
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  icon: Icon = Inbox,
  action,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
