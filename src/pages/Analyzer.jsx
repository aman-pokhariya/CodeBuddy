import { useState, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, Modal, ErrorAlert, SuccessAlert, LoadingSpinner } from '../components';
import { CodeAnalyzer } from '../utils/codeAnalyzer';
import { AlertCircle, CheckCircle, Zap, Code, Save } from 'lucide-react';

/**
 * Code Analyzer Page
 * Main feature for analyzing code and providing feedback
 */
function Analyzer() {
  const [code, setCode] = useState('// Write or paste your code here\nfunction example() {\n  console.log("Hello, CodeBuddy!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const editorRef = useRef(null);
  const { user } = useAuth();
  const { saveAnalysis } = useApp();

  // Debounced analysis would be nice but let's make the button click for now
  const handleAnalyze = useCallback((sourceCode = code) => {
    const targetCode = sourceCode || code;
    if (!targetCode.trim()) {
      setErrorMessage('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    // Simulate async analysis (in production, this would call an API)
    setTimeout(() => {
      try {
        const result = CodeAnalyzer.analyze(targetCode);
        const recommendations = CodeAnalyzer.getRecommendations(result);
        
        setAnalysis({
          ...result,
          recommendations,
          language,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        setErrorMessage('Error analyzing code: ' + err.message);
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);
  }, [code, language]);

  const normalizeIndentation = (text) => {
    return text
      .split('\n')
      .map(line => line.replace(/\t/g, '  ').replace(/^\s+/, match => ' '.repeat(Math.floor(match.length / 2) * 2)))
      .join('\n');
  };

  const handleApplyFix = useCallback((fixType) => {
    let fixedCode = code;

    switch (fixType) {
      case 'replaceVar':
        fixedCode = fixedCode.replace(/\bvar\s+/g, 'let ');
        break;
      case 'removeConsole':
        fixedCode = fixedCode.replace(/console\.log\([^)]*\);?/g, '');
        break;
      case 'normalizeIndent':
        fixedCode = normalizeIndentation(fixedCode);
        break;
      case 'refactorNesting':
        setErrorMessage('This issue requires manual refactoring. Review the recommendation for guidance.');
        return;
      default:
        return;
    }

    setCode(fixedCode);
    handleAnalyze(fixedCode);
  }, [code, handleAnalyze]);

  // Memoized recommendations for performance
  const displayedRecommendations = useMemo(() => {
    return analysis?.recommendations || [];
  }, [analysis]);

  const handleSaveAnalysis = useCallback(async () => {
    if (!saveTitle.trim()) {
      setErrorMessage('Please enter a title for this analysis');
      return;
    }

    try {
      setErrorMessage('');
      await saveAnalysis(user.uid, {
        title: saveTitle,
        code,
        language,
        analysis: analysis,
        tags: language ? [language] : []
      });

      setSuccessMessage('Analysis saved successfully!');
      setSaveTitle('');
      setShowSaveModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to save analysis: ' + err.message);
    }
  }, [saveTitle, code, language, analysis, user, saveAnalysis]);

  const handleClearCode = () => {
    setCode('');
    setAnalysis(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Code Analyzer</h1>
          <p className="text-gray-400">Analyze your code for quality issues and get improvement suggestions</p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage('')}
              dismissible
            />
          </div>
        )}
        {successMessage && (
          <div className="mb-4">
            <SuccessAlert
              message={successMessage}
              onClose={() => setSuccessMessage('')}
              dismissible
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Column */}
          <div>
            <Card className="flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code size={20} />
                  Code Editor
                </h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              {/* Editor Textarea */}
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded font-mono text-sm text-white p-4 focus:border-purple-500 focus:outline-none resize-none min-h-96"
                placeholder="Paste your code here..."
              />

              {/* Editor Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                <Button
                  variant="primary"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !code.trim()}
                  className="flex items-center gap-2 flex-1"
                >
                  <Zap size={16} />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClearCode}
                  disabled={!code.trim()}
                >
                  Clear
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            {isAnalyzing && (
              <Card className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mb-4" />
                  <p className="text-gray-400">Analyzing your code...</p>
                </div>
              </Card>
            )}

            {analysis && !isAnalyzing && (
              <>
                {/* Quality Score */}
                <Card>
                  <div className="flex items-end justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Code Quality</h3>
                    <Badge variant={analysis.quality >= 70 ? 'success' : analysis.quality >= 50 ? 'warning' : 'error'}>
                      {analysis.quality}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        analysis.quality >= 70
                          ? 'bg-green-500'
                          : analysis.quality >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${analysis.quality}%` }}
                    />
                  </div>
                </Card>

                {/* Metrics */}
                <Card>
                  <h3 className="text-lg font-bold text-white mb-4">Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Lines</p>
                      <p className="text-2xl font-bold text-white">{analysis.metrics.lines}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Functions</p>
                      <p className="text-2xl font-bold text-white">{analysis.metrics.functions}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Variables</p>
                      <p className="text-2xl font-bold text-white">{analysis.metrics.variables}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Time Complexity</p>
                      <p className="text-xl font-bold text-purple-400">{analysis.timeComplexity}</p>
                    </div>
                  </div>
                </Card>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle size={20} className="text-red-500" />
                      Issues ({analysis.issues.length})
                    </h3>
                    <div className="space-y-3">
                      {analysis.issues.map((issue, idx) => (
                        <div key={idx} className="p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg">
                          <p className="text-red-200 font-semibold text-sm">{issue.message}</p>
                          <Badge variant="error" size="sm" className="mt-2">
                            {issue.severity}
                          </Badge>
                          {issue.fixType && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleApplyFix(issue.fixType)}
                              >
                                Fix Issue
                              </Button>
                              <p className="text-gray-300 text-xs italic">{issue.fixDescription}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Warnings */}
                {analysis.warnings.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle size={20} className="text-yellow-500" />
                      Warnings ({analysis.warnings.length})
                    </h3>
                    <div className="space-y-3">
                      {analysis.warnings.map((warning, idx) => (
                        <div key={idx} className="p-3 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg">
                          <p className="text-yellow-200 font-semibold text-sm">{warning.message}</p>
                          {warning.fixType && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleApplyFix(warning.fixType)}
                              >
                                Fix Warning
                              </Button>
                              <p className="text-gray-300 text-xs italic">{warning.fixDescription}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Recommendations */}
                {displayedRecommendations.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-500" />
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {displayedRecommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="text-green-400 mt-1">•</span>
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Action Buttons */}
                {analysis && (
                  <div className="space-y-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const fixable = [...analysis.issues, ...analysis.warnings].some(item => item.fixType);
                        if (fixable) {
                          const fixTypes = [...analysis.issues, ...analysis.warnings]
                            .filter(item => item.fixType)
                            .map(item => item.fixType);
                          if (fixTypes.includes('replaceVar')) handleApplyFix('replaceVar');
                          else if (fixTypes.includes('removeConsole')) handleApplyFix('removeConsole');
                          else if (fixTypes.includes('normalizeIndent')) handleApplyFix('normalizeIndent');
                        } else {
                          setErrorMessage('No auto-fixable issues detected.');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      Fix Auto-Fixable Issues
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setShowSaveModal(true)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save Analysis
                    </Button>
                  </div>
                )}
              </>
            )}

            {!analysis && !isAnalyzing && (
              <Card className="text-center py-12">
                <Zap size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Enter code and click "Analyze Code" to get started</p>
              </Card>
            )}
          </div>
        </div>

        {/* Save Modal */}
        <Modal
          isOpen={showSaveModal}
          title="Save Analysis"
          onClose={() => setShowSaveModal(false)}
          size="sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Analysis Title</label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="e.g., Login Function Review"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleSaveAnalysis}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowSaveModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Analyzer;
