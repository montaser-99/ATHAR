'use client';

export default function PlatformsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="directory-page" id="main-content">
      <div className="container">
        <section className="directory-empty directory-page-empty" role="alert">
          <div className="empty-icon" aria-hidden="true">
            !
          </div>
          <div>
            <p className="empty-kicker">تعذر تحميل الدليل</p>
            <h1>
              تعذّر تحميل البيانات. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.
            </h1>
          </div>
          <button className="button" type="button" onClick={reset}>
            إعادة المحاولة
          </button>
        </section>
      </div>
    </main>
  );
}
