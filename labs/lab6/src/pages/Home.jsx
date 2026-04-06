import { Link } from 'react-router-dom'
import WeatherWidget from '../components/WeatherWidget'

function Home() {
  return (
    <div className="row g-4 align-items-stretch">
      <div className="col-lg-7">
        <section className="card shadow-sm border-0 h-100">
          <div className="card-body p-4">
            <p className="text-uppercase small text-secondary mb-2">Welcome</p>
            <h1 className="display-6 fw-bold">Building Reliable, Accessible Web Experiences</h1>
            <p className="lead mb-4">
              I am Stephanie Rowe, a developer focused on clean front-end architecture,
              practical back-end services, and user-first design.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-primary" to="/projects">
                View Projects
              </Link>
              <Link className="btn btn-outline-primary" to="/contact">
                Contact Me
              </Link>
            </div>
          </div>
        </section>
      </div>
      <div className="col-lg-5">
        <WeatherWidget />
      </div>
    </div>
  )
}

export default Home
