import React, { useState, useEffect } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { MOCK_GALLERY } from '../services/mockData';

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.data.items.length === 0) {
          setGalleryItems(MOCK_GALLERY);
        } else {
          setGalleryItems(res.data.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch gallery', error);
        setGalleryItems(MOCK_GALLERY);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <PublicLayout>
      <section className="pt-32 pb-20 bg-[#0A0F1C] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Gallery</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Explore the best highlights from our recent tournaments and events.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading gallery...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-[#131C31] rounded-2xl border border-white/5">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No images in the gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item._id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#131C31]">
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity delay-100 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};
