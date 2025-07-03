/**
 * WCAG Scan Pro - Advanced Color Contrast Checker
 * Checks compliance with WCAG 2.2 AA 1.4.3 Contrast Minimum
 */

export default {
  name: 'pro-color-contrast',
  description: 'Advanced color contrast analysis with element detection',
  wcagRef: '1.4.3',
  wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
  severity: 'critical',

  async scan(document) {
    const issues = [];
    const textElements = this.getTextElements(document);
    const processedPairs = new Set();

    for (const element of textElements) {
      try {
        const { textColor, bgColor, fontSize, fontWeight } = this.getElementStyles(element);
        
        // Skip transparent/undefined colors
        if (!textColor || !bgColor || textColor.alpha < 0.1 || bgColor.alpha < 0.1) continue;
        
        // Generate unique pair identifier to avoid duplicate checks
        const pairKey = `${textColor.rgb}-${bgColor.rgb}-${fontSize}-${fontWeight}`;
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);

        const contrastRatio = this.calculateContrastRatio(textColor, bgColor);
        const isLargeText = this.isLargeText(fontSize, fontWeight);
        const minimumRatio = isLargeText ? 3 : 4.5;

        if (contrastRatio < minimumRatio) {
          const elementPath = this.getElementPath(element);
          const computedStyles = window.getComputedStyle(element);
          
          issues.push({
            id: `color-contrast-${this.generateIssueId(elementPath, textColor.hex, bgColor.hex)}`,
            message: `Insufficient color contrast (${contrastRatio.toFixed(1)}:1)`,
            severity: this.severity,
            element: elementPath,
            details: `Text color: ${textColor.hex}, Background: ${bgColor.hex}\n` +
                     `Required: ${minimumRatio}:1 (${isLargeText ? 'Large text' : 'Normal text'})`,
            wcagRef: this.wcagRef,
            wcagLink: this.wcagLink,
            context: {
              textSample: element.textContent.trim().slice(0, 50),
              fontSize,
              fontWeight,
              textColor: textColor.hex,
              bgColor: bgColor.hex,
              computedStyles: {
                color: computedStyles.color,
                backgroundColor: computedStyles.backgroundColor,
                fontSize: computedStyles.fontSize,
                fontWeight: computedStyles.fontWeight
              }
            }
          });
        }
      } catch (error) {
        console.error('Error checking contrast for element:', element, error);
      }
    }

    return issues;
  },

  getTextElements(document) {
    // Get all elements with visible text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          // Skip non-visible elements
          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Only include elements with direct text content
          return node.childNodes.length > 0 && 
                 Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      },
      false
    );

    const elements = [];
    let node;
    while (node = walker.nextNode()) {
      elements.push(node);
    }
    return elements;
  },

  getElementStyles(element) {
    const style = window.getComputedStyle(element);
    
    return {
      textColor: this.parseColor(style.color),
      bgColor: this.getBackgroundColor(element),
      fontSize: parseFloat(style.fontSize),
      fontWeight: style.fontWeight
    };
  },

  getBackgroundColor(element) {
    // Walk up the DOM tree until we find a solid background
    let current = element;
    while (current && current !== document.documentElement) {
      const bgColor = this.parseColor(window.getComputedStyle(current).backgroundColor);
      if (bgColor.alpha >= 0.99) {
        return bgColor;
      }
      current = current.parentElement;
    }
    return this.parseColor('white'); // Fallback
  },

  parseColor(colorStr) {
    if (!colorStr || colorStr === 'transparent') {
      return { rgb: '0,0,0', hex: '#000000', r: 0, g: 0, b: 0, alpha: 0 };
    }

    // Parse rgb/rgba strings
    const rgbMatch = colorStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      const alpha = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
      
      return {
        r: r / 255,
        g: g / 255,
        b: b / 255,
        alpha,
        rgb: `${r},${g},${b}`,
        hex: this.rgbToHex(r, g, b)
      };
    }

    // Parse hex strings
    const hexMatch = colorStr.match(/^#([0-9a-f]{3,8})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      // Handle shorthand #RGB format
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(c => c + c).join('');
      }
      
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const alpha = hex.length >= 8 ? parseInt(hex.substr(6, 2), 16) / 255 : 1;
      
      return {
        r: r / 255,
        g: g / 255,
        b: b / 255,
        alpha,
        rgb: `${r},${g},${b}`,
        hex: `#${hex.substr(0, 6)}`
      };
    }

    // Fallback for named colors (simplified)
    return this.parseColor('#000000');
  },

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  calculateContrastRatio(color1, color2) {
    const luminance1 = this.calculateLuminance(color1);
    const luminance2 = this.calculateLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },

  calculateLuminance(color) {
    // Convert sRGB to linear RGB
    const linearR = color.r <= 0.03928 ? color.r / 12.92 : Math.pow((color.r + 0.055) / 1.055, 2.4);
    const linearG = color.g <= 0.03928 ? color.g / 12.92 : Math.pow((color.g + 0.055) / 1.055, 2.4);
    const linearB = color.b <= 0.03928 ? color.b / 12.92 : Math.pow((color.b + 0.055) / 1.055, 2.4);
    
    // Calculate relative luminance
    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  },

  isLargeText(fontSize, fontWeight) {
    // WCAG definition of large text
    return (fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700));
  },

  getElementPath(element) {
    if (!element || !element.tagName) return '';

    const path = [];
    let current = element;
    let depth = 0;
    
    while (current && current.nodeType === Node.ELEMENT_NODE && depth < 6) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else {
        if (current.className && typeof current.className === 'string') {
          const classes = current.className.split(/\s+/).filter(c => c);
          if (classes.length > 0) {
            selector += `.${classes[0]}`;
          }
        }
        
        const siblings = current.parentNode ? Array.from(current.parentNode.children) : [];
        const index = siblings.indexOf(current);
        if (index > 0 && siblings.length > 1) {
          selector += `:nth-child(${index + 1})`;
        }
      }
      
      path.unshift(selector);
      current = current.parentNode;
      depth++;
    }
    
    return path.join(' > ');
  },

  generateIssueId(...args) {
    // Create a stable ID based on element and colors
    const str = args.join('-');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).slice(0, 8);
  }
};