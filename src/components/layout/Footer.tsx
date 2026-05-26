import React from 'react';
import { Sprout, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg">
              Farm<span className="text-primary">Bot</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Empowering farmers with AI technology for a sustainable future
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-terracotta fill-terracotta" /> for Farmers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
