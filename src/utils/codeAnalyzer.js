/**
 * Analyze code for common issues and quality metrics
 * This is a client-side analyzer for demonstration
 */

export class CodeAnalyzer {
  /**
   * Analyze code for issues
   * @param {string} code - The code to analyze
   * @returns {object} - Analysis results
   */
  static analyze(code) {
    const issues = [];
    const warnings = [];
    const metrics = {
      lines: 0,
      functions: 0,
      variables: 0,
      complexity: 0
    };

    // Count lines
    const lines = code.split('\n').filter(line => line.trim()).length;
    metrics.lines = lines;

    // Find functions
    const functionMatches = code.match(/\bfunction\b|\b(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/g) || [];
    metrics.functions = functionMatches.length;

    // Find variables
    const varMatches = code.match(/\b(const|let|var)\s+\w+/g) || [];
    metrics.variables = varMatches.length;

    // Check for common issues
    if (code.includes('var ')) {
      warnings.push({
        type: 'warning',
        message: 'Using "var" is discouraged. Consider using "const" or "let".',
        severity: 'low'
      });
    }

    if (code.match(/function\s*\(.*\{[\s\S]*if[\s\S]*if/)) {
      issues.push({
        type: 'complexity',
        message: 'High cyclomatic complexity detected. Consider refactoring nested conditions.',
        severity: 'medium'
      });
      metrics.complexity += 2;
    }

    if (code.match(/console\.log/g)) {
      warnings.push({
        type: 'warning',
        message: 'Found console.log() statements. Remove before production.',
        severity: 'low'
      });
    }

    if (code.match(/\s{4,}/g)) {
      warnings.push({
        type: 'style',
        message: 'Inconsistent indentation detected.',
        severity: 'low'
      });
    }

    // Check for performance issues
    if (code.match(/\.map\(.*\.filter\(|\.filter\(.*\.map\(/)) {
      issues.push({
        type: 'performance',
        message: 'Chained map/filter operations. Consider combining for better performance.',
        severity: 'medium'
      });
    }

    // Estimate time complexity
    const timeComplexity = this.estimateTimeComplexity(code);

    return {
      issues,
      warnings,
      metrics,
      timeComplexity,
      quality: this.calculateQuality(issues, warnings)
    };
  }

  /**
   * Estimate time complexity of code
   * @param {string} code - The code to analyze
   * @returns {string} - Estimated time complexity
   */
  static estimateTimeComplexity(code) {
    let complexity = 'O(1)'; // Default

    if (code.match(/\bfor\b.*\bfor\b/)) {
      complexity = 'O(n²)';
    } else if (code.match(/\bwhile\b.*\bwhile\b/)) {
      complexity = 'O(n²)';
    } else if (code.match(/\bfor\b|\bwhile\b/)) {
      complexity = 'O(n)';
    }

    if (code.match(/\.sort\(|\.reverse\(/)) {
      complexity = 'O(n log n)';
    }

    return complexity;
  }

  /**
   * Calculate code quality score
   * @param {array} issues - Issues found
   * @param {array} warnings - Warnings found
   * @returns {number} - Quality score 0-100
   */
  static calculateQuality(issues, warnings) {
    let score = 100;
    score -= issues.length * 15;
    score -= warnings.length * 5;
    return Math.max(0, score);
  }

  /**
   * Get recommendations based on analysis
   * @param {object} analysis - Analysis results
   * @returns {array} - Array of recommendations
   */
  static getRecommendations(analysis) {
    const recommendations = [];

    if (analysis.quality < 50) {
      recommendations.push('Code quality is low. Review issues and refactor.');
    }

    if (analysis.metrics.complexity > 5) {
      recommendations.push('Consider breaking down complex functions into smaller ones.');
    }

    if (analysis.metrics.lines > 300) {
      recommendations.push('This file is quite large. Consider splitting it into multiple files.');
    }

    if (analysis.timeComplexity === 'O(n²)') {
      recommendations.push('Time complexity is O(n²). Look for optimization opportunities.');
    }

    if (analysis.issues.length === 0 && analysis.warnings.length === 0) {
      recommendations.push('Great job! Your code looks clean and well-structured.');
    }

    return recommendations;
  }
}

export default CodeAnalyzer;
