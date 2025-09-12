import { Request, Response } from "express";
import Size from "../models/size-model";
import ProductSize from "../models/size-product-model";

export const createSize = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sizeDesc, gender } = req.body;

    const newSize = await Size.create({
      sizeDesc,
      gender
    });

    return res.status(201).json({
      message: "Size created successfully",
      size: newSize
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating size",
      error: error.message
    });
  }
};

export const getAllSizes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sizes = await Size.findAll();

    return res.status(200).json({
      sizes
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching sizes",
      error: error.message
    });
  }
};

export const addSizeToProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idProduct, idSize } = req.params;

    // Esta función requeriría el modelo ProductSize
    // Asumiendo que tienes el modelo ProductSize implementado
    const productSize = await ProductSize.create({
      idProduct: parseInt(idProduct),
      idSize: parseInt(idSize)
    });

    return res.status(201).json({
      message: "Size added to product successfully",
      productSize
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error adding size to product",
      error: error.message
    });
  }
};