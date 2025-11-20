import { Presentation } from '@/interfaces/presentation';

export interface PresentationResponseDto {
  kulus: Presentation[];
  total: number;
}

export class PresentationService {
  async getPresentation(guid: string, host: string): Promise<Presentation> {
    const url = new URL(`/api/2.2/rest/widgets/${guid}.json`, `https://${host}`);

    url.searchParams.set('offset', '0');
    url.searchParams.set('limit', '1');
    // TODO: make the sortBy option configurable in the config
    url.searchParams.set('sortBy', 'created,DESCENDING');
    url.searchParams.set('useUserAuth', 'false');

    let response: Response;

    try {
      response = await fetch(url.toString(), {
        method: 'GET',
      });
    } catch (err) {
      throw new Error(`Failed to fetch presentation from host "${host}": ${(err as Error).message}`, { cause: err });
    }

    const { kulus } = await response.json() as PresentationResponseDto;

    if (!response.ok || kulus.length === 0) {
      throw new Error(`Failed to fetch presentation with guid "${guid}" from host "${host}"`);
    }

    return kulus[0];
  }
}
