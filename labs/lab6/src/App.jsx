import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { ThemeProvider } from './context/ThemeContext'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'

function Layout({ children }) {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Header />
      <main className="container py-4 flex-grow-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <Projects />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/messages"
          element={
            <Layout>
              <Messages />
            </Layout>
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
