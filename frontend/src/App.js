import React, { useEffect, useState } from 'react'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading articles...</p>

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Article Dashboard</h1>

      {articles.map(article => (
        <div
          key={article._id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px'
          }}
        >
          <h3>{article.title || 'Untitled Article'}</h3>

          <p>
            Status:{' '}
            <strong>
              {article.isUpdated ? 'Updated ✅' : 'Not Updated ❌'}
            </strong>
          </p>

          {article.isUpdated && article.references && (
            <>
              <h4>References:</h4>
              <ul>
                {article.references.map((ref, idx) => (
                  <li key={idx}>
                    <a href={ref} target="_blank" rel="noreferrer">
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default App
