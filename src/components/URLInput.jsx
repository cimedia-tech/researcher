export default function URLInput({ url, setUrl, onAnalyze, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="card card--accent">
      <form className="url-input" onSubmit={handleSubmit}>
        <div className="url-input__field-wrapper">
          <input
            id="video-url-input"
            type="text"
            className="url-input__field"
            placeholder="Paste a YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            id="analyze-btn"
            type="submit"
            className="url-input__btn"
            disabled={!url.trim() || loading}
          >
            {loading ? (
              <>⏳ Analyzing...</>
            ) : (
              <>🔬 Analyze</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
