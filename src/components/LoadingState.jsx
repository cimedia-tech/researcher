export default function LoadingState() {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      <div className="loading__text">Analyzing video content...</div>
      <div className="loading__subtext">
        This may take 30–60 seconds depending on video length
      </div>
      <div className="card" style={{ marginTop: '2rem', textAlign: 'left' }}>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--short" />
        <div style={{ height: '1.5rem' }} />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--short" />
      </div>
    </div>
  );
}
