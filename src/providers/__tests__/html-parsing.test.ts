import { describe, it, expect } from 'vitest';
import { BaseProvider } from '../base-provider';

// Create a test provider to access protected methods
class TestProvider extends BaseProvider {
	public readonly name = 'Test Provider';
	
	public async getGames(): Promise<any[]> {
		return [];
	}
	
	public async getGameById(): Promise<any | null> {
		return null;
	}
	
	public async searchGames(): Promise<any[]> {
		return [];
	}
	
	public async getCategories(): Promise<any[]> {
		return [];
	}
	
	// Expose protected methods for testing
	public testExtractDownloadLinks(html: string) {
		return this.extractDownloadLinks(html);
	}
	
	public testExtractSystemRequirements(html: string) {
		return this.extractSystemRequirements(html);
	}
}

describe('BaseProvider - HTML Parsing', () => {
	const provider = new TestProvider({});

	describe('extractDownloadLinks', () => {
		it('should extract download links with nested tags and HTML entities', () => {
			const html = `
				<p style="text-align: center;">
					<a href="https://pixeldrain.com/u/abc123" target="_blank" rel="nofollow">
						<strong><<< Alternatif: Link1 >>></strong>
					</a>
				</p>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			expect(links).toHaveLength(1);
			expect(links[0]).toMatchObject({
				url: 'https://pixeldrain.com/u/abc123',
				available: true,
				label: '<<< Alternatif: Link1 >>>',
				type: 'direct1',
			});
		});

		it('should extract multiple download links', () => {
			const html = `
				<p style="text-align: center;">
					<a href="https://pixeldrain.com/u/abc123" target="_blank" rel="nofollow">
						<strong><<< Alternatif: Link1 >>></strong>
					</a>
				</p>
				<hr />
				<p style="text-align: center;">
					<a href="https://www.mediafire.com/folder/test" target="_blank" rel="nofollow">
						<strong><<< Alternatif: Link2 >>></strong>
					</a>
				</p>
				<hr />
				<p style="text-align: center;">
					<a href="https://drive.google.com/file/d/xyz/view" target="_blank" rel="nofollow">
						<strong><<< Alternatif: Link3 >>></strong>
					</a>
				</p>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			expect(links).toHaveLength(3);
			expect(links[0].url).toBe('https://pixeldrain.com/u/abc123');
			expect(links[0].type).toBe('direct1');
			expect(links[1].url).toBe('https://www.mediafire.com/folder/test');
			expect(links[1].type).toBe('direct2');
			expect(links[2].url).toBe('https://drive.google.com/file/d/xyz/view');
			expect(links[2].type).toBe('direct3');
		});

		it('should identify torrent links correctly', () => {
			const html = `
				<p style="text-align: center;">
					<a href="https://www.dosyadrive.vip/magnet" target="_blank" rel="nofollow">
						<strong><<< Torrent: İndir >>></strong>
					</a>
				</p>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			expect(links).toHaveLength(1);
			expect(links[0].type).toBe('torrent');
			expect(links[0].label).toBe('<<< Torrent: İndir >>>');
		});

		it('should mark unavailable links when wrapped in <del> tags', () => {
			const html = `
				<p style="text-align: center;">
					<del>
						<strong><<< Alternatif: Link3 >>></strong>
					</del>
				</p>
				<hr />
				<p style="text-align: center;">
					<a href="https://test.com/file" target="_blank" rel="nofollow">
						<strong><<< Alternatif: Link1 >>></strong>
					</a>
				</p>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			// Only the available link should be extracted
			expect(links.length).toBeGreaterThanOrEqual(1);
			const availableLink = links.find((l: any) => l.label === '<<< Alternatif: Link1 >>>');
			expect(availableLink).toBeDefined();
			expect(availableLink?.available).toBe(true);
		});

		it('should handle turbobit links', () => {
			const html = `
				<p style="text-align: center;">
					<a href="https://turbobit.net/test123.html" target="_blank" rel="nofollow">
						<strong><<< Alternatif: Link1 >>></strong>
					</a>
				</p>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			expect(links).toHaveLength(1);
			expect(links[0].type).toBe('turbobit');
		});

		it('should decode HTML entities correctly', () => {
			const html = `
				<a href="https://test.com">
					<strong>Test &#8211; Special & Chars <></strong>
				</a>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			expect(links).toHaveLength(1);
			expect(links[0].label).toBe('Test - Special & Chars <>');
		});

		it('should handle real API response HTML sample', () => {
			const html = `
				<p style="text-align: center;"><a href="https://pixeldrain.com/u/zUZKteW2" target="_blank" rel="nofollow"><strong><<< Alternatif: Link1 >>></strong></a></p>
				<hr />
				<p style="text-align: center;"><a href="https://www.mediafire.com/folder/307soqnli4zvg/Documents" target="_blank" rel="nofollow"><strong><<< Alternatif: Link2 >>></strong></a></p>
				<hr />
				<p style="text-align: center;"><del><strong><<< Alternatif: Link3 >>></strong></del></p>
				<hr />
				<p style="text-align: center;"><del><strong><<< Torrent: İndir >>></strong></del></p>
			`;
			
			const links = provider.testExtractDownloadLinks(html);
			
			expect(links.length).toBeGreaterThan(0);
			
			// Check pixeldrain link
			const pixeldrainLink = links.find((l: any) => l.url.includes('pixeldrain'));
			expect(pixeldrainLink).toBeDefined();
			expect(pixeldrainLink?.label).toBe('<<< Alternatif: Link1 >>>');
			expect(pixeldrainLink?.type).toBe('direct1');
			
			// Check mediafire link
			const mediafireLink = links.find((l: any) => l.url.includes('mediafire'));
			expect(mediafireLink).toBeDefined();
			expect(mediafireLink?.label).toBe('<<< Alternatif: Link2 >>>');
			expect(mediafireLink?.type).toBe('direct2');
		});
	});

	describe('extractSystemRequirements', () => {
		it('should extract system requirements from HTML', () => {
			const html = `
				<p style="text-align: center;">
					<strong><span style="color: #ff0000;">Skopje 83 PC Sistem vb Gereksinimi:</span></strong>
				</p>
				<p style="text-align: center;">
					– Windows 10/x64-bit<br />
					– 4.çekirdekli GPU ++ İşlemci Hızı<br />
					– Yeni nesil mimarisine sahip 6 GB Vram ++ Ekran Kartı<br />
					– Bellek vb 16 GB ++ RAM<br />
					– 10 GB Depo ++ vb Alanı<br />
					– DX 11 ++
				</p>
				<hr />
				<p>Other content here...</p>
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).not.toBeNull();
			expect(requirements.os).toContain('Windows 10');
			expect(requirements.ram).toContain('16 GB');
			expect(requirements.storage).toContain('10 GB');
			expect(requirements.directX).toContain('DirectX 11');
		});

		it('should extract requirements with different patterns', () => {
			const html = `
				<p>
					<strong>Barotrauma Sistem Gereksinimi:</strong>
				</p>
				<ul>
					<li>Window 7-8-8.1-10 sürümü 64-bit İşletim Sistemi</li>
					<li>2.0 GHZ'li İşlemci</li>
					<li>128 MB Ekran Kartı Video Bellek</li>
					<li>2 GB Ram – Bir Gigabayt Bellek</li>
					<li>Oyunun Boyutu 1.12 GB</li>
				</ul>
				<hr />
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).not.toBeNull();
			expect(requirements.os).toContain('64-bit');
			expect(requirements.cpu).toContain('2.0 GHZ');
			expect(requirements.ram).toContain('2 GB');
			expect(requirements.storage).toContain('1.12 GB');
		});

		it('should return null if no requirements section found', () => {
			const html = `
				<p>Some random content without system requirements</p>
				<p>More content here</p>
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).toBeNull();
		});

		it('should handle Turkish and English labels', () => {
			const html = `
				<p><strong>PC Sistem Gereksinimi:</strong></p>
				<p>
					Windows 10/11/x64-bit<br />
					Intel i5-6500 / AMD A10-58OOK ++ İşlemci Hızı<br />
					Nvidia GeForce GTX 650 / Radeon HD 7510 ++ Ekran Kartı<br />
					Bellek vb 4 GB ++ RAM<br />
					800 MB Depo ++ vb Alanı<br />
					DX 11 ++
				</p>
				<hr />
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).not.toBeNull();
			expect(requirements.os).toContain('Windows');
			expect(requirements.cpu).toContain('Intel i5');
			expect(requirements.gpu).toContain('GeForce');
			expect(requirements.ram).toContain('4 GB');
			expect(requirements.storage).toContain('800 MB');
			expect(requirements.directX).toContain('DirectX 11');
		});

		it('should stop at <hr> tag when extracting requirements', () => {
			const html = `
				<p><strong>PC Sistem Gereksinimi:</strong></p>
				<p>
					Windows 10/x64-bit<br />
					4 GB RAM<br />
					10 GB Storage<br />
					DX 11
				</p>
				<hr />
				<p>This should not be included in requirements</p>
				<p>Neither should this</p>
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).not.toBeNull();
			expect(requirements.os).toContain('Windows 10');
			expect(requirements.ram).toContain('4 GB');
			expect(requirements.storage).toContain('10 GB');
		});

		it('should handle real API response HTML sample', () => {
			const html = `
				<p style="text-align: center;"><strong><span style="color: #ff0000;">Skopje 83 PC Sistem vb Gereksinimi:</span></strong></p>
				<p style="text-align: center;">
					– Windows 10/x64-bit<br />
					– 4.çekirdekli GPU ++ İşlemci Hızı<br />
					– Yeni nesil mimarisine sahip 6 GB Vram ++ Ekran Kartı<br />
					– Bellek vb 16 GB ++ RAM<br />
					– 10 GB Depo ++ vb Alanı<br />
					– DX 11 ++
				</p>
				<hr />
				<p><img src="separator.png" /></p>
				<hr />
				<p style="text-align: center;"><a href="https://pixeldrain.com/u/abc">Link</a></p>
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).not.toBeNull();
			expect(requirements.os).toContain('Windows 10');
			expect(requirements.cpu).toContain('4.çekirdekli');
			expect(requirements.gpu).toContain('6 GB Vram');
			expect(requirements.ram).toContain('16 GB');
			expect(requirements.storage).toContain('10 GB');
			expect(requirements.directX).toBe('DirectX 11');
		});

		it('should clean up whitespace and formatting', () => {
			const html = `
				<p><strong>PC Sistem Gereksinimi:</strong></p>
				<p>
					Windows  10  /  x64-bit<br />
					İşlemci  &nbsp;  Hızı<br />
					Ekran  Kartı<br />
					Bellek  vb  8  GB  ++  RAM<br />
					DX  11
				</p>
				<hr />
			`;
			
			const requirements = provider.testExtractSystemRequirements(html);
			
			expect(requirements).not.toBeNull();
			// Check that excessive whitespace is removed
			expect(requirements.os).not.toContain('  ');
			expect(requirements.ram).not.toContain('  ');
		});
	});
});