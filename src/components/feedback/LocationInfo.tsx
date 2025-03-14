import React from 'react';

interface LocationInfoProps {
  country: string | null | undefined;
  city: string | null | undefined;
}

export default function LocationInfo({ country, city }: LocationInfoProps) {
  if (!country) {
    return <span className="text-gray-400 italic">Location not available</span>;
  }
  
  return (
    <div>
      {country}
      {city && <span className="ml-1">({city})</span>}
    </div>
  );
} 