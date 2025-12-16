import ImageBrokenIcon from '@/icons/image-broken.svg?react';

// TODO translate me!
export function NotFoundComponent() {
  return (
    <div class="qc-not-found">
      <ImageBrokenIcon width={48} height={48} />
      <div>Presentation not found</div>
    </div>
  );
}
