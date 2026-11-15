import Link from 'next/link';

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      أ
    </span>
  );
}

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        انتقل إلى المحتوى
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="أثر، الصفحة الرئيسية">
            <BrandMark />
            <span className="brand-name">
              أثر <bdi dir="ltr">ATHAR</bdi>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            <Link href="/platforms">المنصات</Link>
            <Link href="/#fields">المجالات</Link>
            <Link href="/#about">عن أثر</Link>
          </nav>
          <Link className="button button-small header-action" href="/platforms">
            استكشف الدليل <span aria-hidden="true">←</span>
          </Link>
          <details className="mobile-menu">
            <summary aria-label="فتح قائمة التنقل">
              <span aria-hidden="true">☰</span>
            </summary>
            <nav aria-label="التنقل الرئيسي على الهاتف">
              <Link href="/platforms">المنصات</Link>
              <Link href="/#fields">المجالات</Link>
              <Link href="/#about">عن أثر</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
