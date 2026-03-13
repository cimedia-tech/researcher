export default function VideoPreview({ meta, videoId }) {
  if (!meta && !videoId) return null;

  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  return (
    <div className="video-preview">
      {thumbnail && (
        <img
          className="video-preview__thumb"
          src={thumbnail}
          alt={meta?.title || 'Video thumbnail'}
          onError={(e) => {
            e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
      )}
      {meta && (
        <div className="video-preview__info">
          <div className="video-preview__title">{meta.title}</div>
          <div className="video-preview__channel">{meta.author_name}</div>
        </div>
      )}
    </div>
  );
}
