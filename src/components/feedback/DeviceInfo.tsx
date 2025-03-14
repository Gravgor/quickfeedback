import React from 'react';

interface DeviceInfoProps {
  device: string | null | undefined;
  browser: string | null | undefined;
  os: string | null | undefined;
  screenSize: string | null | undefined;
}

export default function DeviceInfo({ device, browser, os, screenSize }: DeviceInfoProps) {
  return (
    <div>
      <div className="mb-1">
        <span className="font-medium">Device:</span> {device || 'Unknown'}
      </div>
      <div className="mb-1">
        <span className="font-medium">Browser:</span> {browser || 'Unknown'}
      </div>
      <div className="mb-1">
        <span className="font-medium">OS:</span> {os || 'Unknown'}
      </div>
      <div>
        <span className="font-medium">Screen Size:</span> {screenSize || 'Unknown'}
      </div>
    </div>
  );
} 