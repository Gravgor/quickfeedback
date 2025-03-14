# QuickFeedback Widget Test Suite

This directory contains a set of HTML files to test the QuickFeedback widget in different configurations.

## Prerequisites

Before running these tests, make sure your QuickFeedback application is running on http://localhost:3000.

## Test Files

- **index.html** - Default configuration (bottom-right position, blue color)
- **top-left.html** - Widget positioned in the top-left corner with purple color
- **custom-branding.html** - Widget with custom company branding in the bottom-left corner

## How to Use

### Option 1: Using npm scripts (recommended)

We've included several npm scripts to make testing easier:

1. Make sure your QuickFeedback server is running on port 3000:
   ```
   npm run dev
   ```

2. From the tests directory, run one of the following commands:
   ```
   npm run test             # Default widget (bottom-right, blue)
   npm run test:top-left    # Top-left widget (purple)
   npm run test:custom-branding  # Bottom-left widget with custom branding
   ```

   This will start the test server and open the test page in your default browser.

3. If the server is already running, you can just open a specific test page:
   ```
   npm run open              # Default widget
   npm run open:top-left     # Top-left widget
   npm run open:custom-branding   # Custom branding widget
   ```

### Option 2: Using the QuickFeedback dev server

1. Start your QuickFeedback server:
   ```
   npm run dev
   ```

2. Open the test files in your browser:
   - http://localhost:3000/tests/index.html
   - http://localhost:3000/tests/top-left.html 
   - http://localhost:3000/tests/custom-branding.html

### Option 3: Using the built-in test server manually

You can also use the included simple HTTP server to serve the test files:

1. Make sure your QuickFeedback server is running on port 3000:
   ```
   npm run dev
   ```

2. In a new terminal, navigate to the tests directory and run:
   ```
   node server.js
   # or 
   npm start
   ```

3. The server will start on port 8080. Open the following URLs in your browser:
   - http://localhost:8080/
   - http://localhost:8080/top-left.html
   - http://localhost:8080/custom-branding.html

### Option 4: Opening HTML files directly

You can also simply open the HTML files directly in your browser using the file:// protocol.
However, note that some browsers may have security restrictions that prevent the widget from working correctly when using the file protocol.

## Verifying Widget Functionality

Verify that the widget appears and functions correctly:
- The feedback button should appear in the specified position
- Clicking the button should open the feedback form
- The form should allow you to select a rating and enter a comment
- Submitting feedback should work correctly

## Testing Mobile View

To test how the widget behaves on mobile devices:

1. Open Chrome DevTools (F12 or right-click > Inspect)
2. Click the "Toggle device toolbar" button or press Ctrl+Shift+M
3. Select a mobile device from the dropdown menu
4. Refresh the page to see how the widget behaves on small screens 