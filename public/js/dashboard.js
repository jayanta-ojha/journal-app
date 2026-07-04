/**
 * Journal Application — Core Dashboard Orchestrator
 * High-performance UI rendering, state management, and API lifecycle synchronization.
 */

const API_URL = 'http://3.6.65.66:3000'; // Retained verbatim from original logic[cite: 2]
const token = localStorage.getItem('token'); // Retained verbatim from original logic[cite: 2]

let editingJournalId = null; // Retained verbatim from original logic[cite: 2]
let cachedJournals = []; // Holds state client-side to allow high-speed search filters

// Security Check: Guard page initialization against missing auth tokens
if (!token) {
  window.location.href = '/'; // Retained verbatim from original logic[cite: 2]
}

/**
 * Global Initialization Sequence
 */
document.addEventListener('DOMContentLoaded', () => {
  // Setup User Information Displays
  initUserProfile();

  // Load Application State from Remote Origin
  loadJournals();

  // Setup Event Handlers for Real-time Search Processing
  const searchBox = document.getElementById('search-box');
  if (searchBox) {
    searchBox.addEventListener('input', handleSearch);
  }

  // Setup Live Local Form Image Preview Engine
  initImagePreviewEngine();
});

/**
 * Decode and initialize user metadata from JWT Payload safely
 */
function initUserProfile() {
  try {
    if (!token) return;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const email = payload.email || 'User';
    
    // Set explicit elegant welcome title text
    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading) {
      welcomeHeading.textContent = `Welcome back, ${email.split('@')[0]}`;
    }

    // Assign initials to custom profile avatar element
    const avatar = document.getElementById('user-avatar');
    if (avatar) {
      avatar.textContent = email.charAt(0).toUpperCase();
    }
  } catch (e) {
    console.error('Failed to parse JWT payload context safely:', e);
  }
}

/**
 * Standard Application Session Cleanup Module
 */
function logout() {
  localStorage.removeItem('token'); // Retained verbatim from original logic[cite: 2]
  window.location.href = '/'; // Retained verbatim from original logic[cite: 2]
}

/**
 * Premium Toast Notifications System Manager
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Select proper icon variants dynamically depending on alert payload types
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  // Smoothly expire element from active DOM stack tree lifecycle
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// Backward compatibility bridge linking legacy call commands with new notification layout structure
function showMessage(text, type) {
  showToast(text, type === 'error' ? 'error' : 'success');
}

/**
 * Fetch Remote Storage Journal Aggregations & Populate Metrics UI
 */
async function loadJournals() {
  const container = document.getElementById('journals-list');
  
  // Render high-fidelity premium structural skeleton screens while payload resolves
  if (container) {
    container.innerHTML = `
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    `;
  }

  try {
    const res = await fetch(`${API_URL}/journals`, {
      headers: { 'Authorization': `Bearer ${token}` } // Retained verbatim from original logic[cite: 2]
    });

    if (res.status === 401) {
      logout(); // Retained verbatim from original logic[cite: 2]
      return;
    }

    const journals = await res.json(); // Retained verbatim from original logic[cite: 2]
    cachedJournals = journals; // Sync local client-side memory cache for fluid search indexing

    // Reorder data configurations chronologically: Newest First[cite: 2]
    journals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Retained verbatim[cite: 2]

    // Render Metrics Stats Section Panels
    updateStatisticsWidgets(journals);

    // Push fully localized layouts out to standard view pipelines
    renderJournalsGrid(journals);

  } catch (err) {
    showToast('Failed to retrieve active journals records pipeline.', 'error');
  }
}

/**
 * Parse data structural payloads to populate the Dashboard Overview Cards
 */
function updateStatisticsWidgets(journals) {
  const totalCount = journals.length;
  const validImagesCount = journals.filter(j => j.imageUrl || j.imageKey).length;
  
  let dynamicLastUpdatedStr = 'Never';
  if (totalCount > 0) {
    const timestamps = journals.map(j => new Date(j.createdAt || Date.now()));
    const highestDate = new Date(Math.max(...timestamps));
    dynamicLastUpdatedStr = highestDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  document.getElementById('stat-total').textContent = totalCount;
  document.getElementById('stat-images').textContent = validImagesCount;
  document.getElementById('stat-updated').textContent = dynamicLastUpdatedStr;
}

/**
 * Process Layout Conversions for Cards Collections Elements Maps
 */
function renderJournalsGrid(journals) {
  const container = document.getElementById('journals-list');
  if (!container) return;

  if (journals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <h3 class="empty-title">No entries found</h3>
        <p class="empty-desc">Your creative canvas workspace starts right here. Log your notes or architecture changes today!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = journals.map(j => {
    // Gracefully parse images keys paths cleanly mapping remote origins
    const imageSourcePath = j.imageUrl ? j.imageUrl : (j.imageKey ? `${API_URL}/uploads/${j.imageKey}` : null);
    const readableDateStamp = new Date(j.createdAt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Explicitly pass data structures via safely encoded string payloads to prevent breaks
    const stringifiedPayload = encodeURIComponent(JSON.stringify(j));

    return `
      <div class="journal-card">
        ${imageSourcePath ? `
          <div class="card-img-wrapper">
            <img src="${imageSourcePath}" alt="Journal layout visual image reference asset" loading="lazy" onerror="this.parentElement.style.display='none'" />
          </div>
        ` : ''}
        <div class="card-content">
          <div class="card-meta">${readableDateStamp}</div>
          <h3 class="card-title">${escapeHtml(j.title)}</h3>
          <p class="card-body-text">${escapeHtml(j.content)}</p>
          <div class="card-actions">
            <button class="btn-secondary" onclick="openModalWithPayload('${stringifiedPayload}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
            <button class="btn-danger" onclick="deleteJournal('${j.journalId}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Filter Cards Client-side in Real-Time
 */
function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  if (!query) {
    renderJournalsGrid(cachedJournals);
    return;
  }

  const filtered = cachedJournals.filter(j => 
    j.title.toLowerCase().includes(query) || 
    j.content.toLowerCase().includes(query)
  );
  renderJournalsGrid(filtered);
}

/**
 * Modal Visibility Orchestrations
 */
function openModal() {
  editingJournalId = null; // Retained verbatim from original logic[cite: 2]
  document.getElementById('modal-title').textContent = 'New Journal'; // Retained verbatim from original logic[cite: 2]
  document.getElementById('journal-title').value = ''; // Retained verbatim from original logic[cite: 2]
  document.getElementById('journal-content').value = ''; // Retained verbatim from original logic[cite: 2]
  document.getElementById('journal-image').value = ''; // Retained verbatim from original logic[cite: 2]
  
  resetImagePreviewElement();

  const modal = document.getElementById('modal');
  modal.classList.add('active');
  modal.focus();
}

// Decoding safe payload bridge initialization routing for standard card edits action buttons
function openModalWithPayload(encodedStr) {
  const journalObj = JSON.parse(decodeURIComponent(encodedStr));
  
  editingJournalId = journalObj.journalId; // Retained verbatim from original logic[cite: 2]
  document.getElementById('modal-title').textContent = 'Edit Journal'; // Retained verbatim from original logic[cite: 2]
  document.getElementById('journal-title').value = journalObj.title; // Retained verbatim from original logic[cite: 2]
  document.getElementById('journal-content').value = journalObj.content; // Retained verbatim from original logic[cite: 2]
  document.getElementById('journal-image').value = ''; // Retained verbatim from original logic[cite: 2]

  resetImagePreviewElement();

  // Handle previewing legacy images if currently stored in data payload properties
  const existingImgSrc = journalObj.imageUrl ? journalObj.imageUrl : (journalObj.imageKey ? `${API_URL}/uploads/${journalObj.imageKey}` : null);
  if (existingImgSrc) {
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('image-upload-preview');
    if (previewContainer && previewImg) {
      previewImg.src = existingImgSrc;
      previewContainer.classList.remove('hidden');
    }
  }

  const modal = document.getElementById('modal');
  modal.classList.add('active');
  modal.focus();
}

function closeModal() {
  document.getElementById('modal').classList.remove('active'); // Retained verbatim from original logic[cite: 2]
}

/**
 * Modal File Selector Sandboxes Setup
 */
function initImagePreviewEngine() {
  const fileInput = document.getElementById('journal-image');
  const previewContainer = document.getElementById('preview-container');
  const previewImg = document.getElementById('image-upload-preview');
  const removeBtn = document.getElementById('btn-remove-preview');

  if (!fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImg.src = event.target.result;
        previewContainer.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetImagePreviewElement();
    });
  }
}

function resetImagePreviewElement() {
  const fileInput = document.getElementById('journal-image');
  const previewContainer = document.getElementById('preview-container');
  const previewImg = document.getElementById('image-upload-preview');
  
  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = '#';
  if (previewContainer) previewContainer.classList.add('hidden');
}

/**
 * Persist Record Content via API Orchestrations (Saves Changes / Adds Records)
 */
async function saveJournal() {
  const title = document.getElementById('journal-title').value.trim(); // Retained verbatim from original logic[cite: 2]
  const content = document.getElementById('journal-content').value.trim(); // Retained verbatim from original logic[cite: 2]
  const imageFile = document.getElementById('journal-image').files[0]; // Retained verbatim from original logic[cite: 2]

  if (!title || !content) {
    return showToast('Title and entry content are fields strictly required.', 'warning');
  }

  // Update button interface elements real-time to signal execution progress cleanly
  const saveBtn = document.getElementById('btn-save-journal');
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner"></span> Syncing...`;

  try {
    let imageUrlKey = null;

    // Direct Upload Processing System Module[cite: 2]
    if (imageFile) {
      const formData = new FormData(); // Retained verbatim[cite: 2]
      formData.append('image', imageFile); // Retained verbatim[cite: 2]

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST', // Retained verbatim[cite: 2]
        headers: { 'Authorization': `Bearer ${token}` }, // Retained verbatim[cite: 2]
        body: formData // Retained verbatim[cite: 2]
      });

      const uploadData = await uploadRes.json(); // Retained verbatim[cite: 2]
      if (!uploadRes.ok) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
        return showToast('Remote asset upload failed. Process halted.', 'error');
      }
      imageUrlKey = uploadData.key; // Retained verbatim[cite: 2]
    }

    const body = { title, content }; // Retained verbatim[cite: 2]
    if (imageUrlKey) body.imageKey = imageUrlKey; // Retained verbatim from original logic[cite: 2]

    const url = editingJournalId
      ? `${API_URL}/journals/${editingJournalId}` // Retained verbatim[cite: 2]
      : `${API_URL}/journals`; // Retained verbatim[cite: 2]

    const method = editingJournalId ? 'PUT' : 'POST'; // Retained verbatim[cite: 2]

    const res = await fetch(url, {
      method, // Retained verbatim[cite: 2]
      headers: {
        'Authorization': `Bearer ${token}`, // Retained verbatim[cite: 2]
        'Content-Type': 'application/json' // Retained verbatim[cite: 2]
      },
      body: JSON.stringify(body) // Retained verbatim[cite: 2]
    });

    if (!res.ok) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnText;
      return showToast('Failed to accurately synchronize journal record updates.', 'error');
    }

    closeModal(); // Retained verbatim[cite: 2]
    showToast(editingJournalId ? 'Journal entry updated successfully!' : 'New journal entry pinned to dashboard!', 'success');
    loadJournals(); // Retained verbatim[cite: 2]

  } catch (err) {
    showToast('Something unexpected went wrong inside storage drivers operations.', 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnText;
    }
  }
}

/**
 * Remove Journal Entry Lifecycle Action
 */
async function deleteJournal(journalId) {
  // Retaining custom native confirm prompts safely before execution routines[cite: 2]
  if (!confirm('Are you completely sure you want to delete this journal entry permanently?')) return;

  try {
    const res = await fetch(`${API_URL}/journals/${journalId}`, {
      method: 'DELETE', // Retained verbatim[cite: 2]
      headers: { 'Authorization': `Bearer ${token}` } // Retained verbatim[cite: 2]
    });

    if (!res.ok) {
      return showToast('Failed to drop dynamic asset record from storage pools.', 'error');
    }

    showToast('Journal entry dropped successfully.', 'success');
    loadJournals(); // Retained verbatim from original logic[cite: 2]

  } catch (err) {
    showToast('Something went wrong handling structural deletions processes.', 'error');
  }
}

/**
 * Safe Encoding Transformer helper preventing XSS Injection vectors
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text)); // Retained verbatim from original logic[cite: 2]
  return div.innerHTML;
}