import Link from 'next/link';
import type { getDirectory } from '../lib/directory';

type PlatformCardData = Awaited<
  ReturnType<typeof getDirectory>
>['items'][number];

const stateLabels: Record<PlatformCardData['availabilityState'], string> = {
  available: 'متاحة',
  available_with_restrictions: 'متاحة بشروط',
  unavailable: 'غير متاحة حاليًا',
  suspended_or_closed: 'موقوفة أو مغلقة',
  not_yet_confirmed: 'لم يتم التأكد بعد',
};

export function PlatformCard({ platform }: { platform: PlatformCardData }) {
  return (
    <article className="platform-card">
      <div className="platform-initial" aria-hidden="true">
        {Array.from(platform.name)[0] ?? 'أ'}
      </div>
      <div className="platform-card-topline">
        <span className={`status-pill status-${platform.availabilityState}`}>
          {stateLabels[platform.availabilityState]}
        </span>
        {platform.warningActive && (
          <span className="warning-pill">تنبيه قائم</span>
        )}
      </div>
      <h3>
        <Link href={`/platforms/${encodeURIComponent(platform.slug)}`}>
          <bdi>{platform.name}</bdi>
        </Link>
      </h3>
      <div className="platform-categories">
        {platform.categories.map((category) => (
          <span key={category.id}>{category.labelAr}</span>
        ))}
      </div>
      {platform.restrictionNote && (
        <p className="restriction-note">{platform.restrictionNote}</p>
      )}
      {((platform.rating?.average !== null && platform.rating !== null) ||
        platform.lastVerifiedOn) && (
        <div className="platform-card-meta">
          {platform.rating?.average !== null && platform.rating !== null && (
            <span>
              التقييم {platform.rating.average.toLocaleString('ar-EG')}
            </span>
          )}
          {platform.lastVerifiedOn && (
            <span>
              آخر مراجعة <bdi dir="ltr">{platform.lastVerifiedOn}</bdi>
            </span>
          )}
        </div>
      )}
      <Link
        className="platform-card-link"
        href={`/platforms/${encodeURIComponent(platform.slug)}`}
      >
        اعرف عن المنصة <span aria-hidden="true">←</span>
      </Link>
    </article>
  );
}
