import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DownloadFileService } from './DownloadFileService';

describe('DownloadFileService', () => {
  let service: DownloadFileService;

  beforeEach(() => {
    service = new DownloadFileService();
    vi.restoreAllMocks();
  });

  it('should create a download link and click it', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    const realLink = document.createElement('a');
    const setAttributeSpy = vi.spyOn(realLink, 'setAttribute');
    const clickMock = vi.fn();
    realLink.click = clickMock;
    realLink.download = 'true'; // притворимся, что поддерживается

    // мок createElement
    vi.spyOn(document, 'createElement').mockReturnValue(realLink);

    // мок URL
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:http://test.com'),
    });

    const service = new DownloadFileService();
    service.downloadFile('data', 'file.csv', 'text/csv');

    expect(setAttributeSpy).toHaveBeenCalledWith(
      'href',
      'blob:http://test.com'
    );
    expect(setAttributeSpy).toHaveBeenCalledWith('download', 'file.csv');
    expect(appendSpy).toHaveBeenCalledWith(realLink);
    expect(clickMock).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith(realLink);
  });

  it('should do nothing if download attribute is not supported', () => {
    const linkMock = {
      download: undefined,
    } as any;

    vi.spyOn(document, 'createElement').mockReturnValue(linkMock);

    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const clickSpy = vi.fn();
    linkMock.click = clickSpy;

    service.downloadFile('text', 'a.txt', 'text/plain');

    expect(appendSpy).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
  });
});
