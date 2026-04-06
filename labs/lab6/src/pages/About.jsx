import { useMemo, useState } from 'react'
import skills from '../data/skills'

const categories = ['All', ...new Set(skills.map((skill) => skill.category))]

function About() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const categoryMatch = category === 'All' || skill.category === category
      const queryMatch = skill.name.toLowerCase().includes(query.trim().toLowerCase())

      return categoryMatch && queryMatch
    })
  }, [category, query])

  return (
    <section className="row g-4">
      <div className="col-lg-6">
        <h1 className="h2 mb-3">About Me</h1>
        <p>
          I am a computer science student with a focus on modern full-stack web applications,
          accessibility, and practical software testing.
        </p>
        <p className="mt-3">
          <strong>Education:</strong> Dalhousie University, Computer Science
        </p>
        <p>
          <strong>Technical Expertise:</strong> React, JavaScript, responsive design, API
          integration, and test-driven development fundamentals.
        </p>
      </div>

      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h2 className="h4 mb-3">Skills Filter</h2>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label htmlFor="skillQuery" className="form-label">
                  Search skills
                </label>
                <input
                  id="skillQuery"
                  className="form-control"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Type a skill..."
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="skillCategory" className="form-label">
                  Category
                </label>
                <select
                  id="skillCategory"
                  className="form-select"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="list-group">
              {filteredSkills.map((skill) => (
                <li
                  key={`${skill.category}-${skill.name}`}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>{skill.name}</span>
                  <span className="badge text-bg-light border">{skill.category}</span>
                </li>
              ))}
              {filteredSkills.length === 0 && (
                <li className="list-group-item text-muted">No matching skills found.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
