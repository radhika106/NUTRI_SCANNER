export async function analyzeProduct(image: Blob): Promise<unknown> {
  const formData = new FormData();
  formData.append("image", image, "nutriscan-capture.jpg");

  const response = await fetch("/api/analyze-product", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Unable to analyze this product.");
  }

  return response.json();
}
