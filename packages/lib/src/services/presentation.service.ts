import { Presentation } from '@/interfaces/presentation';

export interface PresentationResponseDto {
  kulus: Presentation[];
  total: number;
  error: {
    code: string;
    httpCode: number;
    message: string;
  };
}

export type SortOrder = 'ASCENDING' | 'DESCENDING';

export class PresentationService {
  async getPresentation(guid: string, host: string, sortBy = 'created', sortOrder: SortOrder = 'DESCENDING'): Promise<Presentation> {
    const url = new URL(`/api/2.2/rest/widgets/${guid}.json`, `https://${host}`);

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
      throw new Error(`Failed to fetch presentation from host "${host}": ${(err as Error).message}`, { cause: err });
    }

    const { kulus, error } = await response.json() as Partial<PresentationResponseDto>;

    if (!response.ok || !kulus?.length) {
      throw new Error(error?.message ?? `Failed to fetch presentation with guid "${guid}" from host "${host}"`);
    }

    return kulus[0];
  }
}
