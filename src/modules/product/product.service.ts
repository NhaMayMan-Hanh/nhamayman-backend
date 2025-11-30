import Product from "./product.model";
import { IProduct } from "./product.model";
import Order from "../order/order.model";

interface ProductQuery {
  category?: string;
  search?: string;
}

export const getAllProducts = async (
  query: ProductQuery = {},
  options: { excludeFields?: string[]; limit?: number } = {}
): Promise<IProduct[]> => {
  let filter: any = {};

  if (query.category) filter.category = query.category;
  if (query.search) filter.name = { $regex: query.search, $options: "i" };

  const products = await Product.find(filter)
    .select(
      `-createdAt -updatedAt ${
        options.excludeFields ? options.excludeFields.map((f) => `-${f}`).join(" ") : ""
      }`
    )
    .sort({ createdAt: -1 })
    .limit((options.limit ?? 0) as number);

  return products;
};

export const getProductById = async (
  id: string
  // Không cần options exclude nữa, vì detail luôn full
): Promise<IProduct | null> => {
  // Detail luôn full, không exclude gì ngoài timestamps
  return Product.findById(id).select("-createdAt -updatedAt");
};

export const getRelatedProducts = async (
  category: string,
  excludeId: string,
  options: { excludeFields?: string[]; limit?: number } = {
    excludeFields: ["description", "detailedDescription"],
    limit: 4,
  }
): Promise<IProduct[]> => {
  return Product.find({
    category,
    _id: { $ne: excludeId },
  })
    .select(
      `-createdAt -updatedAt ${
        options.excludeFields ? options.excludeFields.map((f) => `-${f}`).join(" ") : ""
      }`
    )
    .sort({ createdAt: -1 })
    .limit((options.limit ?? 0) as number);
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

export const deleteProduct = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const product = await Product.findById(id);
  if (!product) {
    return { success: false, message: "Sản phẩm không tồn tại" };
  }

  const activeOrder = await Order.findOne({
    "items.productId": id,
    status: { $nin: ["delivered", "cancelled"] },
  });

  if (activeOrder) {
    return {
      success: false,
      message: `Không thể xóa sản phẩm "${product.name}" vì còn đơn hàng đang xử lý`,
    };
  }

  await Product.findByIdAndDelete(id);

  return {
    success: true,
    message: "Xóa sản phẩm thành công",
  };
};
