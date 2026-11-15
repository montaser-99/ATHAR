import Link from 'next/link';
import { getDirectory } from '../lib/directory';
import { PlatformCard } from '../components/platform-card';

function SearchPanel() {
  return (
    <form
      className="search-panel"
      action="/platforms"
      method="get"
      role="search"
    >
      <label className="sr-only" htmlFor="platform-search">
        البحث في دليل المنصات
      </label>
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        id="platform-search"
        name="q"
        type="search"
        placeholder="بتدور على بداية جديدة؟"
        autoComplete="off"
      />
      <button className="button search-button" type="submit">
        ابحث في المنصات
      </button>
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
      <div className="art-stamp">
        اكتشف
        <br />
        افهم
        <br />
        ابدأ
      </div>
    </div>
  );
}

export default async function HomePage() {
  const directory = await getDirectory({ page: 1, pageSize: 3 }).catch(
    () => null,
  );
  const categories = directory?.facets.category ?? [];
  const platforms = directory?.items ?? [];

  return (
    <>
      <main id="main-content">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> مساحة تعرفك على فرص العمل الرقمي
              </p>
              <h1>
                من أثرٍ جئنا،
                <br />
                وإلى أثرٍ نمضي.
              </h1>
              <p className="hero-lead">
                ابدأ بخطوات اللي سبقوك، وسيب خطوات يستفيد منها اللي بعدك.
              </p>
              <SearchPanel />
              <p className="prototype-note">
                ابحث في المنصات المنشورة بعد مراجعة معلوماتها.
              </p>
            </div>
            <HeroIllustration />
          </div>
        </section>
        <section
          className="section fields-section"
          id="fields"
          aria-labelledby="fields-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">كل طريق يبدأ باكتشاف</p>
                <h2 id="fields-title">مجالات تفتح لك أبواب جديدة</h2>
              </div>
              <p className="section-intro">
                يمكن الفرصة اللي بتدور عليها موجودة في مجال لسه متعرفش عنه.
                اكتشف مجالات مختلفة، وافتح لنفسك أبواب جديدة.
              </p>
            </div>
            {categories.length > 0 ? (
              <div className="field-grid">
                {categories.map((category, index) => (
                  <Link
                    className="field-card"
                    href={`/platforms?category=${encodeURIComponent(category.slug)}`}
                    key={category.id}
                  >
                    <span
                      className={`field-symbol field-symbol-${(index % 4) + 1}`}
                      aria-hidden="true"
                    >
                      {['✳', '⌘', 'Aa', '↗'][index % 4]}
                    </span>
                    <span className="field-card-title">{category.labelAr}</span>
                    <span className="field-card-link">
                      استكشف المجال <span aria-hidden="true">←</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="directory-empty home-empty">
                <div className="empty-icon" aria-hidden="true">
                  أ
                </div>
                <div>
                  <p className="empty-kicker">الدليل بيتجهّز</p>
                  <h3>هتظهر المجالات هنا بعد إضافتها للدليل.</h3>
                </div>
                <Link className="button button-outline" href="/platforms">
                  افتح الدليل
                </Link>
              </div>
            )}
          </div>
        </section>
        <section
          className="section platforms-section"
          id="directory"
          aria-labelledby="platforms-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">معلومات واضحة قبل ما تبدأ</p>
                <h2 id="platforms-title">دليل المنصات</h2>
              </div>
              <p className="section-intro">
                مش كل منصة مناسبة لكل شخص... المهم تلاقي اللي يناسبك. معلومات
                واضحة تساعدك تفهم كل منصة قبل ما تبدأ فيها.
              </p>
            </div>
            {platforms.length > 0 ? (
              <>
                <div className="platform-card-grid home-platform-grid">
                  {platforms.map((platform) => (
                    <PlatformCard key={platform.id} platform={platform} />
                  ))}
                </div>
                <div className="home-directory-action">
                  <Link className="button button-outline" href="/platforms">
                    استكشف كل المنصات <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="directory-empty">
                <div className="empty-icon" aria-hidden="true">
                  أ
                </div>
                <div>
                  <p className="empty-kicker">دليل المنصات</p>
                  <h3>
                    {directory
                      ? 'ستظهر هنا المنصات المنشورة بعد مراجعة معلوماتها.'
                      : 'يتعذر تحميل بيانات الدليل الآن.'}
                  </h3>
                  <p>
                    تظهر في الدليل المنصات المنشورة فقط، مع فصل المعلومات
                    المراجعة عن تجارب المستخدمين.
                  </p>
                </div>
                <Link className="button button-outline" href="/platforms">
                  افتح واجهة الدليل <span aria-hidden="true">←</span>
                </Link>
              </div>
            )}
          </div>
        </section>
        <section
          className="about-band"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="container about-inner">
            <span className="about-mark" aria-hidden="true">
              أ
            </span>
            <div>
              <p className="eyebrow">فكرة أثر</p>
              <h2 id="about-title">خطوتك ممكن تنوّر لغيرك.</h2>
              <p>
                يمكن تجربتك تكون النور اللي حد تاني محتاجه. شارك اللي اتعلمته،
                حتى لو كانت مجرد خطوة صغيرة. لأن اللي ساعدك النهارده، ممكن يساعد
                غيرك بكرة.
              </p>
            </div>
            <span className="about-spark" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
