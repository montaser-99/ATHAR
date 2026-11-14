import Link from 'next/link';
import {
  PlatformDirectoryQuerySchema,
  type PlatformDirectoryQuery,
} from '@athar/contracts';
import { getDirectory } from '../../lib/directory';

type SearchParams = Record<string, string | string[] | undefined>;
type PlatformsPageProps = { searchParams: Promise<SearchParams> };

const stateLabels: Record<string, string> = {
  available: 'متاحة',
  available_with_restrictions: 'متاحة بشروط',
  unavailable: 'غير متاحة حاليًا',
  suspended_or_closed: 'موقوفة أو مغلقة',
  not_yet_confirmed: 'لم يتم التأكد بعد',
};

function getQueryInput(params: SearchParams): Record<string, unknown> {
  const supported = [
    'q',
    'category',
    'availability',
    'opportunityType',
    'paymentMethod',
    'experienceLevel',
    'sort',
    'page',
    'pageSize',
  ];
  return Object.fromEntries(
    supported.flatMap((key) =>
      params[key] === undefined ? [] : [[key, params[key]]],
    ),
  );
}

function pageHref(query: PlatformDirectoryQuery, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, page })) {
    if (value === undefined) continue;
    if (Array.isArray(value))
      value.forEach((item) => params.append(key, String(item)));
    else params.set(key, String(value));
  }
  return `/platforms?${params.toString()}`;
}

function removeFilterHref(
  query: PlatformDirectoryQuery,
  key: string,
  value?: string,
): string {
  const next: Record<string, unknown> = { ...query, page: 1 };
  const current = next[key];
  if (value !== undefined && Array.isArray(current)) {
    const remaining = current.filter((item) => item !== value);
    if (remaining.length) next[key] = remaining;
    else delete next[key];
  } else {
    delete next[key];
  }
  const params = new URLSearchParams();
  for (const [name, item] of Object.entries(next)) {
    if (item === undefined) continue;
    if (Array.isArray(item))
      item.forEach((entry) => params.append(name, String(entry)));
    else params.set(name, String(item));
  }
  return `/platforms?${params.toString()}`;
}

export default async function PlatformsPage({
  searchParams,
}: PlatformsPageProps) {
  const params = await searchParams;
  const query = PlatformDirectoryQuerySchema.parse(getQueryInput(params));
  const result = await getDirectory(query);
  const categories = result.facets.category ?? [];
  const opportunities = result.facets.opportunity_type ?? [];
  const payments = result.facets.payment_method ?? [];
  const experienceLevels = result.facets.experience_level ?? [];
  const activeFilters: Array<{ key: string; value?: string; label: string }> =
    [];
  if (query.q) activeFilters.push({ key: 'q', label: `بحث: ${query.q}` });
  for (const slug of query.category ?? [])
    activeFilters.push({
      key: 'category',
      value: slug,
      label: categories.find((item) => item.slug === slug)?.labelAr ?? slug,
    });
  for (const state of query.availability ?? [])
    activeFilters.push({
      key: 'availability',
      value: state,
      label: stateLabels[state] ?? state,
    });
  for (const slug of query.opportunityType ?? [])
    activeFilters.push({
      key: 'opportunityType',
      value: slug,
      label: opportunities.find((item) => item.slug === slug)?.labelAr ?? slug,
    });
  for (const slug of query.paymentMethod ?? [])
    activeFilters.push({
      key: 'paymentMethod',
      value: slug,
      label: payments.find((item) => item.slug === slug)?.labelAr ?? slug,
    });
  for (const slug of query.experienceLevel ?? [])
    activeFilters.push({
      key: 'experienceLevel',
      value: slug,
      label:
        experienceLevels.find((item) => item.slug === slug)?.labelAr ?? slug,
    });

  return (
    <main className="directory-page">
      <div className="container">
        <Link className="back-link" href="/">
          ← الصفحة الرئيسية
        </Link>
        <p className="eyebrow">دليل أثر</p>
        <h1>اكتشف المنصات</h1>
        <p className="directory-lead">
          مش كل منصة مناسبة لكل شخص... المهم تلاقي اللي يناسبك. معلومات واضحة
          تساعدك تفهم كل منصة قبل ما تبدأ فيها.
        </p>

        <form
          className="directory-filters"
          action="/platforms"
          method="get"
          role="search"
        >
          <div className="directory-search-row">
            <label className="sr-only" htmlFor="directory-search">
              ابحث عن منصة أو مجال
            </label>
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              id="directory-search"
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="بتدور على بداية جديدة؟"
              autoComplete="off"
            />
            <button className="button search-button" type="submit">
              ابحث
            </button>
          </div>
          <div className="filter-grid">
            <fieldset className="filter-group">
              <legend>المجال</legend>
              {categories.map((option) => (
                <label className="filter-check" key={option.id}>
                  <input
                    type="checkbox"
                    name="category"
                    value={option.slug}
                    defaultChecked={query.category?.includes(option.slug)}
                  />
                  <span>{option.labelAr}</span>
                </label>
              ))}
              {categories.length === 0 && (
                <span className="filter-unavailable">
                  لا توجد خيارات مضافة حتى الآن
                </span>
              )}
            </fieldset>
            <fieldset className="filter-group">
              <legend>حالة الإتاحة</legend>
              {Object.entries(stateLabels).map(([value, label]) => (
                <label className="filter-check" key={value}>
                  <input
                    type="checkbox"
                    name="availability"
                    value={value}
                    defaultChecked={query.availability?.includes(
                      value as NonNullable<
                        PlatformDirectoryQuery['availability']
                      >[number],
                    )}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <fieldset className="filter-group">
              <legend>نوع الفرصة</legend>
              {opportunities.map((option) => (
                <label className="filter-check" key={option.id}>
                  <input
                    type="checkbox"
                    name="opportunityType"
                    value={option.slug}
                    defaultChecked={query.opportunityType?.includes(
                      option.slug,
                    )}
                  />
                  <span>{option.labelAr}</span>
                </label>
              ))}
              {opportunities.length === 0 && (
                <span className="filter-unavailable">
                  لا توجد خيارات مضافة حتى الآن
                </span>
              )}
            </fieldset>
            <fieldset className="filter-group">
              <legend>طريقة الدفع</legend>
              {payments.map((option) => (
                <label className="filter-check" key={option.id}>
                  <input
                    type="checkbox"
                    name="paymentMethod"
                    value={option.slug}
                    defaultChecked={query.paymentMethod?.includes(option.slug)}
                  />
                  <span>{option.labelAr}</span>
                </label>
              ))}
              {payments.length === 0 && (
                <span className="filter-unavailable">
                  لا توجد خيارات مضافة حتى الآن
                </span>
              )}
            </fieldset>
            <fieldset className="filter-group">
              <legend>الخبرة المطلوبة</legend>
              {experienceLevels.map((option) => (
                <label className="filter-check" key={option.id}>
                  <input
                    type="checkbox"
                    name="experienceLevel"
                    value={option.slug}
                    defaultChecked={query.experienceLevel?.includes(
                      option.slug,
                    )}
                  />
                  <span>{option.labelAr}</span>
                </label>
              ))}
              {experienceLevels.length === 0 && (
                <span className="filter-unavailable">
                  لا توجد خيارات مضافة حتى الآن
                </span>
              )}
            </fieldset>
            <label className="sort-control">
              الترتيب
              <select
                name="sort"
                defaultValue={
                  query.sort ?? (query.q ? 'relevance' : 'popularity')
                }
              >
                <option value="popularity">الأكثر متابعة</option>
                <option value="newest">الأحدث</option>
                <option value="last_verification">تاريخ آخر مراجعة</option>
              </select>
            </label>
            <input type="hidden" name="pageSize" value={query.pageSize} />
          </div>
          <button className="button button-outline filter-submit" type="submit">
            تطبيق البحث والتصفية
          </button>
        </form>

        {activeFilters.length > 0 && (
          <div className="active-filters" aria-label="عوامل التصفية الحالية">
            {activeFilters.map((filter, index) => (
              <Link
                className="filter-chip"
                key={`${filter.key}-${filter.value ?? index}`}
                href={removeFilterHref(query, filter.key, filter.value)}
              >
                {filter.label}
                <span aria-hidden="true">×</span>
                <span className="sr-only">إزالة عامل التصفية</span>
              </Link>
            ))}
            <Link className="clear-filters" href="/platforms">
              مسح الكل
            </Link>
          </div>
        )}

        <section
          className="directory-results"
          aria-labelledby="directory-results-title"
        >
          <div className="directory-results-heading">
            <div>
              <p className="eyebrow">منصات الدليل</p>
              <h2 id="directory-results-title">المنصات المتاحة للاستكشاف</h2>
            </div>
            <p className="result-count">
              {result.total.toLocaleString('ar-EG')} نتيجة
            </p>
          </div>
          {result.items.length === 0 ? (
            <section
              className="directory-empty directory-page-empty"
              aria-live="polite"
            >
              <div className="empty-icon" aria-hidden="true">
                <span>أ</span>
              </div>
              <div>
                <p className="empty-kicker">لا توجد نتائج</p>
                <h2>لسه ملقيناش اللي بتدور عليه، جرّب مجال تاني.</h2>
                <Link className="clear-filters" href="/platforms">
                  مسح الكل
                </Link>
              </div>
            </section>
          ) : (
            <div className="platform-card-grid">
              {result.items.map((platform) => (
                <article className="platform-card" key={platform.id}>
                  <div className="platform-card-topline">
                    <span
                      className={`status-pill status-${platform.availabilityState}`}
                    >
                      {stateLabels[platform.availabilityState]}
                    </span>
                    {platform.warningActive && (
                      <span className="warning-pill">تنبيه قائم</span>
                    )}
                  </div>
                  <h3>
                    <Link
                      href={`/platforms/${encodeURIComponent(platform.slug)}`}
                    >
                      <bdi>{platform.name}</bdi>
                    </Link>
                  </h3>
                  <div className="platform-categories">
                    {platform.categories.map((category) => (
                      <span key={category.id}>{category.labelAr}</span>
                    ))}
                  </div>
                  {platform.restrictionNote && (
                    <p className="restriction-note">
                      {platform.restrictionNote}
                    </p>
                  )}
                  <div className="platform-card-meta">
                    <span>
                      {platform.rating === null
                        ? 'التقييمات غير متاحة بعد'
                        : platform.rating.average === null
                          ? `لسه مفيش تقييمات كفاية · ${platform.rating.totalReviews.toLocaleString('ar-EG')} تقييم`
                          : `التقييم ${platform.rating.average.toLocaleString('ar-EG')}`}
                    </span>
                    <span>
                      {platform.lastVerifiedOn
                        ? `آخر مراجعة ${platform.lastVerifiedOn}`
                        : 'لم تُسجل مراجعة بعد'}
                    </span>
                  </div>
                  <Link
                    className="platform-card-link"
                    href={`/platforms/${encodeURIComponent(platform.slug)}`}
                  >
                    اعرف عن المنصة <span aria-hidden="true">←</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
          {result.pageCount > 1 && (
            <nav className="pagination" aria-label="صفحات النتائج">
              {query.page > 1 && (
                <Link
                  className="button button-outline"
                  href={pageHref(query, query.page - 1)}
                >
                  السابق
                </Link>
              )}
              <span>
                صفحة {query.page.toLocaleString('ar-EG')} من{' '}
                {result.pageCount.toLocaleString('ar-EG')}
              </span>
              {query.page < result.pageCount && (
                <Link
                  className="button button-outline"
                  href={pageHref(query, query.page + 1)}
                >
                  التالي
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
