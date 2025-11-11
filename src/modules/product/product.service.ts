import Product from "./product.model";
import { IProduct } from "./product.model";

interface ProductQuery {
  category?: string;
  search?: string;
}

export const getAllProducts = async (query: ProductQuery): Promise<IProduct[]> => {
  let filter: any = {};

  if (query.category) {
    filter.category = query.category;
  }
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  return Product.find(filter).sort({ createdAt: -1 });
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id);
};

export const getRelatedProducts = async (
  category: string,
  excludeId: string,
  limit: number = 4
): Promise<IProduct[]> => {
  return Product.find({
    category,
    _id: { $ne: excludeId }, // Loại trừ sản phẩm hiện tại
  })
    .limit(limit)
    .sort({ createdAt: -1 });
};

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  const newProduct = new Product(productData);
  return newProduct.save();
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};
