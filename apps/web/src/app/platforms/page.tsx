import Link from 'next/link';

type PlatformsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PlatformsPage({ searchParams }: PlatformsPageProps) {
  const { q = '' } = await searchParams;

  return (
    <main className="directory-page">
      <div className="container">
        <Link className="back-link" href="/">← الصفحة الرئيسية</Link>
        <p className="eyebrow">دليل أثر</p>
        <h1>اكتشف المنصات</h1>
        <p className="directory-lead">مش كل منصة مناسبة لكل شخص... المهم تلاقي اللي يناسبك. معلومات واضحة تساعدك تفهم كل منصة قبل ما تبدأ فيها.</p>
        <form className="search-panel directory-search" action="/platforms" method="get" role="search">
          <label className="sr-only" htmlFor="directory-search">ابحث عن منصة أو مجال</label>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input id="directory-search" name="q" type="search" defaultValue={q} placeholder="بتدور على بداية جديدة؟" autoComplete="off" />
          <button className="button search-button" type="submit">ابحث</button>
        </form>
        <p className="prototype-note">واجهة أولية فقط — البحث والنتائج غير متصلين ببيانات منصات حقيقية.</p>
        <section className="directory-empty directory-page-empty" aria-labelledby="directory-empty-title">
          <div className="empty-icon" aria-hidden="true"><span>أ</span></div>
          <div>
            <p className="empty-kicker">الدليل بيتجهّز</p>
            <h2 id="directory-empty-title">نتائج المنصات هتظهر هنا بعد ربط الدليل والتحقق من بياناته.</h2>
            <p>لم نضف منصات أو تقييمات تجريبية. هنبدأ بعرض المعلومات بعد مراجعتها.</p>
          </div>
          <Link className="button button-outline" href="/">العودة للرئيسية</Link>
        </section>
      </div>
    </main>
  );
}
