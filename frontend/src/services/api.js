const API_BASE = import.meta.env.VITE_API_BASE || '';

/**
 * Web-Select helper for dynamic cascading dropdowns & result search
 * 100% compatible with https://resapi.eco.du.ac.bd/api/web-select
 */
export async function fetchWebSelect(body) {
  try {
    const response = await fetch(`${API_BASE}/api/web-select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error in web-select:', error);
    return null;
  }
}

/**
 * Check student examination result
 * @param {string} roll 
 * @param {string} registration 
 * @param {Object} extra - { pid, yid, eid }
 * @returns {Promise<{ success: boolean, result?: Object, pdfUrl?: string, message?: string }>}
 */
export async function checkResult(roll, registration, extra = {}) {
  try {
    // Try web-select get_result first
    const webSelectData = await fetchWebSelect({
      action: 'get_result',
      pid: extra.pid || '1',
      yid: extra.yid || '2',
      eid: extra.eid || 105,
      roll: String(roll).trim(),
      reg: String(registration).trim()
    });

    if (webSelectData && webSelectData.result) {
      return {
        success: true,
        result: webSelectData.result,
        courses: webSelectData.courses || [],
        pdfUrl: webSelectData.pdfUrl
      };
    }

    // Fallback to /api/result
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
 * Client-Side PDF Download via Blob
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
    window.open(getPdfUrl(pdfPath, true), '_blank');
    return false;
  }
}
