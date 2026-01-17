/**
 * MAXWELL CROSS - Share Functionality
 * Handles the share popup toggle and copy-to-clipboard
 */

(function() {
    'use strict';

    // ===========================================
    // INITIALIZATION
    // ===========================================

    function init() {
        const shareToggle = document.getElementById('mc-share-toggle');
        const sharePopup = document.getElementById('mc-share-popup');
        const copyLinkBtn = document.getElementById('mc-copy-link');

        if (!shareToggle || !sharePopup) return;

        // Toggle popup on button click
        shareToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = sharePopup.classList.contains('is-active');
            
            if (isOpen) {
                closePopup();
            } else {
                openPopup();
            }
        });

        // Close popup when clicking outside
        document.addEventListener('click', function(e) {
            if (!sharePopup.contains(e.target) && !shareToggle.contains(e.target)) {
                closePopup();
            }
        });

        // Close popup on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePopup();
            }
        });

        // Copy link functionality
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', async function() {
                const url = window.location.href;
                
                try {
                    await navigator.clipboard.writeText(url);
                    showCopyFeedback(copyLinkBtn, true);
                } catch (err) {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = url;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.select();
                    
                    try {
                        document.execCommand('copy');
                        showCopyFeedback(copyLinkBtn, true);
                    } catch (err2) {
                        showCopyFeedback(copyLinkBtn, false);
                    }
                    
                    document.body.removeChild(textarea);
                }
            });
        }

        function openPopup() {
            sharePopup.classList.add('is-active');
            sharePopup.setAttribute('aria-hidden', 'false');
            shareToggle.setAttribute('aria-expanded', 'true');
            shareToggle.classList.add('is-active');
        }

        function closePopup() {
            sharePopup.classList.remove('is-active');
            sharePopup.setAttribute('aria-hidden', 'true');
            shareToggle.setAttribute('aria-expanded', 'false');
            shareToggle.classList.remove('is-active');
        }

        function showCopyFeedback(button, success) {
            const originalText = button.querySelector('span').textContent;
            const originalIcon = button.querySelector('svg').outerHTML;
            
            if (success) {
                button.classList.add('copied');
                button.querySelector('span').textContent = 'Copied!';
                button.querySelector('svg').outerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
            } else {
                button.querySelector('span').textContent = 'Failed';
            }
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.querySelector('span').textContent = originalText;
                button.querySelector('svg').outerHTML = originalIcon;
            }, 2000);
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
