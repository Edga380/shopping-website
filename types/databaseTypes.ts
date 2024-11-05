export type UserData = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  session_cookie_id: string;
  auth_cookie_id: string;
  auth_cookie_created_at: string;
  resetPasswordToken: string;
  resetPasswordExpires: string;
  created_at: string;
};

export type OriginalProduct = {
  product_id: number;
  name: string;
  description: string;
  category: string;
  base_price_in_pennies: number;
  gender: string;
  is_available: string;
  created_at: string;
  product_variations: string;
};

export type UpdatedProduct = {
  product_id: number;
  name: string;
  description: string;
  category: string;
  base_price_in_pennies: number;
  gender: string;
  is_available: string;
  created_at: string;
  product_variations: [
    {
      product_variation_id: number;
      color: string;
      product_size_inventory: [
        {
          size: string;
          stock: string;
          sold: string;
          discount: string;
        }
      ];
      images: string[];
    }
  ];
};

export type SlideShowImages = {
  image_id: number;
  image_spot: number;
  path: string;
};

export type ContactUsSubmissions = {
  contact_form_id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  replied: string;
  created_at: string;
};

export type NewsLetterEmailsData = {
  news_letter_subscription_id: number;
  news_letter_subscription_email: string;
  created_at: string;
};

export type NewsLetterSection = {
  sectionId: number;
  title: string;
  imageUrl: string;
  message: string;
  buttonLink: string;
  buttonName: string;
};

export type getNewsLetterSections = {
  id: number;
  subject: string;
  created_at: string;
  sections: [
    {
      section: [
        {
          title: string;
          message: string;
          button_name: string;
          button_link: string;
          image_path: string;
        }
      ];
    }
  ];
};

export type getProductCategories = {
  product_category_id: number;
  category: string;
};

export type getProductColors = {
  product_color_id: number;
  color: string;
};

export type getProductSizes = {
  product_size_id: number;
  categories: string;
  size: string;
};

export type Cart = {
  cart_id: number;
  user_id: number;
  product_id: number;
  product_variation_id: number;
  product_size: string;
  quantity: number;
  created_at: string;
};
