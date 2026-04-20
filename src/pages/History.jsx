import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, Modal, ErrorAlert, SuccessAlert, LoadingSpinner } from '../components';
import { Trash2, Eye, Download, History, Search, Filter } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../utils/helpers';

/**
 * History Page
 * View, edit, and manage code analysis history
 */
function HistoryPage() {
  const { user } = useAuth();
  const { analyses, fetchAnalyses, deleteAnalysis, loading } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch analyses on mount
  useEffect(() => {
    const loadData = async () => {
      if (user?.uid) {
        try {
          await fetchAnalyses(user.uid);
        } catch (err) {
          console.error('Error fetching analyses:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user?.uid, fetchAnalyses]);

  // Filter and sort analyses with useMemo for performance
  const filteredAnalyses = useMemo(() => {
    let result = analyses || [];

    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(a =>
        (a.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      result = result.filter(a => a.language === selectedLanguage);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'quality-high') {
        return (b.analysis?.quality || 0) - (a.analysis?.quality || 0);
      } else if (sortBy === 'quality-low') {
        return (a.analysis?.quality || 0) - (b.analysis?.quality || 0);
      }
      return 0;
    });

    return result;
  }, [analyses, searchTerm, selectedLanguage, sortBy]);

  // Get unique languages
  const languages = useMemo(() => {
    const langs = new Set(analyses?.map(a => a.language) || []);
    return Array.from(langs).sort();
  }, [analyses]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!selectedAnalysis) return;

    try {
      setErrorMessage('');
      await deleteAnalysis(selectedAnalysis.id);
      setSuccessMessage('Analysis deleted successfully');
      setShowDeleteModal(false);
      setSelectedAnalysis(null);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to delete analysis: ' + err.message);
    }
  }, [selectedAnalysis, deleteAnalysis]);

  // Handle export
  const handleExport = useCallback((analysis) => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis_${analysis.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  if (isLoading || loading) {
    return <LoadingSpinner fullScreen text="Loading your analyses..." />;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <History size={32} />
            Analysis History
          </h1>
          <p className="text-gray-400">View and manage all your code analyses</p>
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

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="quality-high">Quality (High to Low)</option>
              <option value="quality-low">Quality (Low to High)</option>
            </select>
          </div>
        </Card>

        {/* Results */}
        {filteredAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredAnalyses.map(analysis => (
              <Card key={analysis.id} className="flex items-center justify-between hover:border-purple-500 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {analysis.title || 'Untitled Analysis'}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="primary" size="sm">
                      {analysis.language || 'Unknown'}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {formatRelativeTime(analysis.createdAt)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(analysis.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  {analysis.analysis?.quality && (
                    <Badge
                      variant={analysis.analysis.quality >= 70 ? 'success' : 'warning'}
                      size="md"
                    >
                      {analysis.analysis.quality}%
                    </Badge>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAnalysis(analysis)}
                      className="flex items-center gap-1"
                      title="View details"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExport(analysis)}
                      className="flex items-center gap-1"
                      title="Export as JSON"
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedAnalysis(analysis);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center gap-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <History size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-4">
              {analyses?.length === 0
                ? "You haven't analyzed any code yet"
                : 'No analyses match your filters'}
            </p>
          </Card>
        )}

        {/* View Modal */}
        <Modal
          isOpen={!!selectedAnalysis && !showDeleteModal}
          title="Analysis Details"
          onClose={() => setSelectedAnalysis(null)}
          size="lg"
        >
          {selectedAnalysis && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Title</h4>
                <p className="text-white">{selectedAnalysis.title || 'Untitled'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Language</h4>
                <Badge variant="primary">{selectedAnalysis.language}</Badge>
              </div>

              {selectedAnalysis.analysis && (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Quality Score</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedAnalysis.analysis.quality >= 70 ? 'success' : 'warning'}>
                        {selectedAnalysis.analysis.quality}%
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Code Preview</h4>
                    <pre className="bg-gray-800 p-3 rounded text-sm text-gray-300 overflow-auto max-h-40">
                      {selectedAnalysis.code?.substring(0, 500)}
                      {selectedAnalysis.code?.length > 500 ? '...' : ''}
                    </pre>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <Button
                  variant="secondary"
                  onClick={() => handleExport(selectedAnalysis)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          title="Delete Analysis"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAnalysis(null);
          }}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to delete <strong>{selectedAnalysis?.title || 'this analysis'}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAnalysis(null);
                }}
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

export default HistoryPage;
