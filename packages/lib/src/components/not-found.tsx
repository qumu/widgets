import { useI18n } from '@/i18n';
import Icon from '@/components/icon';

export function NotFoundComponent() {
  const i18n = useI18n();

  return (
    <div class="qc-not-found">
      <Icon name="image-broken" width={48} height={48}/>
      <div>{ i18n.t('common.Presentation not found') }</div>
    </div>
  );
}
