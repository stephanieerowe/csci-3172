import { useEffect, useState } from 'react'
import { fetchProjects } from '../services/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProjects() {
      setStatus('loading')

      try {
        const result = await fetchProjects()

        if (!mounted) {
          return
        }

        setProjects(result)
        setStatus('success')
      } catch (loadError) {
        if (!mounted) {
          return
        }

        setError(loadError.message)
        setStatus('error')
      }
    }

    loadProjects()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section>
      <h1 className="h2 mb-3">Projects</h1>
      <p className="mb-4">Portfolio projects loaded asynchronously from a JSON source.</p>

      {status === 'loading' && <p>Loading projects...</p>}
      {status === 'error' && <p className="text-danger">{error}</p>}

      <div className="row g-3">
        {status === 'success' &&
          projects.map((project) => (
            <article key={project.name} className="col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h2 className="h5">{project.name}</h2>
                  <p className="mb-2">
                    <strong>Author:</strong> {project.author}
                  </p>
                  <p className="mb-2">
                    <strong>Languages:</strong> {project.languages.join(', ')}
                  </p>
                  <p className="mb-0">{project.description}</p>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}

export default Projects
