export default function PlatformsLoading() {
  return (
    <div
      className="directory-page"
      id="main-content"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="container">
        <p className="eyebrow">دليل أثر</p>
        <h1>جاري تحميل دليل المنصات…</h1>
        <div className="platform-card-grid" aria-hidden="true">
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      </div>
    </div>
  );
}
