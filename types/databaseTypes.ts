export type AddProduct = {
  name: string;
  description: string;
  category: string;
  priceInPennies: number;
  stock: number;
  sold: number;
  gender: string;
  colors: string[];
  sizes: string[];
  isAvailable: string;
  images: File[];
};

export type OriginalProduct = {
  product_id: number;
  name: string;
  description: string;
  category: string;
  priceInPennies: number;
  stock: number;
  sold: number;
  gender: string;
  isAvailable: string;
  created_at: string;
  sizes: string;
  colors: string;
  images: string;
};

export type UpdatedProduct = {
  product_id: number;
  name: string;
  description: string;
  category: string;
  priceInPennies: number;
  stock: number;
  sold: number;
  gender: string;
  isAvailable: string;
  created_at: string;
  colors: string[];
  sizes: string[];
  images: string[];
};

export type UpdateProduct = {
  product_id: string;
  name: string;
  description: string;
  category: string;
  priceInPennies: string;
  stock: string;
  sold: string;
  gender: string;
  colors: string[];
  sizes: string[];
  isAvailable: string;
  existingImages: string[];
  newImages: string[];
};

export type NewestBestSellerProducts = {
  product_id: number;
  name: string;
  priceInPennies: number;
  images: string[];
};

export type NewestBestSellerProduct = {
  product_id: number;
  name: string;
  priceInPennies: number;
  images: string;
};

export type SlideShowImages = {
  image_id: number;
  image_spot: number;
  path: string;
};
