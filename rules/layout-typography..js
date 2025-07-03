export default {
  name: 'layout-typography',
  description: 'Checks responsive layout',
  async scan(document) {
    const issues = [];
    
    // 1.4.10 Reflow
    const fixedWidthElements = document.querySelectorAll('*').filter(el => {
      const style = getComputedStyle(el);
      return style.width && !style.width.endsWith('%') && 
             parseInt(style.width) > 320;
    });
    
    fixedWidthElements.forEach(el => {
      issues.push(this.createIssue(
        'Element may cause horizontal scrolling',
        'moderate',
        el,
        '1.4.10 Reflow'
      ));
    });

    // 1.4.12 Text Spacing
    document.querySelectorAll('p, span, div, li').forEach(el => {
      const style = getComputedStyle(el);
      if (parseFloat(style.lineHeight) < 1.5 || 
          parseFloat(style.letterSpacing) < 0.12 ||
          parseFloat(style.wordSpacing) < 0.16) {
        issues.push(this.createIssue(
          'Insufficient text spacing',
          'low',
          el,
          '1.4.12 Text Spacing'
        ));
      }
    });

    return issues;
  }
};