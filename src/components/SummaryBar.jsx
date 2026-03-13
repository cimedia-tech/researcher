export default function SummaryBar({ data }) {
  if (!data) return null;

  const stats = [
    { value: data.categories?.length || 0, label: 'Categories' },
    { value: data.steps?.length || 0, label: 'Steps' },
    { value: data.books?.length || 0, label: 'Books' },
    { value: (data.authors?.length || 0) + (data.resources?.length || 0), label: 'Resources' },
  ];

  return (
    <div className="card">
      {data.summary && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          marginBottom: 'var(--space-lg)',
        }}>
          {data.summary}
        </p>
      )}
      <div className="summary-bar" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
        {stats.map((stat) => (
          <div className="summary-stat" key={stat.label}>
            <span className="summary-stat__value">{stat.value}</span>
            <span className="summary-stat__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
