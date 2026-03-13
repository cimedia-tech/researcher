export default function ResourcesList({ books, authors, resources }) {
  const hasContent =
    (books && books.length > 0) ||
    (authors && authors.length > 0) ||
    (resources && resources.length > 0);

  if (!hasContent) return null;

  return (
    <div className="card">
      <div className="section-header">
        <div className="section-header__icon section-header__icon--amber">📚</div>
        <div className="section-header__text">
          <h2>Resources & References</h2>
          <p>Books, authors, and tools mentioned</p>
        </div>
      </div>

      {books && books.length > 0 && (
        <div className="resources-section">
          <div className="resources-section__title">
            📖 Books ({books.length})
          </div>
          {books.map((book, i) => (
            <div
              key={i}
              className="resource-item"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="resource-item__icon resource-item__icon--book">📕</div>
              <div className="resource-item__info">
                <div className="resource-item__name">{book.title}</div>
                <div className="resource-item__meta">by {book.author}</div>
                {book.context && (
                  <div className="resource-item__context">{book.context}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {authors && authors.length > 0 && (
        <div className="resources-section">
          <div className="resources-section__title">
            👤 People & Authors ({authors.length})
          </div>
          {authors.map((author, i) => (
            <div
              key={i}
              className="resource-item"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="resource-item__icon resource-item__icon--person">👤</div>
              <div className="resource-item__info">
                <div className="resource-item__name">{author.name}</div>
                {author.context && (
                  <div className="resource-item__context">{author.context}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {resources && resources.length > 0 && (
        <div className="resources-section">
          <div className="resources-section__title">
            🔗 Tools & Resources ({resources.length})
          </div>
          {resources.map((resource, i) => (
            <div
              key={i}
              className="resource-item"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`resource-item__icon resource-item__icon--${
                resource.type === 'tool' ? 'tool' : 'link'
              }`}>
                {resource.type === 'tool' ? '🛠️' :
                 resource.type === 'website' ? '🌐' :
                 resource.type === 'framework' ? '⚙️' :
                 resource.type === 'course' ? '🎓' :
                 resource.type === 'podcast' ? '🎙️' : '🔗'}
              </div>
              <div className="resource-item__info">
                <div className="resource-item__name">{resource.name}</div>
                <div className="resource-item__meta">{resource.type}</div>
                {resource.context && (
                  <div className="resource-item__context">{resource.context}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
