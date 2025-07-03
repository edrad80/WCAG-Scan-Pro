export default {
  name: 'sensory-alerts',
  description: 'Checks non-visual cues',
  async scan(document) {
    const issues = [];
    
    // 1.3.3 Sensory Characteristics
    const sensoryPhrases = ['click the green button', 'see the right sidebar', 'shown in red'];
    document.querySelectorAll('p, span, div, li').forEach(el => {
      sensoryPhrases.forEach(phrase => {
        if (el.textContent.toLowerCase().includes(phrase)) {
          issues.push(this.createIssue(
            'Reliance on sensory characteristics',
            'moderate',
            el,
            '1.3.3 Sensory Characteristics'
          ));
        }
      });
    });

    // 1.4.1 Use of Color
    document.querySelectorAll('[style*="color"]').forEach(el => {
      if (/important|error|warning|success/i.test(el.textContent) && 
          !/aria-label|alt|title/.test(el.outerHTML)) {
        issues.push(this.createIssue(
          'Color as sole information carrier',
          'critical',
          el,
          '1.4.1 Use of Color'
        ));
      }
    });

    return issues;
  }
};