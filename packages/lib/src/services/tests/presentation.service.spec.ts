import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PresentationService, PresentationResponseDto } from '../presentation.service';
import { Presentation, MetadataType } from '@/interfaces/presentation';

// Mock fetch globally
const mockFetch = vi.fn();

global.fetch = mockFetch;

describe('PresentationService', () => {
  const presentationService = new PresentationService();

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getPresentation', () => {
    const mockGuid = 'test-guid-123';
    const mockHost = 'example.com';
    const expectedUrl = `https://${mockHost}/api/2.2/rest/widgets/${mockGuid}.json?offset=0&limit=1&sortBy=title%2CASCENDING&useUserAuth=false`;

    const mockPresentation: Presentation = {
      audioOnly: false,
      created: '2023-01-01T00:00:00Z',
      duration: 3600,
      guid: mockGuid,
      public: true,
      title: 'Test Presentation',
      vod: true,
    };

    const mockSuccessResponse: Partial<PresentationResponseDto> = {
      kulus: [mockPresentation],
      total: 1,
    };

    it('should successfully fetch a presentation', async () => {
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockSuccessResponse),
        ok: true,
      });

      const result = await presentationService.getPresentation(mockGuid, mockHost, 'title', 'ASCENDING');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
        method: 'GET',
      });
      expect(result).toEqual(mockPresentation);
    });

    it('should construct the correct URL with parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockSuccessResponse),
        ok: true,
      });

      await presentationService.getPresentation(mockGuid, mockHost, 'title', 'ASCENDING');

      const mockCall = mockFetch.mock.calls[0] as unknown[];
      const url = mockCall[0] as string;

      expect(url).toBe(expectedUrl);
    });

    it('should throw error when fetch fails due to network error', async () => {
      const networkError = new Error('Network error');

      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        presentationService.getPresentation(mockGuid, mockHost, 'title', 'ASCENDING'),
      ).rejects.toThrow(`Failed to fetch presentation from host "${mockHost}": Network error`);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockSuccessResponse),
        ok: false,
      });

      await expect(
        presentationService.getPresentation(mockGuid, mockHost, 'title', 'ASCENDING'),
      ).rejects.toThrow(`Failed to fetch presentation with guid "${mockGuid}" from host "${mockHost}"`);
    });

    it('should throw error when no presentations are returned', async () => {
      const emptyResponse: Partial<PresentationResponseDto> = {
        kulus: [],
        total: 0,
      };

      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(emptyResponse),
        ok: true,
      });

      await expect(
        presentationService.getPresentation(mockGuid, mockHost, 'title', 'ASCENDING'),
      ).rejects.toThrow(`Failed to fetch presentation with guid "${mockGuid}" from host "${mockHost}"`);
    });

    it('should handle special characters in guid and host', async () => {
      const specialGuid = 'guid-with-special-chars123';
      const specialHost = 'test-host.example.com';
      const expectedSpecialUrl = `https://${specialHost}/api/2.2/rest/widgets/${specialGuid}.json?offset=0&limit=1&sortBy=title%2CASCENDING&useUserAuth=false`;

      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          ...mockSuccessResponse,
          kulus: [{
            ...mockPresentation,
            guid: specialGuid,
          }],
        }),
        ok: true,
      });

      const result = await presentationService.getPresentation(specialGuid, specialHost, 'title', 'ASCENDING');

      expect(mockFetch).toHaveBeenCalledWith(expectedSpecialUrl, {
        method: 'GET',
      });
      expect(result.guid).toBe(specialGuid);
    });

    it('should return the first presentation when multiple are returned', async () => {
      const multipleResponse: Partial<PresentationResponseDto> = {
        kulus: [
          mockPresentation,
          {
            ...mockPresentation,
            guid: 'second-guid',
            title: 'Second Presentation',
          },
          {
            ...mockPresentation,
            guid: 'third-guid',
            title: 'Third Presentation',
          },
        ],
        total: 3,
      };

      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(multipleResponse),
        ok: true,
      });

      const result = await presentationService.getPresentation(mockGuid, mockHost);

      expect(result).toEqual(mockPresentation);
      expect(result.guid).toBe(mockGuid);
      expect(result.title).toBe('Test Presentation');
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        ok: true,
      });

      await expect(
        presentationService.getPresentation(mockGuid, mockHost),
      ).rejects.toThrow('Invalid JSON');
    });

    it('should throw error with invalid URL parameters', async () => {
      const emptyGuid = '';
      const emptyHost = '';

      await expect(
        presentationService.getPresentation(emptyGuid, emptyHost),
      ).rejects.toThrow('Invalid URL');
    });

    it('should handle presentations with minimal data', async () => {
      const minimalPresentation: Presentation = {
        guid: mockGuid,
      };

      const minimalResponse: Partial<PresentationResponseDto> = {
        kulus: [minimalPresentation],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(minimalResponse),
        ok: true,
      });

      const result = await presentationService.getPresentation(mockGuid, mockHost);

      expect(result).toEqual(minimalPresentation);
      expect(result.guid).toBe(mockGuid);
      expect(result.title).toBeUndefined();
    });

    it('should handle presentations with complete metadata', async () => {
      const completePresentation: Presentation = {
        audioOnly: true,
        created: '2023-01-01T00:00:00Z',
        duration: 7200,
        guid: mockGuid,
        metadata: [
          {
            guid: 'meta-guid-1',
            html: '<p>Test description</p>',
            title: 'Description',
            type: MetadataType.Text,
          },
        ],
        player: 'html5',
        public: true,
        published: new Date('2023-01-01T12:00:00Z'),
        publisher: {
          guid: 'user-guid',
          name: 'John Doe',
          username: 'johndoe',
        },
        summary: 'Test summary',
        thumbnail: {
          autoGenerated: false,
          cdnUrl: 'https://cdn.example.com/thumb.jpg',
          height: 480,
          url: 'https://example.com/thumb.jpg',
          width: 640,
        },
        title: 'Complete Test Presentation',
        vod: true,
      };

      const completeResponse: Partial<PresentationResponseDto> = {
        kulus: [completePresentation],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(completeResponse),
        ok: true,
      });

      const result = await presentationService.getPresentation(mockGuid, mockHost);

      expect(result).toEqual(completePresentation);
      expect(result.metadata).toHaveLength(1);
      expect(result.publisher?.name).toBe('John Doe');
      expect(result.thumbnail?.autoGenerated).toBe(false);
    });
  });
});
