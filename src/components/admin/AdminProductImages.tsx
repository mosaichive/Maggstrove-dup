import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, Trash2, GripVertical, Loader2, ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductImage {
  id: string;
  product_id: string;
  category: string;
  image_url: string;
  label: string | null;
  sort_order: number;
}

interface AdminProductImagesProps {
  productId: string;
  category: string;
  open: boolean;
  onClose: () => void;
}

const AdminProductImages = ({ productId, category, open, onClose }: AdminProductImagesProps) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) fetchImages();
  }, [open, productId]);

  const fetchImages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order");
    setImages((data as any as ProductImage[]) || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop();
        const path = `${category}/${productId}-${Date.now()}-${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);

        await supabase.from("product_images").insert({
          product_id: productId,
          category,
          image_url: data.publicUrl,
          sort_order: images.length + i,
        } as any);
      }
      toast.success(`${files.length} image(s) uploaded`);
      fetchImages();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAddUrl = async () => {
    if (!imageUrl.trim()) return;
    await supabase.from("product_images").insert({
      product_id: productId,
      category,
      image_url: imageUrl.trim(),
      sort_order: images.length,
    } as any);
    setImageUrl("");
    fetchImages();
    toast.success("Image added");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("product_images").delete().eq("id", id);
    fetchImages();
    toast.success("Image removed");
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...images];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    // Update sort orders
    for (let i = 0; i < updated.length; i++) {
      await supabase.from("product_images")
        .update({ sort_order: i } as any)
        .eq("id", updated[i].id);
    }
    fetchImages();
  };

  const handleMoveDown = async (idx: number) => {
    if (idx === images.length - 1) return;
    const updated = [...images];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    for (let i = 0; i < updated.length; i++) {
      await supabase.from("product_images")
        .update({ sort_order: i } as any)
        .eq("id", updated[i].id);
    }
    fetchImages();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Manage Product Images
          </DialogTitle>
          <DialogDescription>Upload, reorder, or remove images. The first image becomes the main product photo.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            {/* Current Images */}
            <div className="space-y-2">
              {images.map((img, idx) => (
                <div key={img.id} className="flex items-center gap-3 p-2 bg-secondary/50 border border-border rounded">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
                    <button onClick={() => handleMoveDown(idx)} disabled={idx === images.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
                  </div>
                  <img src={img.image_url} alt={`Product ${idx + 1}`} className="w-16 h-20 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{idx === 0 ? "Main Image" : `Image ${idx + 1}`}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{img.image_url}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0 flex-shrink-0" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {images.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No images uploaded yet</p>}
            </div>

            {/* Upload */}
            <div className="space-y-2 border-t border-border pt-3">
              <Label className="text-xs font-semibold">Add Images</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {uploading ? "Uploading..." : "Upload Files"}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
              </div>
              <div className="flex gap-2">
                <Input placeholder="Or paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="text-xs" />
                <Button size="sm" variant="outline" onClick={handleAddUrl} disabled={!imageUrl.trim()}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductImages;
