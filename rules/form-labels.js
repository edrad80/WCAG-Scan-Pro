export default {
  name: 'form-labels',
  description: 'Checks form controls have proper labels',
  wcagRef: 'WCAG 1.3.1, 4.1.2',
  wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
  
  async scan(document) {
    const issues = [];
    const formControls = document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]), ' +
      'select, textarea, [role="combobox"], [role="slider"], [role="spinbutton"]'
    );
    
    formControls.forEach(control => {
      const controlType = control.getAttribute('type') || control.tagName.toLowerCase();
      const id = control.getAttribute('id');
      
      // Check for explicit label
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
          issues.push({
            message: 'Missing explicit label',
            severity: 'critical',
            element: this.getElementPath(control),
            details: `Form control of type ${controlType} has no associated label`,
            wcagRef: '1.3.1 Info and Relationships',
            wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
          });
        }
      } else {
        // Check for wrapping label or aria-label/aria-labelledby
        const hasWrappingLabel = control.closest('label');
        const hasAriaLabel = control.hasAttribute('aria-label') || 
                           control.hasAttribute('aria-labelledby');
        
        if (!hasWrappingLabel && !hasAriaLabel) {
          issues.push({
            message: 'Missing accessible name',
            severity: 'critical',
            element: this.getElementPath(control),
            details: `Form control of type ${controlType} has no accessible name`,
            wcagRef: '4.1.2 Name, Role, Value',
            wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html'
          });
        }
      }
      
      // Check for placeholder as label anti-pattern
      if (control.hasAttribute('placeholder') && 
          !control.hasAttribute('aria-label') && 
          !control.hasAttribute('aria-labelledby') && 
          !document.querySelector(`label[for="${id}"]`)) {
        issues.push({
          message: 'Placeholder used as label',
          severity: 'moderate',
          element: this.getElementPath(control),
          details: 'Placeholder text should not be used as a replacement for proper labeling',
          wcagRef: '1.3.1 Info and Relationships',
          wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
        });
      }
    });
    
    return issues;
  },
  
  getElementPath(el) {
    // Same implementation as previous rules
  }
};