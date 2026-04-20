/**
 * Learning Recommendations Engine
 * Provides personalized learning suggestions based on code analysis
 */

// Learning topics with descriptions and difficulty levels
export const LEARNING_TOPICS = {
  'performance': {
    name: 'Performance Optimization',
    description: 'Write efficient algorithms and optimize code execution',
    difficulty: 'intermediate',
    resources: [
      'Big-O Time Complexity',
      'Space Complexity Analysis',
      'Algorithm Optimization Techniques',
      'Caching and Memoization'
    ]
  },
  'readability': {
    name: 'Code Readability',
    description: 'Write clean, understandable code following best practices',
    difficulty: 'beginner',
    resources: [
      'Naming Conventions',
      'Code Comments and Documentation',
      'Function Length Guidelines',
      'Variable Scope Management'
    ]
  },
  'patterns': {
    name: 'Design Patterns',
    description: 'Use proven architectural solutions for common problems',
    difficulty: 'intermediate',
    resources: [
      'MVC Pattern',
      'Observer Pattern',
      'Singleton Pattern',
      'Factory Pattern'
    ]
  },
  'testing': {
    name: 'Unit Testing',
    description: 'Write tests to ensure code reliability',
    difficulty: 'intermediate',
    resources: [
      'Test Writing Basics',
      'Mocking and Stubbing',
      'Test Coverage',
      'Integration Testing'
    ]
  },
  'security': {
    name: 'Code Security',
    description: 'Write secure code to prevent vulnerabilities',
    difficulty: 'advanced',
    resources: [
      'Input Validation',
      'SQL Injection Prevention',
      'XSS Prevention',
      'Authentication Best Practices'
    ]
  },
  'javascript': {
    name: 'JavaScript Fundamentals',
    description: 'Master JavaScript core concepts',
    difficulty: 'beginner',
    resources: [
      'Closures',
      'Async/Await',
      'Promises',
      'Event Loop'
    ]
  },
  'python': {
    name: 'Python Fundamentals',
    description: 'Master Python core concepts',
    difficulty: 'beginner',
    resources: [
      'List Comprehensions',
      'Decorators',
      'Context Managers',
      'Generators'
    ]
  }
};

/**
 * Analyze weak areas from user's analyses and return learning recommendations
 * @param {array} analyses - User's analyses history
 * @returns {array} - Recommended learning topics
 */
export function generateLearningRecommendations(analyses) {
  if (!analyses || analyses.length === 0) {
    return [];
  }

  // Calculate weak areas
  const weakAreas = {};
  
  analyses.forEach(analysis => {
    if (!analysis.analysis) return;

    const quality = analysis.analysis.quality || 0;
    
    // Identify issues
    if (analysis.analysis.issues && analysis.analysis.issues.length > 0) {
      analysis.analysis.issues.forEach(issue => {
        const category = categorizeIssue(issue);
        if (category) {
          weakAreas[category] = (weakAreas[category] || 0) + 1;
        }
      });
    }

    // Complexity issues
    if (analysis.analysis.timeComplexity === 'O(n²)' || analysis.analysis.metrics?.complexity > 5) {
      weakAreas['performance'] = (weakAreas['performance'] || 0) + 1;
    }

    // Quality score issues
    if (quality < 50) {
      weakAreas['readability'] = (weakAreas['readability'] || 0) + 1;
    }
  });

  // Convert to recommendations sorted by frequency
  const recommendations = Object.entries(weakAreas)
    .map(([topic, score]) => ({
      topic,
      score,
      ...LEARNING_TOPICS[topic]
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return recommendations;
}

/**
 * Categorize an issue into a learning topic
 * @param {object} issue - The issue object
 * @returns {string} - Category name
 */
function categorizeIssue(issue) {
  const message = (issue.message || '').toLowerCase();
  
  if (message.includes('performance') || message.includes('complexity') || message.includes('optimize')) {
    return 'performance';
  }
  if (message.includes('var') || message.includes('readable') || message.includes('naming')) {
    return 'readability';
  }
  if (message.includes('design') || message.includes('pattern') || message.includes('structure')) {
    return 'patterns';
  }
  if (message.includes('test') || message.includes('coverage')) {
    return 'testing';
  }
  if (message.includes('security') || message.includes('inject') || message.includes('vulnerable')) {
    return 'security';
  }
  
  return null;
}

/**
 * Get a personalized learning path based on recommendations
 * @param {array} recommendations - Recommended topics from generateLearningRecommendations
 * @returns {object} - Personalized learning path
 */
export function generateLearningPath(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return {
      title: 'Beginner',
      description: 'Start with JavaScript fundamentals',
      topics: ['javascript', 'readability'],
      duration: '2-3 weeks'
    };
  }

  const topicsToLearn = recommendations.map(r => r.topic).slice(0, 3);
  
  return {
    title: 'Custom Learning Path',
    description: `Master ${topicsToLearn.join(', ')} to improve your code quality`,
    topics: topicsToLearn,
    recommendations,
    duration: '4-6 weeks'
  };
}

/**
 * Get learning resources for a specific topic
 * @param {string} topic - Topic name
 * @returns {object} - Topic details and resources
 */
export function getTopicResources(topic) {
  return LEARNING_TOPICS[topic] || null;
}

/**
 * Calculate user proficiency level
 * @param {array} analyses - User's analyses
 * @returns {object} - Proficiency assessment
 */
export function calculateProficiency(analyses) {
  if (!analyses || analyses.length === 0) {
    return {
      level: 'beginner',
      score: 0,
      description: 'No data yet. Start analyzing code to track progress.'
    };
  }

  // Calculate average quality
  const avgQuality = Math.round(
    analyses.reduce((sum, a) => sum + (a.analysis?.quality || 0), 0) / analyses.length
  );

  // Calculate consistency (lower variation is better)
  const qualities = analyses.map(a => a.analysis?.quality || 0);
  const mean = avgQuality;
  const variance = qualities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / qualities.length;
  const consistency = Math.max(0, 100 - Math.sqrt(variance));

  // Determine level
  let level, description;
  if (avgQuality >= 80 && consistency >= 70) {
    level = 'expert';
    description = 'You write high-quality code consistently!';
  } else if (avgQuality >= 70) {
    level = 'intermediate';
    description = 'Good progress! Keep working on weaker areas.';
  } else if (avgQuality >= 50) {
    level = 'intermediate';
    description = 'Solid foundation. Focus on consistency.';
  } else {
    level = 'beginner';
    description = 'Keep practicing! Improvement comes with time.';
  }

  return {
    level,
    score: Math.round((avgQuality + consistency) / 2),
    description,
    metrics: {
      avgQuality,
      consistency: Math.round(consistency),
      totalAnalyses: analyses.length
    }
  };
}

export default {
  LEARNING_TOPICS,
  generateLearningRecommendations,
  generateLearningPath,
  getTopicResources,
  calculateProficiency
};
