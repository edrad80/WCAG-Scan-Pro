export default {
  name: 'media-accessibility',
  description: 'Checks video/audio accessibility',
  async scan(document) {
    const issues = [];
    
    // 1.2.2 Captions
    document.querySelectorAll('video').forEach(video => {
      if (!video.querySelector('track[kind="captions"]')) {
        issues.push(this.createIssue(
          'Video missing captions',
          'critical',
          video,
          '1.2.2 Captions (Prerecorded)'
        ));
      }
    });

    // 1.2.3 Audio Description
    document.querySelectorAll('video').forEach(video => {
      if (video.textTracks.length === 0) {
        issues.push(this.createIssue(
          'Video missing audio description',
          'moderate',
          video,
          '1.2.3 Audio Description'
        ));
      }
    });

    // 1.4.2 Audio Control
    document.querySelectorAll('audio[autoplay]').forEach(audio => {
      if (!audio.controls || audio.duration > 3) {
        issues.push(this.createIssue(
          'Auto-playing audio without control',
          'critical',
          audio,
          '1.4.2 Audio Control'
        ));
      }
    });

    return issues;
  },
  createIssue(message, severity, element, wcagRef) {
    return {
      message,
      severity,
      element: this.getElementPath(element),
      wcagRef,
      wcagLink: `https://www.w3.org/WAI/WCAG22/Understanding/${wcagRef.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    };
  }
};