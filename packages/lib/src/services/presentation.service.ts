import { Presentation } from '@/interfaces/presentation';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';

export interface PresentationResponseDto {
  kulus: Presentation[];
  total: number;
  error: {
    code: string;
    httpCode: number;
    message: string;
  };
}

export class PresentationService {
  constructor(private readonly host: string) {}

  async getPresentation(
    guid: string,
    sortBy = 'created',
    sortOrder: WidgetConfiguration['sortOrder'] = 'DESCENDING',
  ): Promise<Presentation> {
    const url = new URL(`/api/2.2/rest/widgets/${guid}.json`, `https://${this.host}`);

    url.searchParams.set('offset', '0');
    url.searchParams.set('limit', '1');
    url.searchParams.set('sortBy', `${sortBy},${sortOrder}`);
    url.searchParams.set('useUserAuth', 'false');

    let response: Response;

    try {
      response = await fetch(url.toString(), {
        method: 'GET',
      });
    } catch (err) {
      throw new Error(`Failed to fetch presentation from host "${this.host}": ${(err as Error).message}`, { cause: err });
    }

    const { kulus, error } = await response.json() as Partial<PresentationResponseDto>;

    if (!response.ok || !kulus?.length) {
      throw new Error(error?.message ?? `Failed to fetch presentation with guid "${guid}" from host "${this.host}"`);
    }

    return kulus[0];
  }
}
