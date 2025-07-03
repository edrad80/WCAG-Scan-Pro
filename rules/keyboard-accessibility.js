export default {
  name: 'keyboard-accessibility',
  description: 'Checks keyboard accessibility and focus management',
  wcagRef: 'WCAG 2.1.1, 2.4.3, 2.4.7',
  wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard',
  
  async scan(document) {
    const issues = [];
    
    // Check for focusable elements without keyboard access
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]'
    );
    
    focusableElements.forEach(el => {
      // Skip elements with negative tabindex
      if (el.getAttribute('tabindex') === '-1') return;
      
      // Check visibility
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') {
        issues.push({
          message: 'Focusable hidden element',
          severity: 'moderate',
          element: this.getElementPath(el),
          details: 'Element is focusable but not visible to keyboard users',
          wcagRef: '2.4.3 Focus Order',
          wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html'
        });
      }
      
      // Check for interactive elements without focus styles
      if (['a', 'button', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase())) {
        const hasFocusStyle = style.outlineStyle !== 'none' || 
                            style.boxShadow !== 'none' || 
                            el.getAttribute('data-focus-style');
        
        if (!hasFocusStyle) {
          issues.push({
            message: 'Missing focus indicator',
            severity: 'critical',
            element: this.getElementPath(el),
            details: 'Interactive element lacks visible focus styles',
            wcagRef: '2.4.7 Focus Visible',
            wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html'
          });
        }
      }
    });
    
    // Check for keyboard traps
    const modalDialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    modalDialogs.forEach(dialog => {
      if (!dialog.hasAttribute('aria-modal') || dialog.getAttribute('aria-modal') !== 'true') {
        issues.push({
          message: 'Potential keyboard trap in dialog',
          severity: 'critical',
          element: this.getElementPath(dialog),
          details: 'Dialog may trap keyboard focus without proper aria-modal attribute',
          wcagRef: '2.1.2 No Keyboard Trap',
          wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html'
        });
      }
    });
    
    return issues;
  },
  
  getElementPath(el) {
    // Same implementation as previous rules
  }
};