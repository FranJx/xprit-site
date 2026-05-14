import { useState, useContext } from 'react'
import { AuthContext, AuthProvider } from './context/AuthContext'
import './styles/main.css'
import './styles/comentarios.css'
import './styles/auth.css'
import './styles/create-post.css'
import './styles/modal.css'
import Sidebar from './components/Sidebar'
import Feed from './components/Feed'
import RightPanel from './components/RightPanel'
import Login from './components/Login'
import Register from './components/Register'
import CreatePostModal from './components/CreatePostModal'
import EditProfileModal from './components/EditProfileModal'
import Explore from './components/Explore'
import Community from './components/Community'
import UserProfile from './components/UserProfile'

function AppContent() {
  const { user, loading } = useContext(AuthContext)
  const [currentPage, setCurrentPage] = useState('feed')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [refreshFeed, setRefreshFeed] = useState(0)
  const [authMode, setAuthMode] = useState('login')
  const [profileUserId, setProfileUserId] = useState(null)

  const handleNavigate = (page, userId) => {
    setCurrentPage(page)
    if (userId) {
      setProfileUserId(userId)
    }
  }

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ fontSize: '24px', color: 'var(--text)' }}>⏳ Cargando...</div>
    </div>
  }

  if (!user) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    )
  }

  const renderMainContent = () => {
    switch (currentPage) {
      case 'feed':
        return <Feed key={refreshFeed} onNavigate={handleNavigate} />
      case 'explore':
        return <Explore onNavigate={handleNavigate} />
      case 'community':
        return <Community onNavigate={handleNavigate} />
      case 'profile':
        return <UserProfile userId={profileUserId || user.id} />
      default:
        return <Feed onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="app">
      <Sidebar 
        user={user} 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page)
          if (page === 'profile') {
            setProfileUserId(null) // Limpiar para mostrar mi perfil
          }
        }}
        onCreatePost={() => setShowCreatePost(true)}
        onEditProfile={() => setShowEditProfile(true)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderMainContent()}
      </div>
      <RightPanel user={user} onNavigate={handleNavigate} />
      <CreatePostModal 
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          setRefreshFeed(refreshFeed + 1)
          setCurrentPage('feed')
        }}
      />
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
