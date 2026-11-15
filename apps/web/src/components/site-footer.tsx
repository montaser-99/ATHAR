import Link from 'next/link';

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      أ
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="brand footer-brand" href="/">
          <BrandMark />
          <span className="brand-name">
            أثر <bdi dir="ltr">ATHAR</bdi>
          </span>
        </Link>
        <p>من أثرٍ جئنا، وإلى أثرٍ نمضي.</p>
        <span>© أثر</span>
      </div>
    </footer>
  );
}
