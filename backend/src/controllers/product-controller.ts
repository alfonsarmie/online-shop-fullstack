import { Request, Response } from "express";
import Product from "../models/product-model";
import Category from "../models/category-model";
import Price from "../models/price-model";
import Image from "../models/image-model";
import db from "../db/connection";
import ProductSize from "../models/size-product-model";
import Size from "../models/size-model";
import { FindOptions, Op, WhereOptions } from "sequelize";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const transaction = await db.transaction();
  try {
    const {
      name,
      description,
      stock,
      idCategory,
      initialPrice,
      images,
      sizes,
    } = req.body;

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

    // Add sizes if provided
    if (sizes && Array.isArray(sizes)) {
      for (const sizeId of sizes) {
        await ProductSize.create(
          {
            idProduct: productCreated.idProduct,
            idSize: sizeId,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    // Get the complete product with ALL associations including sizes and category
    const completeProduct = await Product.findByPk(productCreated.idProduct, {
      include: [
        {
          model: Price,
          as: "prices",
          limit: 1,
          order: [["updateDate", "DESC"]],
        },
        {
          model: Image,
          as: "images",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Size,
          as: "sizes",
          through: { attributes: [] }, // Exclude the join table attributes
        },
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

  // Extract fields from body
  const { name, description, stock, idCategory, sizes, initialPrice, images } =
    req.body;

  const transaction = await db.transaction();

  try {
    // Find the product
    const productToUpdate = await Product.findByPk(id, { transaction });
    if (!productToUpdate) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Validate new category exists if provided
    if (idCategory !== undefined) {
      const category = await Category.findByPk(idCategory, {
        transaction,
      });
      if (!category) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Category does not exist",
        });
      }
      productToUpdate.idCategory = idCategory;
    }

    // Update basic fields
    if (name !== undefined) productToUpdate.name = name;
    if (description !== undefined) productToUpdate.description = description;
    if (stock !== undefined) productToUpdate.stock = stock;

    // Save changes to product
    await productToUpdate.save({ transaction });

    // Update price if provided
    if (initialPrice !== undefined) {
      await Price.create(
        {
          idProduct: parseInt(id),
          value: initialPrice,
          updateDate: new Date(),
        },
        { transaction }
      );
    }

    // Update sizes if provided
    if (sizes !== undefined) {
      // Delete existing sizes
      await ProductSize.destroy({
        where: { idProduct: id },
        transaction,
      });

      // Add new sizes if array is provided and not empty
      if (Array.isArray(sizes) && sizes.length > 0) {
        for (const sizeId of sizes) {
          await ProductSize.create(
            {
              idProduct: parseInt(id),
              idSize: sizeId,
            },
            { transaction }
          );
        }
      }
    }

    if (images !== undefined) {
      // Eliminar todas las imágenes existentes del producto
      await Image.destroy({
        where: { idProduct: parseInt(id) },
        transaction,
      });

      // Agregar las nuevas imágenes si se proporcionaron
      if (Array.isArray(images) && images.length > 0) {
        for (const imageData of images) {
          await Image.create(
            {
              idProduct: parseInt(id),
              url: imageData.url,
              description: imageData.description || "",
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    // Get the complete updated product with all associations
    const completeProduct = await Product.findByPk(id, {
      include: [
        {
          model: Price,
          as: "prices",
          order: [["updateDate", "DESC"]],
          limit: 1,
        },
        {
          model: Image,
          as: "images",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Size,
          as: "sizes",
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: completeProduct,
    });
  } catch (error: any) {
    // Check if transaction has already been committed
    // @ts-ignore: Property 'finished' does not exist on type 'Transaction' but it exists at runtime
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error("Error in updateProduct:", error);

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

    // Delete associated sizes first
    await ProductSize.destroy({
      where: { idProduct: id },
      transaction,
    });

    // Delete associated prices and images next
    await Price.destroy({
      where: { idProduct: id },
      transaction,
    });

    await Image.destroy({
      where: { idProduct: id },
      transaction,
    });

    // Finally delete the product
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
        {
          model: Price,
          as: "prices",
          order: [["updateDate", "DESC"]],
        },
        {
          model: Image,
          as: "images",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Size,
          as: "sizes",
          through: { attributes: [] }, // Exclude the join table attributes
        },
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
    const { search } = req.query;

    let whereClause: WhereOptions | null = null;
    if (typeof search === "string") {
      const trimmedSearch = search.trim();
      if (trimmedSearch.length > 0) {
        const escapedSearch = trimmedSearch.replace(/[%_\\]/g, "\\$&");
        const likePattern = `%${escapedSearch}%`;

        whereClause = {
          [Op.or]: [
            { name: { [Op.like]: likePattern } },
            { description: { [Op.like]: likePattern } },
          ],
        };
      }
    }

    const findOptions: FindOptions = {
      include: [
        {
          model: Price,
          as: "prices",
          order: [["updateDate", "DESC"]],
          limit: 1,
        },
        {
          model: Image,
          as: "images",
          limit: 2,
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Size,
          as: "sizes",
          through: { attributes: [] },
        },
      ],
    };

    if (whereClause) {
      findOptions.where = whereClause;
  // Ensure the escape character is respected in LIKE queries
  (findOptions as any).escape = "\\";
    }

    const products = await Product.findAll(findOptions);

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
