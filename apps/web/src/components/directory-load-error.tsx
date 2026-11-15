import Link from 'next/link';

export function DirectoryLoadError({ retryHref }: { retryHref: string }) {
  return (
    <section className="directory-empty directory-page-empty" role="alert">
      <div className="empty-icon" aria-hidden="true">
        !
      </div>
      <div>
        <p className="empty-kicker">تعذر تحميل الدليل</p>
        <h1>تعذّر تحميل البيانات. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.</h1>
      </div>
      <Link className="button" href={retryHref}>
        إعادة المحاولة
      </Link>
    </section>
  );
}
