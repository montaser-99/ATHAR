import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlatform } from '../../../lib/directory';

const factLabels: Record<string, string> = {
  identity_overview: 'نبذة عن المنصة',
  egypt_availability: 'الإتاحة في مصر',
  registration_requirements: 'متطلبات التسجيل',
  registration_steps: 'خطوات التسجيل',
  tests_acceptance: 'الاختبارات والقبول',
  payment_methods: 'طرق الدفع',
  withdrawal_conditions: 'شروط سحب الأرباح',
  work_types: 'مجالات العمل',
  experience_level: 'مستوى الخبرة',
  eligibility: 'شروط الأهلية',
  official_links: 'روابط المنصة',
};

const verificationLabels = {
  verified: 'تمت المراجعة',
  needs_review: 'تحتاج إلى مراجعة',
  unconfirmed: 'لم يتم التأكد بعد',
};
const stateLabels: Record<string, string> = {
  available: 'متاحة',
  available_with_restrictions: 'متاحة بشروط',
  unavailable: 'غير متاحة حاليًا',
  suspended_or_closed: 'موقوفة أو مغلقة',
  not_yet_confirmed: 'لم يتم التأكد بعد',
};

export default async function PlatformDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = await getPlatform(slug);
  if (!platform) notFound();

  return (
    <main className="directory-page">
      <div className="container">
        <Link className="back-link" href="/platforms">
          ← العودة إلى دليل المنصات
        </Link>
        <p className="eyebrow">دليل أثر</p>
        <div className="platform-detail-heading">
          <div>
            <h1>
              <bdi>{platform.name}</bdi>
            </h1>
            <div className="platform-categories">
              {platform.categories.map((category) => (
                <span key={category.id}>{category.labelAr}</span>
              ))}
            </div>
          </div>
          <span className={`status-pill status-${platform.availabilityState}`}>
            {stateLabels[platform.availabilityState]}
          </span>
        </div>
        {platform.warningActive && (
          <p className="warning-detail">
            يوجد تنبيه مرتبط بالمنصة. راجع التفاصيل المتاحة قبل اتخاذ قرارك.
          </p>
        )}
        {platform.restrictionNote && (
          <p className="restriction-note detail-restriction">
            {platform.restrictionNote}
          </p>
        )}
        <section className="facts-section" aria-labelledby="facts-title">
          <div className="directory-results-heading">
            <div>
              <p className="eyebrow">معلومات المنصة</p>
              <h2 id="facts-title">معلومات وتفاصيل</h2>
            </div>
          </div>
          {platform.facts.length === 0 ? (
            <div className="directory-empty detail-empty">
              <div className="empty-icon" aria-hidden="true">
                أ
              </div>
              <div>
                <h2>لا توجد معلومات منشورة عن المنصة حتى الآن.</h2>
                <p>سيظهر هنا ما تمت مراجعته ونشره في الدليل.</p>
              </div>
            </div>
          ) : (
            <div className="facts-grid">
              {platform.facts.map((fact) => (
                <article className="fact-card" key={fact.key}>
                  <div className="fact-heading">
                    <h3>{factLabels[fact.key] ?? fact.key}</h3>
                    <span
                      className={`verification-pill verification-${fact.verification.status}`}
                    >
                      {verificationLabels[fact.verification.status]}
                    </span>
                  </div>
                  {fact.valueText && (
                    <p className="fact-value">{fact.valueText}</p>
                  )}
                  {fact.links.length > 0 && (
                    <ul className="fact-links">
                      {fact.links.map((link) => (
                        <li key={`${link.url}-${link.position}`}>
                          <a href={link.url} rel="noreferrer">
                            <bdi>{link.title}</bdi>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {fact.verification.lastVerifiedOn && (
                    <p className="fact-date">
                      آخر مراجعة:{' '}
                      <time dateTime={fact.verification.lastVerifiedOn}>
                        {fact.verification.lastVerifiedOn}
                      </time>
                    </p>
                  )}
                  {fact.verification.sources.length > 0 && (
                    <details className="source-details">
                      <summary>المصادر</summary>
                      <ul>
                        {fact.verification.sources.map((source, index) => (
                          <li key={`${source.title}-${index}`}>
                            <span>{source.title}</span>
                            {source.url && (
                              <>
                                {' '}
                                ·{' '}
                                <a href={source.url} rel="noreferrer">
                                  <bdi>{source.url}</bdi>
                                </a>
                              </>
                            )}
                            <span> · تاريخ الاطلاع {source.accessedOn}</span>
                            {source.testScope && (
                              <span> · نطاق الاختبار: {source.testScope}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
        {platform.statusHistory.length > 0 && (
          <section className="history-section" aria-labelledby="history-title">
            <h2 id="history-title">سجل تغييرات الحالة</h2>
            <ol className="status-history">
              {platform.statusHistory.map((entry, index) => (
                <li key={`${entry.occurredAt}-${index}`}>
                  <time dateTime={entry.occurredAt}>
                    {new Date(entry.occurredAt).toLocaleDateString('ar-EG')}
                  </time>
                  <span>
                    {entry.note ?? `${entry.fromValue} ← ${entry.toValue}`}
                  </span>
                  {entry.sourceSummary && <small>{entry.sourceSummary}</small>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
