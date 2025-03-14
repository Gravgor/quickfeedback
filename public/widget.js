(function() {
  // Configuration from script attributes
  const script = document.currentScript;
  const siteId = script.getAttribute('data-site-id');
  const position = script.getAttribute('data-position') || 'bottom-right';
  const primaryColor = script.getAttribute('data-color') || '#2563eb';
  const companyName = script.getAttribute('data-company') || '';
  const apiUrl = script.getAttribute('data-api-url') || 'http://localhost:3000';
  
  // Validate required configuration
  if (!siteId) {
    console.error('QuickFeedback: data-site-id is required');
    return;
  }
  
  // Track user session data
  const pageLoadTime = new Date();
  let timeOnPage = 0;
  
  // Create widget container
  const container = document.createElement('div');
  container.id = 'quickfeedback-container';
  document.body.appendChild(container);
  
  // Define widget styles
  const styles = document.createElement('style');
  styles.textContent = `
    #quickfeedback-container * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    #quickfeedback-trigger {
      position: fixed;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: ${primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      z-index: 9999;
    }
    
    #quickfeedback-trigger:hover {
      transform: scale(1.05);
    }
    
    #quickfeedback-form {
      position: fixed;
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      z-index: 9998;
      overflow: hidden;
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
    }
    
    #quickfeedback-form.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    
    .quickfeedback-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .quickfeedback-title {
      color: ${primaryColor};
      font-weight: 500;
      margin: 0;
    }
    
    .quickfeedback-powered-by {
      font-size: 12px;
      color: #9ca3af;
    }
    
    .quickfeedback-content {
      padding: 16px;
    }
    
    .quickfeedback-rating {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .quickfeedback-rating-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .quickfeedback-rating-btn:hover {
      border-color: #d1d5db;
    }
    
    .quickfeedback-rating-btn.selected {
      background-color: ${primaryColor};
      color: white;
      border-color: transparent;
    }
    
    .quickfeedback-comment {
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      resize: none;
      margin-bottom: 12px;
      min-height: 80px;
    }
    
    .quickfeedback-submit {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background-color: ${primaryColor};
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .quickfeedback-submit:hover {
      background-color: ${primaryColor}dd;
    }
    
    .quickfeedback-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .quickfeedback-success {
      text-align: center;
      padding: 32px 16px;
    }
    
    .quickfeedback-success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: #ecfdf5;
      color: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    
    .quickfeedback-success-title {
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .quickfeedback-success-message {
      font-size: 14px;
      color: #6b7280;
    }

    .quickfeedback-error {
      color: #ef4444;
      font-size: 14px;
      margin-bottom: 12px;
      text-align: center;
    }

    .quickfeedback-close {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quickfeedback-close:hover {
      color: #6b7280;
    }
  `;
  document.head.appendChild(styles);
  
  // Set position based on attribute
  let triggerPosition = {};
  let formPosition = {};
  
  switch (position) {
    case 'bottom-right':
      triggerPosition = { bottom: '16px', right: '16px' };
      formPosition = { bottom: '80px', right: '16px' };
      break;
    case 'bottom-left':
      triggerPosition = { bottom: '16px', left: '16px' };
      formPosition = { bottom: '80px', left: '16px' };
      break;
    case 'top-right':
      triggerPosition = { top: '16px', right: '16px' };
      formPosition = { top: '80px', right: '16px' };
      break;
    case 'top-left':
      triggerPosition = { top: '16px', left: '16px' };
      formPosition = { top: '80px', left: '16px' };
      break;
    default:
      triggerPosition = { bottom: '16px', right: '16px' };
      formPosition = { bottom: '80px', right: '16px' };
  }
  
  // Create trigger button
  const trigger = document.createElement('button');
  trigger.id = 'quickfeedback-trigger';
  trigger.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg>';
  
  // Apply position styles
  Object.assign(trigger.style, triggerPosition);
  
  container.appendChild(trigger);
  
  // Create feedback form
  const form = document.createElement('div');
  form.id = 'quickfeedback-form';
  
  // Apply position styles
  Object.assign(form.style, formPosition);
  
  form.innerHTML = `
    <div class="quickfeedback-header">
      <h3 class="quickfeedback-title">How was your experience?</h3>
      <div class="quickfeedback-header-right">
        <button class="quickfeedback-close" id="quickfeedback-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <span class="quickfeedback-powered-by">Powered by ${companyName || 'QuickFeedback'}</span>
      </div>
    </div>
    <div class="quickfeedback-content">
      <div class="quickfeedback-rating">
        <button type="button" class="quickfeedback-rating-btn" data-rating="1">1</button>
        <button type="button" class="quickfeedback-rating-btn" data-rating="2">2</button>
        <button type="button" class="quickfeedback-rating-btn" data-rating="3">3</button>
        <button type="button" class="quickfeedback-rating-btn" data-rating="4">4</button>
        <button type="button" class="quickfeedback-rating-btn" data-rating="5">5</button>
      </div>
      <textarea class="quickfeedback-comment" placeholder="Tell us what you think..."></textarea>
      <div class="quickfeedback-error" style="display: none;"></div>
      <button class="quickfeedback-submit" disabled>Submit Feedback</button>
    </div>
  `;
  
  container.appendChild(form);
  
  // State management
  let selectedRating = 0;
  let isSubmitting = false;
  let isVisible = false;
  
  // DOM elements
  const ratingButtons = form.querySelectorAll('.quickfeedback-rating-btn');
  const commentTextarea = form.querySelector('.quickfeedback-comment');
  const submitButton = form.querySelector('.quickfeedback-submit');
  const errorElement = form.querySelector('.quickfeedback-error');
  const closeButton = form.querySelector('#quickfeedback-close');
  
  // Event handlers
  function toggleForm() {
    isVisible = !isVisible;
    form.classList.toggle('visible', isVisible);
  }
  
  function closeForm() {
    isVisible = false;
    form.classList.remove('visible');
  }
  
  function selectRating(rating) {
    selectedRating = rating;
    
    // Update UI
    ratingButtons.forEach(btn => {
      const btnRating = parseInt(btn.getAttribute('data-rating'));
      btn.classList.toggle('selected', btnRating === rating);
    });
    
    // Enable submit button if rating is selected
    submitButton.disabled = false;
  }
  
  function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  function hideError() {
    errorElement.style.display = 'none';
  }
  
  function showSuccess() {
    form.innerHTML = `
      <div class="quickfeedback-success">
        <div class="quickfeedback-success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 class="quickfeedback-success-title">Thank you for your feedback!</h3>
        <p class="quickfeedback-success-message">Your input helps us improve our service.</p>
      </div>
    `;
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      closeForm();
      resetForm();
    }, 3000);
  }
  
  function resetForm() {
    // Reset state
    selectedRating = 0;
    isSubmitting = false;
    
    // Reset UI
    form.innerHTML = `
      <div class="quickfeedback-header">
        <h3 class="quickfeedback-title">How was your experience?</h3>
        <div class="quickfeedback-header-right">
          <button class="quickfeedback-close" id="quickfeedback-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <span class="quickfeedback-powered-by">Powered by ${companyName || 'QuickFeedback'}</span>
        </div>
      </div>
      <div class="quickfeedback-content">
        <div class="quickfeedback-rating">
          <button type="button" class="quickfeedback-rating-btn" data-rating="1">1</button>
          <button type="button" class="quickfeedback-rating-btn" data-rating="2">2</button>
          <button type="button" class="quickfeedback-rating-btn" data-rating="3">3</button>
          <button type="button" class="quickfeedback-rating-btn" data-rating="4">4</button>
          <button type="button" class="quickfeedback-rating-btn" data-rating="5">5</button>
        </div>
        <textarea class="quickfeedback-comment" placeholder="Tell us what you think..."></textarea>
        <div class="quickfeedback-error" style="display: none;"></div>
        <button class="quickfeedback-submit" disabled>Submit Feedback</button>
      </div>
    `;
    
    // Re-attach event listeners
    attachEventListeners();
  }
  
  function submitFeedback() {
    if (isSubmitting || !selectedRating) return;
    
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    hideError();
    
    // Calculate time on page in seconds
    timeOnPage = Math.floor((new Date() - pageLoadTime) / 1000);
    
    // Get browser and device info
    const browser = getBrowserInfo();
    const device = getDeviceInfo();
    const os = getOSInfo();
    const language = navigator.language || navigator.userLanguage;
    const screenSize = `${window.screen.width}x${window.screen.height}`;
    const currentUrl = window.location.href;
    const referrer = document.referrer || null;
    const comment = commentTextarea.value.trim();
    const userAgent = navigator.userAgent;
    
    // Get geolocation data (if available and allowed)
    fetchLocationData()
      .then(locationData => {
        // Prepare payload with all collected data
        const payload = {
          siteId: siteId,
          rating: selectedRating,
          comment: comment || null,
          url: currentUrl,
          browser,
          device,
          os,
          language,
          referrer,
          time_on_page: timeOnPage,
          screen_size: screenSize,
          user_agent: userAgent,
          ...locationData // Add country and city if available
        };
        
        // Send feedback to API
        return fetch(`${apiUrl}/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit feedback');
        }
        return response.json();
      })
      .then(data => {
        showSuccess();
      })
      .catch(error => {
        console.error('Error submitting feedback:', error);
        showError('Failed to submit feedback. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Feedback';
        isSubmitting = false;
      });
  }
  
  function fetchLocationData() {
    // Try to get country and city using a geolocation service
    // For the demo, we'll use a free service (can be replaced with a more robust solution)
    return fetch('https://ipapi.co/json/')
      .then(response => {
        if (!response.ok) {
          return {}; // Return empty object if unable to get location
        }
        return response.json();
      })
      .then(data => {
        return {
          country: data.country_name || null,
          city: data.city || null
        };
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
        return {}; // Return empty object on error
      });
  }
  
  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.indexOf('Firefox') > -1) {
      browser = 'Firefox';
    } else if (userAgent.indexOf('SamsungBrowser') > -1) {
      browser = 'Samsung Browser';
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
      browser = 'Opera';
    } else if (userAgent.indexOf('Trident') > -1) {
      browser = 'Internet Explorer';
    } else if (userAgent.indexOf('Edge') > -1) {
      browser = 'Edge';
    } else if (userAgent.indexOf('Chrome') > -1) {
      browser = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
      browser = 'Safari';
    }
    
    return browser;
  }
  
  function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let device = 'Unknown';
    
    if (/Mobi|Android/i.test(userAgent)) {
      device = 'Mobile';
    } else if (/iPad|Tablet/i.test(userAgent)) {
      device = 'Tablet';
    } else {
      device = 'Desktop';
    }
    
    return device;
  }
  
  function getOSInfo() {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    
    if (/Windows/i.test(userAgent)) {
      os = 'Windows';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      os = 'macOS';
    } else if (/Linux/i.test(userAgent)) {
      os = 'Linux';
    } else if (/Android/i.test(userAgent)) {
      os = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      os = 'iOS';
    }
    
    return os;
  }
  
  // Attach event listeners
  function attachEventListeners() {
    // Get updated DOM elements after form reset
    const ratingButtons = form.querySelectorAll('.quickfeedback-rating-btn');
    const commentTextarea = form.querySelector('.quickfeedback-comment');
    const submitButton = form.querySelector('.quickfeedback-submit');
    const closeButton = form.querySelector('#quickfeedback-close');
    
    // Toggle form visibility when trigger is clicked
    trigger.addEventListener('click', toggleForm);
    
    // Close form when close button is clicked
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeForm();
      });
    }
    
    // Handle rating selection
    ratingButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.getAttribute('data-rating'));
        selectRating(rating);
      });
    });
    
    // Handle form submission
    if (submitButton) {
      submitButton.addEventListener('click', submitFeedback);
    }
    
    // Close form when clicking outside
    document.addEventListener('click', (e) => {
      if (isVisible && !form.contains(e.target) && e.target !== trigger) {
        closeForm();
      }
    });
  }
  
  // Initialize
  attachEventListeners();
})(); 