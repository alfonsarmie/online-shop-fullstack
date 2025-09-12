import { Request, Response } from "express";
import Product from "../models/product-model";
import Category from "../models/category-model";
import Price from "../models/price-model";
import Image from "../models/image-model";
import db from "../db/connection";

export const createProduct = async ( req: Request, res: Response ): Promise<Response> => {
  const transaction = await db.transaction();
  try {
    const { name, description, stock, idCategory, initialPrice, images } =
      req.body;

    // Validate that category exists
    const category = await Category.findByPk(idCategory, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Category does not exist",
      });
    }

    // Create a new product
    const productCreated = await Product.create(
      {
        name,
        description,
        stock,
        idCategory,
      },
      { transaction }
    );

    // Create initial price if provided
    if (initialPrice !== undefined) {
      await Price.create(
        {
          idProduct: productCreated.idProduct,
          value: initialPrice,
          updateDate: new Date(),
        },
        { transaction }
      );
    }

    // Add images if provided
    if (images && Array.isArray(images)) {
      for (const imageData of images) {
        await Image.create(
          {
            idProduct: productCreated.idProduct,
            url: imageData.url,
            description: imageData.description || "",
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    // Get the complete product with associations
    const completeProduct = await Product.findByPk(productCreated.idProduct, {
      include: [
        {
          model: Price,
          as: "prices",
          limit: 1,
          order: [["updateDate", "DESC"]],
        },
        { model: Image, as: "images" },
      ],
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: completeProduct,
    });
  } catch (error: any) {
    // Check if transaction has already been committed
    // @ts-ignore: Property 'finished' does not exist on type 'Transaction' but it exists at runtime
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
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
  const transaction = await db.transaction();

  try {
    // Find product
    const productToDelete = await Product.findByPk(id, { transaction });
    if (!productToDelete) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete related prices and images first
    await Price.destroy({
      where: { idProduct: id },
      transaction,
    });

    await Image.destroy({
      where: { idProduct: id },
      transaction,
    });

    // Delete product
    await productToDelete.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    // Check if transaction has already been committed
    // @ts-ignore: Property 'finished' does not exist on type 'Transaction' but it exists at runtime
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    return res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Price, as: "prices", order: [["updateDate", "DESC"]] },
        { model: Image, as: "images" },
        { model: Category, as: "category" },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Price,
          as: "prices",
          order: [["updateDate", "DESC"]],
          limit: 1, // Get only the latest price
        },
        { model: Image, as: "images", limit: 1 }, // Get only the first image
        { model: Category, as: "category" },
      ],
    });

    return res.status(200).json({
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};