import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, LoadingSpinner } from '../components';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Code, TrendingUp, AlertCircle, BookOpen, Target, Activity } from 'lucide-react';
import { formatRelativeTime, formatDate } from '../utils/helpers';

/**
 * Dashboard Page
 * Shows overview of user's code analysis history and progress
 */
function Dashboard() {
  const { userProfile, user } = useAuth();
  const { analyses, fetchAnalyses, loading: appLoading } = useApp();
  const [isLoading, setIsLoading] = useState(true);

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

  // Calculate statistics with useMemo for performance
  const statistics = useMemo(() => {
    if (!analyses || analyses.length === 0) {
      return {
        totalAnalyses: 0,
        averageQuality: 0,
        weakTopics: [],
        recentAnalyses: [],
        qualityTrend: []
      };
    }

    // Total analyses
    const totalAnalyses = analyses.length;

    // Average quality
    const averageQuality = Math.round(
      analyses.reduce((sum, a) => sum + (a.quality || 0), 0) / totalAnalyses
    );

    // Weak topics (topics with lower quality)
    const topicScores = {};
    analyses.forEach(a => {
      if (a.tags && Array.isArray(a.tags)) {
        a.tags.forEach(tag => {
          topicScores[tag] = (topicScores[tag] || 0) + (a.quality || 0);
        });
      }
    });

    const weakTopics = Object.entries(topicScores)
      .map(([topic, score]) => ({
        topic,
        score: Math.round(score / (analyses.filter(a => a.tags?.includes(topic)).length || 1))
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    // Recent analyses
    const recentAnalyses = [...analyses]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Quality trend data for chart
    const qualityTrend = [...analyses]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-10)
      .map((a, i) => ({
        name: `#${i + 1}`,
        quality: a.quality || 0
      }));

    return {
      totalAnalyses,
      averageQuality,
      weakTopics,
      recentAnalyses,
      qualityTrend
    };
  }, [analyses]);

  // Memoized stat card component
  const StatCard = useCallback(({ icon: Icon, label, value, trend, color }) => (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>}
      </div>
    </Card>
  ), []);

  if (isLoading || appLoading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userProfile?.displayName || 'User'}!
          </h1>
          <p className="text-gray-400">Track your code analysis progress and improve your skills</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Code}
            label="Total Analyses"
            value={statistics.totalAnalyses}
            color="bg-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Quality"
            value={`${statistics.averageQuality}%`}
            color="bg-blue-600"
          />
          <StatCard
            icon={BookOpen}
            label="Learning Areas"
            value={statistics.weakTopics.length}
            color="bg-green-600"
          />
          <StatCard
            icon={Activity}
            label="Recent Activity"
            value={statistics.recentAnalyses.length}
            color="bg-orange-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quality Trend Chart */}
            {statistics.qualityTrend.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Quality Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statistics.qualityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                      labelStyle={{ color: '#FFF' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#A855F7"
                      strokeWidth={2}
                      dot={{ fill: '#A855F7', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Recent Analyses */}
            <Card>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={20} />
                Recent Analyses
              </h2>
              {statistics.recentAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {statistics.recentAnalyses.map(analysis => (
                    <div
                      key={analysis.id}
                      className="flex items-start justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-semibold line-clamp-1">{analysis.title || 'Untitled'}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {formatRelativeTime(analysis.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge variant={analysis.quality > 70 ? 'success' : 'warning'}>
                          {analysis.quality}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No analyses yet. Start by uploading your first code!</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weak Topics */}
            {statistics.weakTopics.length > 0 && (
              <Card>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-yellow-500" />
                  Areas to Improve
                </h2>
                <div className="space-y-3">
                  {statistics.weakTopics.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{item.topic}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-8 text-right">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/analyzer" className="block">
                  <Button variant="primary" size="md" className="w-full">
                    Analyze Code
                  </Button>
                </Link>
                <Link to="/history" className="block">
                  <Button variant="secondary" size="md" className="w-full">
                    View History
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tips Card */}
            <Card>
              <h2 className="text-lg font-bold text-white mb-4">💡 Daily Tip</h2>
              <p className="text-gray-300 text-sm">
                Focus on one weak area at a time. Consistent practice improves your skills faster than attempting everything at once.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
