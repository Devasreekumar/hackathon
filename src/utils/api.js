const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchExhibitions() {
  try {
    const res = await fetch(`${API_BASE}/api/exhibitions`);
    if (!res.ok) throw new Error('Failed to fetch exhibitions');
    return await res.json();
  } catch (err) {
    console.warn('fetchExhibitions error, falling back to localStorage', err);
    const allExhibitions = JSON.parse(localStorage.getItem('exhibitions') || '[]');
    return allExhibitions;
  }
}

export async function registerInterestApi(exhibitionId, payload = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/exhibitions/${exhibitionId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register interest');
    }
    return await res.json();
  } catch (err) {
    console.warn('registerInterestApi failed, falling back to local update', err);
    // fallback: update localStorage
    const allExhibitions = JSON.parse(localStorage.getItem('exhibitions') || '[]');
    const idx = allExhibitions.findIndex((e) => e.id === exhibitionId || e._id === exhibitionId);
    if (idx !== -1) {
      allExhibitions[idx].visitors = (allExhibitions[idx].visitors || 0) + 1;
      allExhibitions[idx].interested = allExhibitions[idx].interested || [];
      allExhibitions[idx].interested.push({ ...payload, timestamp: new Date().toISOString() });
      localStorage.setItem('exhibitions', JSON.stringify(allExhibitions));
      return { success: true, visitors: allExhibitions[idx].visitors };
    }
    throw err;
  }
}

export default { API_BASE, fetchExhibitions, registerInterestApi };
