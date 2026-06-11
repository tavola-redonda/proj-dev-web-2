export default function GlobalAlerts({ error, successMsg }) {
  if (!error && !successMsg) {
    return null;
  }

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '1rem auto 0 auto', padding: '0 2rem' }}>
      {error && (
        <div className="alert alert-danger fade-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success fade-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          {successMsg}
        </div>
      )}
    </div>
  );
}