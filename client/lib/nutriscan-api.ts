const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/";

export async function analyzeProduct(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error(
      "Server returned an invalid response. Check backend route or server logs.",
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to analyze this product.");
  }

  return data;
}
