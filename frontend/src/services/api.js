const API_BASE = import.meta.env.VITE_API_BASE || '';

/**
 * Check student examination result
 * @param {string} roll 
 * @param {string} registration 
 * @returns {Promise<{ success: boolean, result?: Object, pdfUrl?: string, message?: string }>}
 */
export async function checkResult(roll, registration) {
  try {
    const response = await fetch(`${API_BASE}/api/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roll: String(roll).trim(),
        registration: String(registration).trim()
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network connection failed. Please check your internet and try again.'
    };
  }
}

/**
 * Get direct URL for PDF document preview or download
 */
export function getPdfUrl(path, isDownload = false) {
  if (!path) return '';
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  return isDownload ? `${url}?download=1` : url;
}
