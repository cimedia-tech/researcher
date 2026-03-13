import { useState, useEffect, useCallback } from 'react';
import URLInput from './components/URLInput';
import VideoPreview from './components/VideoPreview';
import CategoryBadges from './components/CategoryBadges';
import StepsList from './components/StepsList';
import ResourcesList from './components/ResourcesList';
import LoadingState from './components/LoadingState';
import SummaryBar from './components/SummaryBar';
import { analyzeVideo, extractVideoId, getVideoMeta, checkApiKey } from './api/gemini';

export default function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [apiConfigured, setApiConfigured] = useState(null);

  // Check API key on mount
  useEffect(() => {
    checkApiKey().then(setApiConfigured);
  }, []);

  // Auto-fetch video meta when URL changes
  useEffect(() => {
    const id = extractVideoId(url);
    setVideoId(id);
    if (id) {
      getVideoMeta(`https://www.youtube.com/watch?v=${id}`).then(setVideoMeta);
    } else {
      setVideoMeta(null);
    }
  }, [url]);

  const handleAnalyze = useCallback(async (videoUrl) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await analyzeVideo(videoUrl);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header__icon">🔬</div>
        <h1 className="header__title">Researcher</h1>
        <p className="header__subtitle">
          Extract instructions, book references, and resources from any video using AI
        </p>
      </header>

      {apiConfigured === false && (
        <div className="card">
          <div className="setup-notice">
            <div className="setup-notice__icon">🔑</div>
            <div className="setup-notice__title">Gemini API Key Required</div>
            <div className="setup-notice__text">
              Add your Gemini API key to the <span className="setup-notice__code">.env</span> file
              in the project root:
              <br /><br />
              <span className="setup-notice__code">GEMINI_API_KEY=your-key-here</span>
              <br /><br />
              Get a free key at{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-blue)' }}
              >
                aistudio.google.com/apikey
              </a>
            </div>
          </div>
        </div>
      )}

      <URLInput
        url={url}
        setUrl={setUrl}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {videoId && !loading && !results && (
        <VideoPreview meta={videoMeta} videoId={videoId} />
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading && <LoadingState />}

      {results && (
        <>
          <SummaryBar data={results} />
          <CategoryBadges categories={results.categories} />
          <StepsList steps={results.steps} />
          <ResourcesList
            books={results.books}
            authors={results.authors}
            resources={results.resources}
          />
        </>
      )}
    </div>
  );
}
