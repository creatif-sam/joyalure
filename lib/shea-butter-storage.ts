import { createClient } from '@/lib/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload an image to Supabase storage
 * @param file - File object to upload
 * @param productId - Optional product ID to organize files
 * @returns Upload result with public URL
 */
export async function uploadSheaButterImage(
  file: File,
  productId?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        url: '',
        path: '',
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.',
      };
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        url: '',
        path: '',
        error: 'File size exceeds 5MB limit.',
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = productId
      ? `${productId}/${timestamp}-${randomString}.${fileExt}`
      : `${timestamp}-${randomString}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('shea-butter-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        url: '',
        path: '',
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('shea-butter-images')
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      url: '',
      path: '',
      error: 'An unexpected error occurred during upload.',
    };
  }
}

/**
 * Upload a video to Supabase storage
 * @param file - File object to upload
 * @param productId - Optional product ID to organize files
 * @returns Upload result with public URL
 */
export async function uploadSheaButterVideo(
  file: File,
  productId?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      return {
        url: '',
        path: '',
        error: 'Invalid file type. Only MP4, MOV, AVI, and WebM videos are allowed.',
      };
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return {
        url: '',
        path: '',
        error: 'File size exceeds 50MB limit.',
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = productId
      ? `${productId}/${timestamp}-${randomString}.${fileExt}`
      : `${timestamp}-${randomString}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('shea-butter-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        url: '',
        path: '',
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('shea-butter-videos')
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      url: '',
      path: '',
      error: 'An unexpected error occurred during upload.',
    };
  }
}

/**
 * Delete an image from Supabase storage
 * @param path - File path in storage
 */
export async function deleteSheaButterImage(path: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from('shea-butter-images')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Delete a video from Supabase storage
 * @param path - File path in storage
 */
export async function deleteSheaButterVideo(path: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from('shea-butter-videos')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Delete multiple images from Supabase storage
 * @param paths - Array of file paths
 */
export async function deleteSheaButterImages(paths: string[]): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from('shea-butter-images')
      .remove(paths);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Delete multiple videos from Supabase storage
 * @param paths - Array of file paths
 */
export async function deleteSheaButterVideos(paths: string[]): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from('shea-butter-videos')
      .remove(paths);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}
