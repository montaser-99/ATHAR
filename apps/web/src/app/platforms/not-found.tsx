import Link from 'next/link';

export default function PlatformNotFound() {
  return (
    <main className="directory-page" id="main-content">
      <div className="container">
        <section className="directory-empty directory-page-empty">
          <div className="empty-icon" aria-hidden="true">
            أ
          </div>
          <div>
            <p className="empty-kicker">المنصة غير متاحة</p>
            <h1>مش لاقيين المنصة دي في الدليل.</h1>
            <p>ارجع للدليل لاستكشاف المنصات المنشورة.</p>
          </div>
          <Link className="button" href="/platforms">
            دليل المنصات
          </Link>
        </section>
      </div>
    </main>
  );
}
