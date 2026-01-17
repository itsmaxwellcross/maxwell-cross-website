/**
 * MAXWELL CROSS - Code Block Enhancements
 * Adds language labels, copy buttons, and enhanced styling to code blocks
 * 
 * Features:
 * - Automatic language detection from class names
 * - Copy-to-clipboard functionality with visual feedback
 * - Wraps code blocks in tactical-styled containers
 * - Handles both pre-existing Prism classes and generic code blocks
 */

(function() {
    'use strict';

    // ===========================================
    // CONFIGURATION
    // ===========================================
    
    const CONFIG = {
        // Language display names mapping
        languageNames: {
            'javascript': 'JavaScript',
            'js': 'JavaScript',
            'python': 'Python',
            'py': 'Python',
            'bash': 'Bash',
            'shell': 'Shell',
            'sh': 'Shell',
            'powershell': 'PowerShell',
            'ps1': 'PowerShell',
            'json': 'JSON',
            'yaml': 'YAML',
            'yml': 'YAML',
            'sql': 'SQL',
            'html': 'HTML',
            'xml': 'XML',
            'css': 'CSS',
            'c': 'C',
            'cpp': 'C++',
            'csharp': 'C#',
            'cs': 'C#',
            'php': 'PHP',
            'ruby': 'Ruby',
            'go': 'Go',
            'rust': 'Rust',
            'java': 'Java',
            'kotlin': 'Kotlin',
            'swift': 'Swift',
            'typescript': 'TypeScript',
            'ts': 'TypeScript',
            'markdown': 'Markdown',
            'md': 'Markdown',
            'dockerfile': 'Dockerfile',
            'docker': 'Docker',
            'nginx': 'Nginx',
            'apache': 'Apache',
            'ini': 'INI',
            'conf': 'Config',
            'toml': 'TOML',
            'regex': 'Regex',
            'diff': 'Diff',
            'plaintext': 'Plain Text',
            'text': 'Text',
            'none': 'Code'
        },
        
        // Copy button text states
        copyText: {
            default: 'Copy',
            success: 'Copied!'
        },
        
        // Timing
        copyFeedbackDuration: 2000, // ms to show "Copied!" state
        
        // Selectors
        selectors: {
            codeBlocks: 'pre code, pre[class*="language-"]',
            excludeClasses: ['mc-code-block', 'no-enhance']
        }
    };

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    /**
     * Detect language from element class names
     */
    function detectLanguage(element) {
        const classNames = element.className || '';
        const parentClassNames = element.parentElement?.className || '';
        const allClasses = `${classNames} ${parentClassNames}`;
        
        // Look for language-* or lang-* patterns
        const patterns = [
            /language-(\w+)/i,
            /lang-(\w+)/i,
            /\b(python|bash|javascript|powershell|json|yaml|sql|html|css|c|cpp|csharp|php|ruby|go|rust|java|shell)\b/i
        ];
        
        for (const pattern of patterns) {
            const match = allClasses.match(pattern);
            if (match) {
                return match[1].toLowerCase();
            }
        }
        
        return null;
    }

    /**
     * Get display name for a language
     */
    function getLanguageDisplayName(lang) {
        if (!lang) return 'Code';
        const normalized = lang.toLowerCase();
        return CONFIG.languageNames[normalized] || lang.toUpperCase();
    }

    /**
     * Create the copy button element
     */
    function createCopyButton() {
        const button = document.createElement('button');
        button.className = 'mc-code-copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        button.innerHTML = `
            <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${CONFIG.copyText.default}</span>
        `;
        return button;
    }

    /**
     * Create the language label element
     */
    function createLanguageLabel(language) {
        const label = document.createElement('span');
        label.className = 'mc-code-lang';
        label.setAttribute('data-lang', language || 'code');
        label.textContent = getLanguageDisplayName(language);
        return label;
    }

    /**
     * Copy text to clipboard with fallback
     */
    async function copyToClipboard(text) {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn('Clipboard API failed, trying fallback:', err);
            }
        }
        
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            console.error('Fallback copy failed:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * Handle copy button click
     */
    async function handleCopyClick(event) {
        const button = event.currentTarget;
        const codeBlock = button.closest('.mc-code-block');
        const codeElement = codeBlock.querySelector('code') || codeBlock.querySelector('pre');
        
        if (!codeElement) return;
        
        const text = codeElement.textContent || codeElement.innerText;
        const success = await copyToClipboard(text);
        
        if (success) {
            // Visual feedback
            button.classList.add('copied');
            const textSpan = button.querySelector('span');
            if (textSpan) {
                textSpan.textContent = CONFIG.copyText.success;
            }
            
            // Reset after delay
            setTimeout(() => {
                button.classList.remove('copied');
                if (textSpan) {
                    textSpan.textContent = CONFIG.copyText.default;
                }
            }, CONFIG.copyFeedbackDuration);
        }
    }

    // ===========================================
    // MAIN ENHANCEMENT LOGIC
    // ===========================================

    /**
     * Enhance a single code block
     */
    function enhanceCodeBlock(element) {
        // Determine the pre and code elements
        let pre, code;
        
        if (element.tagName === 'PRE') {
            pre = element;
            code = element.querySelector('code') || element;
        } else if (element.tagName === 'CODE') {
            pre = element.parentElement;
            code = element;
            
            // Skip inline code (code not inside pre)
            if (pre.tagName !== 'PRE') {
                return;
            }
        }
        
        // Skip if already enhanced
        if (pre.parentElement?.classList.contains('mc-code-block')) {
            return;
        }
        
        // Skip if explicitly excluded
        if (CONFIG.selectors.excludeClasses.some(cls => 
            pre.classList.contains(cls) || code.classList.contains(cls)
        )) {
            return;
        }
        
        // Detect language
        const language = detectLanguage(code) || detectLanguage(pre);
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mc-code-block';
        
        // Create header with language label and copy button
        const header = document.createElement('div');
        header.className = 'mc-code-header';
        
        const langLabel = createLanguageLabel(language);
        const copyButton = createCopyButton();
        copyButton.addEventListener('click', handleCopyClick);
        
        header.appendChild(langLabel);
        header.appendChild(copyButton);
        
        // Insert wrapper
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
        
        // Ensure Prism class is present for styling
        if (language && !code.classList.contains(`language-${language}`)) {
            code.classList.add(`language-${language}`);
            pre.classList.add(`language-${language}`);
        }
    }

    /**
     * Initialize all code blocks on the page
     */
    function initializeCodeBlocks() {
        // Find all code blocks
        const codeBlocks = document.querySelectorAll(CONFIG.selectors.codeBlocks);
        
        codeBlocks.forEach(enhanceCodeBlock);
        
        // Re-run Prism highlighting if available
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }

    /**
     * Watch for dynamically added code blocks
     */
    function observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            let hasNewCode = false;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(CONFIG.selectors.codeBlocks)) {
                            hasNewCode = true;
                        } else if (node.querySelectorAll) {
                            const nested = node.querySelectorAll(CONFIG.selectors.codeBlocks);
                            if (nested.length > 0) {
                                hasNewCode = true;
                            }
                        }
                    }
                });
            });
            
            if (hasNewCode) {
                // Debounce reinitialization
                clearTimeout(observer._timeout);
                observer._timeout = setTimeout(initializeCodeBlocks, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ===========================================
    // KEYBOARD ACCESSIBILITY
    // ===========================================

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Shift + C to copy focused code block
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
                const activeElement = document.activeElement;
                const codeBlock = activeElement.closest('.mc-code-block');
                
                if (codeBlock) {
                    event.preventDefault();
                    const copyButton = codeBlock.querySelector('.mc-code-copy');
                    if (copyButton) {
                        copyButton.click();
                    }
                }
            }
        });
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initializeCodeBlocks();
                observeDynamicContent();
                setupKeyboardShortcuts();
            });
        } else {
            initializeCodeBlocks();
            observeDynamicContent();
            setupKeyboardShortcuts();
        }
        
        // Also run after Prism loads (if it loads after this script)
        if (typeof Prism !== 'undefined') {
            Prism.hooks.add('complete', () => {
                // Re-enhance after Prism processes
                setTimeout(initializeCodeBlocks, 50);
            });
        }
    }

    // Start
    init();

    // ===========================================
    // PUBLIC API (for manual control)
    // ===========================================

    window.MaxwellCodeBlocks = {
        enhance: enhanceCodeBlock,
        init: initializeCodeBlocks,
        config: CONFIG
    };

})();
