export default function StepsList({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="card">
      <div className="section-header">
        <div className="section-header__icon section-header__icon--blue">📋</div>
        <div className="section-header__text">
          <h2>Step-by-Step Instructions</h2>
          <p>{steps.length} step{steps.length !== 1 ? 's' : ''} extracted</p>
        </div>
      </div>
      <ol className="steps-list">
        {steps.map((step, i) => (
          <li
            key={i}
            className="step-item"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="step-item__number" />
            <div className="step-item__content">
              <div className="step-item__title">{step.title}</div>
              {step.detail && (
                <div className="step-item__detail">{step.detail}</div>
              )}
              {step.timestamp && step.timestamp !== 'null' && (
                <div className="step-item__timestamp">⏱ {step.timestamp}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
