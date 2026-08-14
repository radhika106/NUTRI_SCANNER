import uploadImage from "../services/imageUploadService.js";
import validateImage from "../services/imageValidationService.js";
import extractText from "../services/ocrService.js";
import extractStructuredData from "../services/geminiStructuredExtractionService.js";
import cleanOCRText from "../utils/textCleaner.js";
import extractIngredientsOnly from "../services/ingredientAnalysisService.js";
import validateOCRText from "../services/ocrValidationService.js";

const scanImage = async (req, res) => {
  try {
    // 1. Upload
    const imageData = await uploadImage(req.file);

    // 2. Validate
    const validation = await validateImage(imageData.imagePath);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        stage: "image-validation",
        message: validation.reason,
      });
    }

    // 3. OCR
    const extractedText = await extractText(validation.correctedImagePath);
    console.log("OCR TEXT:");
    console.log(extractedText);

    // OCR readability validation
    const ocrCheck = validateOCRText(extractedText);

    if (!ocrCheck.valid) {
      return res.status(400).json({
        success: false,
        stage: "ocr-validation",
        message: ocrCheck.reason,
      });
    }

    //4. clean the extracted text
    const cleanedText = cleanOCRText(extractedText);
    console.log("CLEANED TEXT:");
    console.log(cleanedText);

    // 5. Gemini structure Data
    const structuredData = await extractStructuredData(cleanedText);

    // 6. Extract Ingredients Only
    //const ingredients = extractIngredientsOnly(structuredData);

    //image url
    //const imageUrl = `http://localhost:5000/uploads/${imageData.imageName}`;
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${imageData.imageName}`;

    // 7. Clean Response
    res.status(200).json({
      success: true,

      product: {
        image: imageUrl,
        name: structuredData.product?.name || "Scanned Product",
        brand: structuredData.product?.brand || "NutriScan",
        category: structuredData.product?.category || "Food Product",
      },

      score: structuredData.score || 0,
      rating: structuredData.rating || "Analysis Unavailable",
      explanation:
        structuredData.explanation ||
        "We could not generate a detailed analysis for this product.",

      factors: structuredData.factors || [],
      good: structuredData.good || [],
      watchOut: structuredData.watchOut || [],
      ingredients: structuredData.ingredients || [],
      nutrition: structuredData.nutrition || [],

      recommendation: structuredData.recommendation || {
        title: "Try scanning again",
        detail:
          "A clearer image may provide a more accurate nutritional analysis.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message?.includes("503")
        ? "AI service is temporarily busy. Please try again in a few seconds."
        : error.message || "Something went wrong while analyzing the image.",
    });
  }
};

export default { scanImage };
