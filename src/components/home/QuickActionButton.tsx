import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color: 'primary' | 'leaf' | 'wheat' | 'sky' | 'terracotta' | 'earth';
}

const colorClasses = {
  primary: 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20',
  leaf: 'bg-leaf/10 hover:bg-leaf/20 text-leaf border-leaf/20',
  wheat: 'bg-wheat/10 hover:bg-wheat/20 text-wheat border-wheat/20',
  sky: 'bg-sky/10 hover:bg-sky/20 text-sky border-sky/20',
  terracotta: 'bg-terracotta/10 hover:bg-terracotta/20 text-terracotta border-terracotta/20',
  earth: 'bg-earth/10 hover:bg-earth/20 text-earth border-earth/20',
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  color,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95',
        colorClasses[color]
      )}
    >
      <Icon className="h-8 w-8" />
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </button>
  );
};

export default QuickActionButton;
