// WCAG 2.2 AA Alt Text Checker
export default {
  name: 'alt-text',
  description: 'Checks for missing or inappropriate alt text on images',
  wcagRef: 'WCAG 1.1.1',
  wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
  
  async scan(document) {
    const issues = [];
    const images = document.querySelectorAll('img, [role="img"], input[type="image"]');
    
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const isDecorative = img.getAttribute('role') === 'presentation' || 
                         img.getAttribute('aria-hidden') === 'true';
      
      if (!isDecorative) {
        if (!alt && alt !== '') {
          issues.push({
            message: 'Missing alt attribute',
            severity: 'critical',
            element: this.getElementPath(img),
            details: 'Image is not marked as decorative and has no alt text',
            wcagRef: '1.1.1 Non-text Content',
            wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
          });
        } else if (alt === '') {
          // Check if image is actually decorative
          const computedStyles = window.getComputedStyle(img);
          if (img.offsetWidth > 50 && img.offsetHeight > 50) {
            issues.push({
              message: 'Empty alt text on potentially meaningful image',
              severity: 'moderate',
              element: this.getElementPath(img),
              details: 'Large image with empty alt text - verify if it should be decorative',
              wcagRef: '1.1.1 Non-text Content',
              wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
            });
          }
        } else if (this.isSuspiciousAltText(alt)) {
          issues.push({
            message: 'Potentially non-descriptive alt text',
            severity: 'moderate',
            element: this.getElementPath(img),
            details: `Alt text may not be descriptive: "${alt}"`,
            wcagRef: '1.1.1 Non-text Content',
            wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
          });
        }
      }
    });
    
    return issues;
  },
  
  isSuspiciousAltText(text) {
    if (!text) return false;
    const suspiciousPatterns = [
      /^image/i,
      /^img/i,
      /^picture/i,
      /^photo/i,
      /^graphic/i,
      /^\d+$/,
      /^[a-z]$/i,
      /^spacer/i,
      /^div$/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(text));
  },
  
  getElementPath(el) {
    // Same implementation as in color-contrast.js
    // Could be moved to a shared utility module
  }
};