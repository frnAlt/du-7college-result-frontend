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

/**
 * Robust Client-Side PDF Download via Blob
 * Guarantees cross-browser file download without navigation errors
 */
export async function downloadPdfBlob(pdfPath, filename = 'Student_Result.pdf') {
  try {
    const url = getPdfUrl(pdfPath, true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    return true;
  } catch (error) {
    console.error('Blob download failed, falling back to direct window.open:', error);
    window.open(getPdfUrl(pdfPath, true), '_blank');
    return false;
  }
}
