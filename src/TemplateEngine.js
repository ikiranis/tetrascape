/**
 * TemplateEngine - Simple template engine for loading and rendering HTML templates
 * Handles template loading, variable substitution, and caching
 */
class TemplateEngine {
    constructor() {
        this.templateCache = new Map();
    }
    
    /**
     * Load a template from the views directory
     * @param {string} templateName - Name of the template file (without .html extension)
     * @returns {Promise<string>} The template content
     */
    async loadTemplate(templateName) {
        if (this.templateCache.has(templateName)) {
            return this.templateCache.get(templateName);
        }
        
        try {
            const response = await fetch(`../views/${templateName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${templateName}`);
            }
            const template = await response.text();
            this.templateCache.set(templateName, template);
            return template;
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            throw error;
        }
    }
    
    /**
     * Render a template with provided data
     * @param {string} template - The template string
     * @param {Object} data - Data object with values to substitute
     * @returns {string} Rendered HTML string
     */
    render(template, data) {
        let rendered = template;
        
        // Simple template variable substitution using {{variable}} syntax
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            rendered = rendered.replace(regex, data[key] !== undefined && data[key] !== null ? data[key] : '');
        });
        
        return rendered;
    }
    
    /**
     * Load and render a template in one call
     * @param {string} templateName - Name of the template file
     * @param {Object} data - Data object with values to substitute
     * @returns {Promise<string>} Rendered HTML string
     */
    async renderTemplate(templateName, data) {
        const template = await this.loadTemplate(templateName);
        return this.render(template, data);
    }
    
    /**
     * Clear template cache (useful for development)
     */
    clearCache() {
        this.templateCache.clear();
    }
}

export default TemplateEngine;
