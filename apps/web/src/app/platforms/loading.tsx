export default function PlatformsLoading() {
  return (
    <main className="directory-page">
      <div className="container" aria-live="polite">
        <p className="eyebrow">دليل أثر</p>
        <h1>جاري تحميل دليل المنصات…</h1>
        <div className="platform-card-grid" aria-hidden="true">
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      </div>
    </main>
  );
}
