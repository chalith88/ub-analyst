// Production-safe PDF processing wrapper
let pdfParse: any = null;
let canvasModule: any = null;

try {
  pdfParse = require('pdf-parse');
  canvasModule = require('canvas');
} catch (error) {
  console.warn('PDF/Canvas modules not available in production environment');
}

export const isPdfProcessingAvailable = () => {
  return pdfParse !== null && canvasModule !== null;
};

export const safePdfParse = async (buffer: Buffer) => {
  if (!isPdfProcessingAvailable()) {
    throw new Error('PDF processing not available in this environment');
  }
  return pdfParse(buffer);
};