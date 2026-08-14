const API_BASE = import.meta.env.VITE_API_URL;

export async function analyzeProduct(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "Unable to analyze this product.");
  }

  return response.json();
}
