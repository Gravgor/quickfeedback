import React from 'react';

interface SessionInfoProps {
  timeOnPage: number | null | undefined;
  referrer: string | null | undefined;
}

export default function SessionInfo({ timeOnPage, referrer }: SessionInfoProps) {
  // Format time on page
  const formatTime = (seconds: number | null | undefined): string => {
    if (!seconds) return 'Not recorded';
    
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins < 60) {
      return `${mins} min ${secs} sec`;
    }
    
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    return `${hours} hr ${remainingMins} min`;
  };

  return (
    <div>
      <div className="mb-1">
        <span className="font-medium">Time on Page:</span> {formatTime(timeOnPage)}
      </div>
      {referrer && (
        <div>
          <span className="font-medium">Referrer:</span> {referrer}
        </div>
      )}
    </div>
  );
} 