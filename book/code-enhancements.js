/* Code Block Enhancements - Copy Button & Line Numbers */

(function() {
    'use strict';

    // Add copy button to all code blocks
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach((codeBlock, index) => {
            const pre = codeBlock.parentElement;
            
            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.setAttribute('data-index', index);
            
            // Add click handler
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const code = codeBlock.textContent;
                
                // Use modern clipboard API if available
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(code).then(() => {
                        showCopyFeedback(copyBtn);
                    }).catch(() => {
                        fallbackCopy(code, copyBtn);
                    });
                } else {
                    fallbackCopy(code, copyBtn);
                }
            });
            
            // Prevent text selection when clicking copy button
            copyBtn.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            
            pre.appendChild(copyBtn);
        });
    }

    // Fallback copy method for older browsers
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(button);
        } catch (err) {
            console.error('Failed to copy code', err);
            button.textContent = 'Error';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }
        
        document.body.removeChild(textArea);
    }

    // Show copy feedback
    function showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'rgba(16, 185, 129, 0.9)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'rgba(59, 130, 246, 0.9)';
        }, 2000);
    }

    // Add line numbers to code blocks
    function addLineNumbers() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(codeBlock => {
            const lines = codeBlock.textContent.split('\n');
            
            // Skip if only one line or empty
            if (lines.length <= 1) return;
            
            // Clear existing content
            codeBlock.innerHTML = '';
            
            // Add each line with line number
            lines.forEach((line, index) => {
                if (index === lines.length - 1 && line === '') return; // Skip last empty line
                
                const lineElement = document.createElement('div');
                lineElement.className = 'code-line';
                lineElement.setAttribute('data-line', index + 1);
                lineElement.textContent = line;
                
                codeBlock.appendChild(lineElement);
            });
        });
    }

    // Initialize when DOM is ready
    function init() {
        addCopyButtons();
        addLineNumbers();
        
        // Add custom styles for line numbers
        const style = document.createElement('style');
        style.textContent = `
            .code-line {
                position: relative;
                padding-left: 3.5rem;
                line-height: 1.7;
            }
            
            .code-line::before {
                content: attr(data-line);
                position: absolute;
                left: 0;
                top: 0;
                color: #475569;
                font-size: 12px;
                text-align: right;
                width: 2.5rem;
                padding-right: 1rem;
                border-right: 1px solid #334155;
                user-select: none;
                line-height: 1.7;
            }
            
            .code-line:hover::before {
                color: #64748b;
            }
        `;
        document.head.appendChild(style);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
