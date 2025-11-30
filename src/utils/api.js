// LocalStorage-only API
// All data is stored in browser's localStorage

/* =========================
 *  Exhibitions API
 * ========================= */

export async function fetchExhibitions() {
  try {
    const allExhibitions = JSON.parse(
      localStorage.getItem("exhibitions") || "[]"
    );
    return allExhibitions;
  } catch (err) {
    console.error("Error reading exhibitions from localStorage:", err);
    return [];
  }
}

export async function registerInterestApi(exhibitionId, payload = {}) {
  try {
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

    throw new Error("Exhibition not found");
  } catch (err) {
    console.error("registerInterestApi error:", err);
    throw err;
  }
}

/* =========================
 *  Products API
 * ========================= */

// GET all products from localStorage
export async function fetchProducts() {
  try {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    return allProducts;
  } catch (err) {
    console.error("Error reading products from localStorage:", err);
    return [];
  }
}

// CREATE a new product
export async function createProduct(payload) {
  try {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const newProduct = {
      id: Date.now().toString(),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    allProducts.push(newProduct);
    localStorage.setItem("products", JSON.stringify(allProducts));
    return newProduct;
  } catch (err) {
    console.error("Error creating product:", err);
    throw err;
  }
}

// DELETE a product by id
export async function deleteProduct(productId) {
  try {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const filtered = allProducts.filter((p) => p.id !== productId && p._id !== productId);
    localStorage.setItem("products", JSON.stringify(filtered));
    return { success: true, message: "Product deleted successfully" };
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
}

// UPDATE a product
export async function updateProduct(productId, payload) {
  try {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const idx = allProducts.findIndex((p) => p.id === productId || p._id === productId);
    
    if (idx !== -1) {
      allProducts[idx] = { ...allProducts[idx], ...payload, updatedAt: new Date().toISOString() };
      localStorage.setItem("products", JSON.stringify(allProducts));
      return allProducts[idx];
    }
    
    throw new Error("Product not found");
  } catch (err) {
    console.error("Error updating product:", err);
    throw err;
  }
}

/* =========================
 *  Default export (optional)
 * ========================= */

export default {
  fetchExhibitions,
  registerInterestApi,
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
