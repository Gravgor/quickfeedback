import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  onClick: () => void;
  buttonText: string;
  disabled?: boolean;
  currentPlan?: boolean;
}

const PricingCard = ({
  title,
  description,
  price,
  features,
  popular = false,
  onClick,
  buttonText,
  disabled = false,
  currentPlan = false,
}: PricingCardProps) => {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${popular ? 'border-primary' : 'border-border'} ${popular ? 'ring-1 ring-primary' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        {popular && <Badge>Popular</Badge>}
        {currentPlan && <Badge variant="outline">Current Plan</Badge>}
      </div>
      <div className="mt-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground ml-1">/month</span>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onClick}
        className="mt-6 w-full"
        variant={popular ? "default" : "outline"}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PricingCard; 