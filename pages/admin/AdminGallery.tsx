import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MOCK_GALLERY } from '../../services/mockData';

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      if (res.data.data.items.length === 0) {
        setItems(MOCK_GALLERY);
      } else {
        setItems(res.data.data.items);
      }
    } catch {
      setItems(MOCK_GALLERY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/gallery', { title, imageUrl, description });
      toast.success('Gallery item added');
      setTitle('');
      setImageUrl('');
      setDescription('');
      fetchGallery();
    } catch {
      // Fallback for demo
      const newItem = { _id: `g${Date.now()}`, title, imageUrl, description };
      setItems([newItem, ...items]);
      toast.success('Gallery item added locally (Demo mode)');
      setTitle('');
      setImageUrl('');
      setDescription('');
    }
  };

  const handleDelete = async (id: string) => {
    // Note: Using custom modal or simple confirm is fine for demo, but window.confirm might be blocked in iframe
    // We'll keep it for now but handle the fallback
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Gallery item deleted');
      fetchGallery();
    } catch {
      // Fallback for demo
      setItems(items.filter(item => item._id !== id));
      toast.success('Gallery item deleted locally (Demo mode)');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery Management</h1>
          <p className="text-slate-500">Manage images shown on the public landing page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card title="Add New Image">
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleFileChange}
                  required
                />
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Preview" className="h-20 w-auto rounded border" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add to Gallery
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Gallery Items">
            {loading ? (
              <p>Loading...</p>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No images in the gallery yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                          {item.description && <p className="text-sm text-slate-500 mt-1">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
