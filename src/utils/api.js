// Base API URL: uses VITE_API_URL if set, otherwise localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================
 *  Exhibitions API
 * ========================= */

export async function fetchExhibitions() {
  try {
    const res = await fetch(`${API_BASE}/api/exhibitions`);
    if (!res.ok) throw new Error("Failed to fetch exhibitions");
    return await res.json();
  } catch (err) {
    console.warn("fetchExhibitions error, falling back to localStorage", err);
    const allExhibitions = JSON.parse(
      localStorage.getItem("exhibitions") || "[]"
    );
    return allExhibitions;
  }
}

export async function registerInterestApi(exhibitionId, payload = {}) {
  try {
    const res = await fetch(
      `${API_BASE}/api/exhibitions/${exhibitionId}/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || "Failed to register interest");
    }

    return await res.json();
  } catch (err) {
    console.warn("registerInterestApi failed, falling back to local update", err);

    // Fallback: update localStorage exhibitions if possible
    const allExhibitions = JSON.parse(
      localStorage.getItem("exhibitions") || "[]"
    );
    const idx = allExhibitions.findIndex(
      (e) => e.id === exhibitionId || e._id === exhibitionId
    );

    if (idx !== -1) {
      allExhibitions[idx].visitors = (allExhibitions[idx].visitors || 0) + 1;
      allExhibitions[idx].interested = allExhibitions[idx].interested || [];
      allExhibitions[idx].interested.push({
        ...payload,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("exhibitions", JSON.stringify(allExhibitions));
      return { success: true, visitors: allExhibitions[idx].visitors };
    }

    throw err;
  }
}

/* =========================
 *  Products API
 * ========================= */

// GET all products from backend (fallback to localStorage if backend fails)
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Failed to fetch products: ${res.status} ${body}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("fetchProducts error, falling back to localStorage", err);
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    return allProducts;
  }
}

// CREATE a new product
// payload MUST be: { name, price, description, image }
export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to create product: ${res.status} ${body}`);
  }

  return await res.json();
}

// DELETE a product by id
export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE}/api/products/${productId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to delete product: ${res.status} ${body}`);
  }

  return await res.json();
}

export async function updateProduct(productId, payload) {
  const res = await fetch(`${API_BASE}/api/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to update product: ${res.status} ${body}`);
  }
  return await res.json();
}

/* =========================
 *  Default export (optional)
 * ========================= */

export default {
  API_BASE,
  fetchExhibitions,
  registerInterestApi,
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
