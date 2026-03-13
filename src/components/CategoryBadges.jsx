const BADGE_COLORS = [
  'purple', 'blue', 'cyan', 'emerald', 'amber', 'rose', 'orange',
];

export default function CategoryBadges({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="card">
      <div className="section-header">
        <div className="section-header__icon section-header__icon--purple">🏷️</div>
        <div className="section-header__text">
          <h2>Categories</h2>
          <p>AI-detected content types</p>
        </div>
      </div>
      <div className="categories">
        {categories.map((cat, i) => (
          <span
            key={cat}
            className={`badge badge--${BADGE_COLORS[i % BADGE_COLORS.length]}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
