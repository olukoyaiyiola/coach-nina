'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Star,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { MediaAsset, SiteSettings } from '@/lib/types';

interface MediaLibraryProps {
  settings: SiteSettings;
  onAssetAssigned: () => void;
}

export default function MediaLibrary({ settings, onAssetAssigned }: MediaLibraryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAssets(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMessage(`✓ Uploaded ${file.name} successfully!`);
      fetchAssets();
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;

    setImporting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ import_url: importUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setMessage('✓ Media imported and persisted successfully!');
      setImportUrl('');
      fetchAssets();
    } catch (err: any) {
      setError(err?.message || 'Failed to import URL');
    } finally {
      setImporting(false);
    }
  };

  const assignAsset = async (field: 'hero_image_url' | 'bio_image_url', url: string) => {
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: url }),
      });

      if (!res.ok) throw new Error('Failed to assign asset');

      setMessage(`✓ Image assigned to ${field === 'hero_image_url' ? 'Hero' : 'Bio'}!`);
      onAssetAssigned();
    } catch (err: any) {
      setError(err?.message || 'Assignment failed');
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;

    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/media?id=${assetId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setMessage('✓ Asset removed');
      fetchAssets();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Upload and Import Actions Bar */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-charcoal font-serif">
              Media Asset Library
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              Upload photos from Android/desktop, import public URLs securely, and assign hero/bio imagery.
            </p>
          </div>

          <button
            onClick={fetchAssets}
            className="p-2 text-stone-500 hover:text-brand-gold border border-brand-border rounded-xl bg-brand-surface text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload from Device / Android Gallery */}
          <div className="border border-dashed border-brand-border hover:border-brand-gold rounded-2xl p-6 bg-brand-surface/60 text-center transition-colors">
            <Upload className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="text-sm font-bold text-brand-charcoal mb-1">
              Upload from Device
            </h3>
            <p className="text-stone-500 text-xs mb-4">
              Select image from Android gallery, camera, or desktop folder. (Max 15MB)
            </p>

            <label className="inline-flex items-center gap-2 bg-brand-charcoal hover:bg-stone-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-all shadow-sm">
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Import Public Image URL */}
          <div className="border border-brand-border rounded-2xl p-6 bg-brand-surface/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-brand-gold" />
                <h3 className="text-sm font-bold text-brand-charcoal">
                  Import from Public URL
                </h3>
              </div>
              <p className="text-stone-500 text-xs mb-3">
                Paste an HTTPS image link. Validates against SSRF and saves to persistent storage.
              </p>
            </div>

            <form onSubmit={handleUrlImport} className="flex gap-2">
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3 py-2 rounded-xl border border-brand-border bg-white text-brand-charcoal text-xs focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                disabled={importing || !importUrl.trim()}
                className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                {importing ? 'Importing...' : 'Import'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Visual Asset Grid */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-brand-charcoal font-serif mb-4">
          All Media Assets ({assets.length})
        </h3>

        {loading ? (
          <p className="text-xs text-stone-500">Loading media library...</p>
        ) : assets.length === 0 ? (
          <p className="text-xs text-stone-500">No media assets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const isHero = settings.hero_image_url === asset.url;
              const isBio = settings.bio_image_url === asset.url;

              return (
                <div
                  key={asset.id}
                  className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between hover:border-brand-gold/60 transition-colors shadow-2xs"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-brand-border/60 mb-3">
                      <Image
                        src={asset.url}
                        alt={asset.original_name || asset.filename}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />

                      {/* Active placement badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {isHero && (
                          <span className="bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            Hero Image
                          </span>
                        )}
                        {isBio && (
                          <span className="bg-brand-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            Bio Image
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="font-semibold text-xs text-brand-charcoal truncate" title={asset.original_name}>
                      {asset.original_name}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {(asset.file_size / (1024 * 1024)).toFixed(2)} MB • {asset.file_type}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => assignAsset('hero_image_url', asset.url)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                          isHero
                            ? 'bg-brand-gold text-white border-brand-gold'
                            : 'bg-white hover:bg-brand-surface text-stone-700 border-brand-border'
                        }`}
                      >
                        Set Hero
                      </button>
                      <button
                        onClick={() => assignAsset('bio_image_url', asset.url)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                          isBio
                            ? 'bg-brand-charcoal text-white border-brand-charcoal'
                            : 'bg-white hover:bg-brand-surface text-stone-700 border-brand-border'
                        }`}
                      >
                        Set Bio
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
