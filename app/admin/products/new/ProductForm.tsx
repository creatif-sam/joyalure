"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const formData = new FormData(e.currentTarget);

    const product = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      image_url: formData.get('image') as string,
      rating: 0,
      reviews: 0,
      is_recent: true,
    };

    const { error } = await supabase
      .from('products')
      .insert([product]);

    if (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    } else {
      router.push('/admin/products');
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" required />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" type="url" required />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}