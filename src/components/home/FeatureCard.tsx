import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'primary' | 'leaf' | 'wheat' | 'sky' | 'terracotta' | 'earth';
  delay?: number;
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  leaf: 'bg-leaf/10 text-leaf',
  wheat: 'bg-wheat/10 text-wheat',
  sky: 'bg-sky/10 text-sky',
  terracotta: 'bg-terracotta/10 text-terracotta',
  earth: 'bg-earth/10 text-earth',
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
}) => {
  return (
    <div
      className="feature-card opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', colorClasses[color])}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
