import { Request, Response } from "express";
import Product from "../models/product-model";
import Category from "../models/category-model";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, description, stock, idCategory } = req.body;

    // Validate that category exists
    const category = await Category.findByPk(idCategory);
    if (!category) {
      return res.status(400).json({
        message: "Category does not exist",
      });
    }
    // Create a new product
    const newProduct = {
      name,
      description,
      stock,
      idCategory,
    };

    const productCreated = await Product.create(newProduct);

    return res.status(201).json({
      message: "Product created successfully",
      product: productCreated,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, description, stock, idCategory } = req.body;

  try {
    // Find the product
    const productToUpdate = await Product.findByPk(id);
    if (!productToUpdate) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Validate new category exists
    if (idCategory !== undefined) {
      const category = await Category.findByPk(idCategory);
      if (!category) {
        return res.status(400).json({
          message: "Category does not exist",
        });
      }
      productToUpdate.idCategory = idCategory;
    }

    // Update fields
    if (name !== undefined) productToUpdate.name = name;
    if (description !== undefined) productToUpdate.description = description;
    if (stock !== undefined) productToUpdate.stock = stock;

    // Save changes
    await productToUpdate.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product: productToUpdate,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    // Find product
    const productToDelete = await Product.findByPk(id);
    if (!productToDelete) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete product
    await productToDelete.destroy();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
