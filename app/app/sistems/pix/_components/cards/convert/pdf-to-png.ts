"use server";

import { PDFDocument } from "pdf-lib";
import { fromPath } from "pdf2pic";
import jsQR from "jsqr";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "temp");
const INPUT_PDF_PATH = path.join(OUTPUT_DIR, "input.pdf");
const OUTPUT_IMAGE_PATH = path.join(OUTPUT_DIR, "output.png");

export const convertPdfToPng = async (pdfPath: string): Promise<string> => {
  const converter = fromPath(pdfPath, {
    density: 300,
    format: "png",
    quality: 100,
    width: 800,
    height: 1200,
    savePath: OUTPUT_DIR,
    saveFilename: "TransformedToPng",
  });

  const pageToConvertAsImage = 1;

  const result = await converter(pageToConvertAsImage);
  console.log("PDF convertido para PNG:", result.path ?? "undefined path");
  return result.path ?? "";
};

export const extractQRCode = async (
  imagePath: string
): Promise<string | null> => {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
  if (qrCode) {
    console.log("QR Code encontrado:", qrCode.data);
    return qrCode.data;
  } else {
    console.log("Nenhum QR Code encontrado na imagem.");
    return null;
  }
};

export const processPdfWithQRCode = async (
  pdfFilePath: string
): Promise<void> => {
  try {
    // Passo 1: Converter PDF para PNG
    const pngPath = await convertPdfToPng(pdfFilePath);

    // Passo 2: Extrair QR code do PNG
    const qrCodeData = await extractQRCode(pngPath);

    if (qrCodeData) {
      console.log("QR Code extraído com sucesso:", qrCodeData);
    } else {
      console.log("Falha ao extrair o QR Code.");
    }
  } catch (error) {
    console.error("Erro no processamento do PDF:", error);
  }
};

processPdfWithQRCode(INPUT_PDF_PATH);
