'use client';

import { useState } from 'react';

type Rating = 1 | 2 | 3 | 4 | 5 | null;

interface WidgetProps {
  siteId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  companyName?: string;
}

export default function Widget({
  siteId,
  position = 'bottom-right',
  primaryColor = '#2563eb', // Blue-600
  companyName = '',
}: WidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<Rating>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const handleRatingClick = (value: Rating) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) return;
    
    setLoading(true);
    
    try {
      // Gather browser and device information
      const browser = getBrowserInfo();
      const device = getDeviceType();
      const url = window.location.href;
      
      // Call our API endpoint to submit feedback
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteId, 
          rating, 
          comment,
          url,
          browser,
          device
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Reset form and show success
      setSubmitted(true);
      
      // Close widget after a delay
      setTimeout(() => {
        setIsOpen(false);
        
        // Reset form values after closing
        setTimeout(() => {
          setRating(null);
          setComment('');
          setSubmitted(false);
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to detect browser
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) return 'IE';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    
    return 'Unknown';
  };

  // Helper function to detect device type
  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    if (/Android/.test(userAgent)) return 'Android';
    
    return window.innerWidth <= 768 ? 'Mobile' : 'Desktop';
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleWidget}
        className={`fixed ${positionClasses[position]} z-50 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 focus:outline-none`}
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Feedback Widget */}
      <div
        className={`fixed ${positionClasses[position]} z-40 w-80 bg-white rounded-lg shadow-xl transition-all duration-300 transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
        style={{ marginBottom: position.includes('bottom') ? '4rem' : '0', marginTop: position.includes('top') ? '4rem' : '0' }}
      >
        <div className="p-4">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex justify-between items-center">
                <div className="font-medium" style={{ color: primaryColor }}>
                  How was your experience?
                </div>
                <div className="text-xs text-gray-400">
                  {companyName ? `Powered by ${companyName}` : 'Powered by QuickFeedback'}
                </div>
              </div>

              {/* Rating Buttons */}
              <div className="flex gap-2 mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingClick(value as Rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                      rating === value
                        ? 'border-transparent text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: rating === value ? primaryColor : 'transparent',
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>

              {/* Comment Textarea */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 mb-3 text-sm"
                placeholder="Tell us what you think..."
                rows={3}
              ></textarea>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!rating || loading}
                className="w-full py-2 text-white rounded-lg transition disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Thanks for your feedback!</h3>
              <p className="text-gray-500 text-sm">Your response has been recorded.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 