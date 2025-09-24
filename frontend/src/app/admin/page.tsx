"use client";

import { useState, useEffect } from "react";
import { getUsers, getCaptureSessions, getDatabaseStats, deleteUser, getCaptureSessionWithImages, getAllFaceImagesWithMetadata, getUserFaceImagesWithMetadata } from "@/lib/database";
import { cleanupOrphanedImages } from "@/lib/storage";
import type { UserRecord, CaptureSessionRecord, FaceImageRecord, FaceMetadataRecord } from "@/lib/database";
import AdminLogin from "@/components/AdminLogin";

/**
 * Admin Panel: Professional admin interface for managing face collection data
 * 
 * Features:
 * - User management
 * - Capture session monitoring
 * - Database statistics
 * - Data export capabilities
 * - Professional UI design
 */

// ============================================================================
// TYPES
// ============================================================================

interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  totalImages: number;
  completedSessions: number;
  failedSessions: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminPage() {

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sessions' | 'images'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [sessions, setSessions] = useState<(CaptureSessionRecord & { user: UserRecord })[]>([]);
  const [images, setImages] = useState<(FaceImageRecord & { user: UserRecord; metadata: FaceMetadataRecord | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSessionImages, setSelectedSessionImages] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [qualityFilter, setQualityFilter] = useState<'High' | 'Medium' | 'Low' | 'All'>('All');
  const [selectedUserImages, setSelectedUserImages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const loadStats = async () => {
    try {
      const statsData = await getDatabaseStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
      setError("Failed to load statistics");
    }
  };

  const loadUsers = async (page: number = 1) => {
    try {
      const { users: usersData } = await getUsers(page, itemsPerPage);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users");
    }
  };

  const loadSessions = async (page: number = 1) => {
    try {
      const { sessions: sessionsData } = await getCaptureSessions(page, itemsPerPage);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error loading sessions:", error);
      setError("Failed to load capture sessions");
    }
  };

  const loadImages = async (page: number = 1, qualityFilter?: 'High' | 'Medium' | 'Low') => {
    try {
      const { images: imagesData } = await getAllFaceImagesWithMetadata(page, itemsPerPage, qualityFilter);
      setImages(imagesData);
    } catch (error) {
      console.error("Error loading images:", error);
      setError("Failed to load face images");
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadStats(),
        loadUsers(currentPage),
        loadSessions(currentPage),
        loadImages(currentPage, qualityFilter === 'All' ? undefined : qualityFilter as 'High' | 'Medium' | 'Low')
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // AUTHENTICATION HANDLERS
  // ============================================================================

  const handleLogin = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setLoading(true);
      loadData();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [currentPage, isAuthenticated, qualityFilter]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(userId);
      await loadData(); // Reload data
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleTabChange = (tab: 'overview' | 'users' | 'sessions' | 'images') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const loadSessionImages = async (sessionId: string) => {
    try {
      const sessionData = await getCaptureSessionWithImages(sessionId);
      if (sessionData) {
        setSelectedSession(sessionData.session);
        setSelectedSessionImages(sessionData.images);
        setActiveTab('images');
      }
    } catch (error) {
      console.error('Error loading session images:', error);
      setError('Failed to load session images');
    }
  };

  const loadUserImages = async (userId: string) => {
    try {
      const userImages = await getUserFaceImagesWithMetadata(userId);
      const user = users.find(u => u.id === userId);
      if (user) {
        console.log('Loaded user images:', userImages); // Debug log
        setSelectedUser(user);
        setSelectedUserImages(userImages);
        setActiveTab('images');
      }
    } catch (error) {
      console.error('Error loading user images:', error);
      setError('Failed to load user images');
    }
  };

  const handleCleanupOrphanedImages = async () => {
    if (!confirm('This will delete all images in storage that don\'t have corresponding database records. Continue?')) {
      return;
    }

    setIsCleaningUp(true);
    try {
      const result = await cleanupOrphanedImages();
      alert(`Cleanup completed! Deleted ${result.deleted} orphaned folders. ${result.errors.length > 0 ? `Errors: ${result.errors.length}` : 'No errors.'}`);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error during cleanup:', error);
      alert('Failed to cleanup orphaned images');
    } finally {
      setIsCleaningUp(false);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800',
      'archived': 'bg-gray-100 text-gray-800',
      'deleted': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '🧑';
      default: return '👤';
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'Center': return '👁️';
      case 'Left': return '👈';
      case 'Right': return '👉';
      case 'Up': return '👆';
      case 'Down': return '👇';
      default: return '👤';
    }
  };

  const getQualityColor = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityIcon = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High': return '✅';
      case 'Medium': return '⚠️';
      case 'Low': return '❌';
      default: return '❓';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Admin Panel...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Face Collection System</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'sessions', label: 'Sessions', icon: '📸' },
              { id: 'images', label: 'Images', icon: '🖼️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completedSessions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalSessions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Images</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalImages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Failed Sessions</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.failedSessions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start New Capture
                </a>
                <a
                  href="/admin/ml-export"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export for ML Training
                </a>
                <button
                  onClick={() => setActiveTab('users')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View All Users
                </button>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View All Sessions
                </button>
                <button
                  onClick={handleCleanupOrphanedImages}
                  disabled={isCleaningUp}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCleaningUp ? 'Cleaning...' : 'Cleanup Orphaned Images'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Users</h2>
              <span className="text-sm text-gray-500">{users.length} users</span>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{getGenderIcon(user.gender)}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">Age: {user.age}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">Age: {user.age} • {user.gender}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => loadUserImages(user.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            View Images
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Capture Sessions</h2>
              <span className="text-sm text-gray-500">{sessions.length} sessions</span>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{getGenderIcon(session.user.gender)}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                              <div className="text-sm text-gray-500">ID: {session.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(session.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.successful_images}/{session.total_images}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.failed_images > 0 && `${session.failed_images} failed`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(session.started_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.completed_at ? formatDate(session.completed_at) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setActiveTab('images')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Images
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedSession ? `Images for ${selectedSession.user?.name}` :
                  selectedUser ? `Images for ${selectedUser.name}` : 'Captured Images'}
              </h2>
              <div className="flex items-center space-x-4">
                {!selectedSession && !selectedUser && (
                  <select
                    value={qualityFilter}
                    onChange={(e) => setQualityFilter(e.target.value as 'High' | 'Medium' | 'Low' | 'All')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Quality</option>
                    <option value="High">High Quality</option>
                    <option value="Medium">Medium Quality</option>
                    <option value="Low">Low Quality</option>
                  </select>
                )}
                <button
                  onClick={() => {
                    if (selectedSession) {
                      setActiveTab('sessions');
                      setSelectedSession(null);
                      setSelectedSessionImages([]);
                    } else if (selectedUser) {
                      setActiveTab('users');
                      setSelectedUser(null);
                      setSelectedUserImages([]);
                    } else {
                      setActiveTab('sessions');
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to {selectedSession ? 'Sessions' : selectedUser ? 'Users' : 'Sessions'}
                </button>
              </div>
            </div>

            {selectedSession ? (
              // Show specific session images
              <div className="space-y-6">
                {/* Session Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">{getGenderIcon(selectedSession.user?.gender)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{selectedSession.user?.name}</h3>
                      <p className="text-sm text-gray-500">Age: {selectedSession.user?.age} • {selectedSession.user?.gender}</p>
                      <p className="text-xs text-gray-400">{formatDate(selectedSession.started_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      {getStatusBadge(selectedSession.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Images:</span>
                      <span className="text-sm text-gray-600">
                        {selectedSession.successful_images}/{selectedSession.total_images}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedSessionImages.map((image, index) => (
                    <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                        <img
                          src={image.image_url}
                          alt={`${image.step} pose`}
                          className="w-full h-full object-cover"
                        />
                        {image.metadata && Array.isArray(image.metadata) && image.metadata[0] && (
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(image.metadata[0].quality_overall)}`}>
                              <span className="mr-1">{getQualityIcon(image.metadata[0].quality_overall)}</span>
                              {image.metadata[0].quality_overall}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {getStepIcon(image.step)} {image.step} Pose
                        </h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium">{image.width} × {image.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>File:</span>
                            <span className="font-medium">{(image.file_size / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Captured:</span>
                            <span className="font-medium">{formatDate(image.created_at)}</span>
                          </div>

                          {image.metadata && Array.isArray(image.metadata) && image.metadata[0] && (
                            <>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-700">Quality:</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(image.metadata[0].quality_overall)}`}>
                                    <span className="mr-1">{getQualityIcon(image.metadata[0].quality_overall)}</span>
                                    {image.metadata[0].quality_overall}
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span>Face Size:</span>
                                    <span className={`font-medium ${image.metadata[0].quality_face_size === 'High' ? 'text-green-600' : image.metadata[0].quality_face_size === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {image.metadata[0].quality_face_size} ({image.metadata[0].face_width}×{image.metadata[0].face_height}px)
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Sharpness:</span>
                                    <span className={`font-medium ${image.metadata[0].quality_sharpness === 'High' ? 'text-green-600' : image.metadata[0].quality_sharpness === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {image.metadata[0].quality_sharpness} ({Math.round(image.metadata[0].sharpness_variance)})
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Lighting:</span>
                                    <span className={`font-medium ${image.metadata[0].quality_lighting === 'High' ? 'text-green-600' : image.metadata[0].quality_lighting === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {image.metadata[0].quality_lighting} ({Math.round(image.metadata[0].brightness_value)})
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSessionImages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📷</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Images Found</h3>
                    <p className="text-gray-600">This session doesn't have any captured images yet.</p>
                  </div>
                )}
              </div>
            ) : selectedUser ? (
              // Show specific user images
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">{getGenderIcon(selectedUser.gender)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-500">Age: {selectedUser.age} • {selectedUser.gender}</p>
                      <p className="text-xs text-gray-400">{formatDate(selectedUser.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      {getStatusBadge(selectedUser.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Images:</span>
                      <span className="text-sm text-gray-600">
                        {selectedUserImages.length} captured
                      </span>
                    </div>
                  </div>
                </div>


                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedUserImages.map((image, index) => (
                    <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                        <img
                          src={image.image_url}
                          alt={`${image.step} pose`}
                          className="w-full h-full object-cover"
                        />
                        {image.metadata && Array.isArray(image.metadata) && image.metadata[0] && (
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(image.metadata[0].quality_overall)}`}>
                              <span className="mr-1">{getQualityIcon(image.metadata[0].quality_overall)}</span>
                              {image.metadata[0].quality_overall}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {getStepIcon(image.step)} {image.step} Pose
                        </h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium">{image.width} × {image.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>File:</span>
                            <span className="font-medium">{(image.file_size / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Captured:</span>
                            <span className="font-medium">{formatDate(image.created_at)}</span>
                          </div>

                          {image.metadata && Array.isArray(image.metadata) && image.metadata[0] && (
                            <>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-700">Quality:</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(image.metadata[0].quality_overall)}`}>
                                    <span className="mr-1">{getQualityIcon(image.metadata[0].quality_overall)}</span>
                                    {image.metadata[0].quality_overall}
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span>Face Size:</span>
                                    <span className={`font-medium ${image.metadata[0].quality_face_size === 'High' ? 'text-green-600' : image.metadata[0].quality_face_size === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {image.metadata[0].quality_face_size} ({image.metadata[0].face_width}×{image.metadata[0].face_height}px)
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Sharpness:</span>
                                    <span className={`font-medium ${image.metadata[0].quality_sharpness === 'High' ? 'text-green-600' : image.metadata[0].quality_sharpness === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {image.metadata[0].quality_sharpness} ({Math.round(image.metadata[0].sharpness_variance)})
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Lighting:</span>
                                    <span className={`font-medium ${image.metadata[0].quality_lighting === 'High' ? 'text-green-600' : image.metadata[0].quality_lighting === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {image.metadata[0].quality_lighting} ({Math.round(image.metadata[0].brightness_value)})
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedUserImages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📷</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Images Found</h3>
                    <p className="text-gray-600">This user hasn't captured any images yet.</p>
                  </div>
                )}
              </div>
            ) : (
              // Show all images with quality information
              <div className="space-y-6">
                {/* Images Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {images.map((image) => (
                          <tr key={image.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-2xl mr-3">{getGenderIcon(image.user.gender)}</div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{image.user.name}</div>
                                  <div className="text-sm text-gray-500">Age: {image.user.age}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{getStepIcon(image.step)}</span>
                                <span className="text-sm font-medium text-gray-900">{image.step}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {image.metadata && Array.isArray(image.metadata) && image.metadata[0] ? (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(image.metadata[0].quality_overall)}`}>
                                  <span className="mr-1">{getQualityIcon(image.metadata[0].quality_overall)}</span>
                                  {image.metadata[0].quality_overall}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <span className="mr-1">❓</span>
                                  Unknown
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {image.metadata && Array.isArray(image.metadata) && image.metadata[0] ? (
                                <div className="space-y-1">
                                  <div>Size: {image.metadata[0].face_width}×{image.metadata[0].face_height}px</div>
                                  <div>Sharpness: {Math.round(image.metadata[0].sharpness_variance)}</div>
                                  <div>Brightness: {Math.round(image.metadata[0].brightness_value)}</div>
                                </div>
                              ) : (
                                <div>No quality data</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(image.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {images.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📷</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Images Found</h3>
                    <p className="text-gray-600">
                      {qualityFilter === 'All'
                        ? "No images have been captured yet."
                        : `No images found with ${qualityFilter.toLowerCase()} quality.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}