import Link from 'next/link';

const sampleFields = ['تصميم وإبداع', 'برمجة وتقنية', 'كتابة وترجمة', 'تسويق رقمي'];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      أ
    </span>
  );
}

function SearchPanel() {
  return (
    <form className="search-panel" action="/platforms" method="get" role="search">
      <label className="sr-only" htmlFor="platform-search">
        البحث في دليل المنصات
      </label>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        id="platform-search"
        name="q"
        type="search"
        placeholder="بتدور على بداية جديدة؟"
        autoComplete="off"
      />
      <button className="button search-button" type="submit">ابحث في المنصات</button>
    </form>
  );
}

function HeroIllustration() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-sun" />
      <svg className="art-path" viewBox="0 0 460 360" fill="none">
        <path d="M63 293C143 293 123 225 211 225S272 154 352 154 366 70 419 70" />
        <circle cx="64" cy="293" r="10" />
        <circle cx="211" cy="225" r="10" />
        <circle cx="352" cy="154" r="10" />
        <circle cx="419" cy="70" r="13" />
      </svg>
      <div className="art-note art-note-start">خطوة صغيرة</div>
      <div className="art-note art-note-end">أثر يكمل الطريق</div>
      <div className="art-stamp">اكتشف<br />افهم<br />ابدأ</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="أثر، الصفحة الرئيسية">
            <BrandMark />
            <span className="brand-name">أثر <bdi dir="ltr">ATHAR</bdi></span>
          </Link>
          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            <Link href="/platforms">المنصات</Link>
            <a href="#fields">المجالات</a>
            <a href="#about">عن أثر</a>
          </nav>
          <Link className="button button-small header-action" href="/platforms">
            استكشف الدليل <span aria-hidden="true">←</span>
          </Link>
          <details className="mobile-menu">
            <summary aria-label="فتح قائمة التنقل"><span aria-hidden="true">☰</span></summary>
            <nav aria-label="التنقل الرئيسي على الهاتف">
              <Link href="/platforms">المنصات</Link>
              <a href="#fields">المجالات</a>
              <a href="#about">عن أثر</a>
            </nav>
          </details>
        </div>
      </header>
      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> مساحة تعرفك على فرص العمل الرقمي</p>
              <h1>من أثرٍ جئنا،<br />وإلى أثرٍ نمضي.</h1>
              <p className="hero-lead">ابدأ بخطوات اللي سبقوك، وسيب خطوات يستفيد منها اللي بعدك.</p>
              <SearchPanel />
              <p className="prototype-note">معاينة أولية — دليل المنصات غير متصل ببيانات بعد.</p>
            </div>
            <HeroIllustration />
          </div>
        </section>
        <section className="section fields-section" id="fields" aria-labelledby="fields-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">كل طريق يبدأ باكتشاف</p>
                <h2 id="fields-title">مجالات تفتح لك أبواب جديدة</h2>
              </div>
              <p className="section-intro">يمكن الفرصة اللي بتدور عليها موجودة في مجال لسه متعرفش عنه. اكتشف مجالات مختلفة، وافتح لنفسك أبواب جديدة.</p>
            </div>
            <p className="sample-label">أمثلة توضيحية للمجالات — التصنيفات المعتمدة هتظهر مع تجهيز الدليل.</p>
            <div className="field-grid">
              {sampleFields.map((field, index) => (
                <Link className="field-card" href="/platforms" key={field}>
                  <span className={`field-symbol field-symbol-${index + 1}`} aria-hidden="true">{['✳', '⌘', 'Aa', '↗'][index]}</span>
                  <span className="field-card-title">{field}</span>
                  <span className="field-card-link">استكشف الدليل <span aria-hidden="true">←</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="section platforms-section" id="directory" aria-labelledby="platforms-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">معلومات واضحة قبل ما تبدأ</p>
                <h2 id="platforms-title">دليل المنصات</h2>
              </div>
              <p className="section-intro">مش كل منصة مناسبة لكل شخص... المهم تلاقي اللي يناسبك. معلومات واضحة تساعدك تفهم كل منصة قبل ما تبدأ فيها.</p>
            </div>
            <div className="directory-empty">
              <div className="empty-icon" aria-hidden="true"><span>أ</span></div>
              <div>
                <p className="empty-kicker">الدليل بيتجهّز</p>
                <h3>هنعرض معلومات المنصات بعد مراجعتها والتحقق منها.</h3>
                <p>مفيش بيانات منصات متصلة حاليًا، علشان كده مش هنعرض بطاقات أو تقييمات تجريبية.</p>
              </div>
              <Link className="button button-outline" href="/platforms">افتح واجهة الدليل <span aria-hidden="true">←</span></Link>
            </div>
          </div>
        </section>
        <section className="about-band" id="about" aria-labelledby="about-title">
          <div className="container about-inner">
            <span className="about-mark" aria-hidden="true">أ</span>
            <div>
              <p className="eyebrow">فكرة أثر</p>
              <h2 id="about-title">خطوتك ممكن تنوّر لغيرك.</h2>
              <p>يمكن تجربتك تكون النور اللي حد تاني محتاجه. شارك اللي اتعلمته، حتى لو كانت مجرد خطوة صغيرة. لأن اللي ساعدك النهارده، ممكن يساعد غيرك بكرة.</p>
            </div>
            <span className="about-spark" aria-hidden="true">✳</span>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="brand footer-brand" href="/"><BrandMark /><span className="brand-name">أثر <bdi dir="ltr">ATHAR</bdi></span></Link>
          <p>من أثرٍ جئنا، وإلى أثرٍ نمضي.</p>
          <span>© أثر</span>
        </div>
      </footer>
    </>
  );
}
