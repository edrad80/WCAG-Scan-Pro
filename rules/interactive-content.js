export default {
  name: 'interactive-content',
  description: 'Checks hover/focus behavior',
  async scan(document) {
    const issues = [];
    
    // 1.4.13 Content on Hover/Focus
    document.querySelectorAll(':hover, :focus').forEach(el => {
      if (getComputedStyle(el, ':after').content !== 'none' || 
          getComputedStyle(el, ':before').content !== 'none') {
        issues.push(this.createIssue(
          'Tooltip/popup missing dismiss mechanism',
          'moderate',
          el,
          '1.4.13 Content on Hover/Focus'
        ));
      }
    });

    return issues;
  }
};