document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const path = window.location.pathname;

  if (path === '/login.html' || path === '/login') {
    if (token) {
      window.location.href = '/';
      return;
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });

          const data = await response.json();

          if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
          } else {
            errorMsg.textContent = data.message || 'Login failed';
            errorMsg.classList.remove('hidden');
          }
        } catch (error) {
          errorMsg.textContent = 'Network error occurred';
          errorMsg.classList.remove('hidden');
        }
      });
    }
  } else {
    // Protected dashboard
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
      });
    }

    const apiCall = async (url, options = {}) => {
      const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      };
      
      if (options.body && options.body instanceof FormData) {
        delete headers['Content-Type'];
      } else if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login.html';
        }
        let errMsg = 'API Error';
        try {
          const errData = await res.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }
      return res.json();
    };

    const loadInstances = async () => {
      const listEl = document.getElementById('instances-list');
      if (!listEl) return;
      listEl.innerHTML = '<div class="text-gray-500 text-sm">Loading instances...</div>';
      try {
        const data = await apiCall('/api/containers');
        listEl.innerHTML = '';
        if (!data || data.length === 0) {
          listEl.innerHTML = '<div class="text-gray-500 text-sm">No instances found.</div>';
          return;
        }
        data.forEach(inst => {
          const div = document.createElement('div');
          div.className = 'p-4 border rounded bg-gray-50 flex justify-between items-center';
          div.innerHTML = `
            <div>
              <div class="font-bold">${inst.name}</div>
              <div class="text-xs text-gray-600">ID: ${inst.dockerId ? inst.dockerId.substring(0,12) : 'N/A'} | Image: ${inst.image}</div>
              <div class="text-sm mt-1">Status: <span class="${inst.status === 'running' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}">${inst.status}</span></div>
            </div>
            <div class="flex gap-2">
              <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm btn-start" data-id="${inst.id}">Start</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm btn-stop" data-id="${inst.id}">Stop</button>
            </div>
          `;
          listEl.appendChild(div);
        });

        document.querySelectorAll('.btn-start').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            await apiCall(`/api/containers/${id}/start`, { method: 'POST' });
            loadInstances();
          });
        });
        document.querySelectorAll('.btn-stop').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            await apiCall(`/api/containers/${id}/stop`, { method: 'POST' });
            loadInstances();
          });
        });
      } catch (err) {
        listEl.innerHTML = \`<div class="text-red-500 text-sm">Error: \${err.message}</div>\`;
      }
    };

    const loadBuckets = async () => {
      const listEl = document.getElementById('buckets-list');
      if (!listEl) return;
      listEl.innerHTML = '<div class="text-gray-500 text-sm">Loading buckets...</div>';
      try {
        const data = await apiCall('/api/storage/buckets');
        listEl.innerHTML = '';
        if (!data || data.length === 0) {
          listEl.innerHTML = '<div class="text-gray-500 text-sm">No buckets found.</div>';
          return;
        }
        data.forEach(bucket => {
          const div = document.createElement('div');
          div.className = 'p-4 border rounded bg-gray-50 mb-4';
          
          let objectsHtml = '';
          if (bucket.objects && bucket.objects.length > 0) {
            objectsHtml = bucket.objects.map(obj => \`
              <div class="flex justify-between items-center bg-white p-2 border rounded">
                <div class="text-sm truncate mr-2" title="\${obj.key}">📄 \${obj.key}</div>
                <div class="flex gap-2">
                  <a href="/api/storage/buckets/\${bucket.name}/objects/\${obj.key}" target="_blank" class="text-blue-500 hover:underline text-xs">Download</a>
                </div>
              </div>
            \`).join('');
          } else {
            objectsHtml = '<div class="text-xs text-gray-500">No objects.</div>';
          }

          div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
              <div class="font-bold text-lg">🪣 ${bucket.name}</div>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs btn-delete-bucket" data-id="${bucket.id}">Delete Bucket</button>
            </div>
            <div class="mb-2 flex gap-2">
              <input type="file" id="file-${bucket.name}" class="text-sm">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs btn-upload" data-bucket="${bucket.name}">Upload</button>
            </div>
            <div class="text-sm font-semibold mb-1">Objects:</div>
            <div class="pl-4 space-y-1 objects-container">
              \${objectsHtml}
            </div>
          `;
          listEl.appendChild(div);
        });

        document.querySelectorAll('.btn-delete-bucket').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            if(!confirm('Are you sure?')) return;
            const id = e.target.getAttribute('data-id');
            try {
              await apiCall(`/api/storage/buckets/${id}`, { method: 'DELETE' });
              loadBuckets();
            } catch (err) {
              alert('Error deleting bucket: ' + err.message);
            }
          });
        });
        
        document.querySelectorAll('.btn-upload').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const bucketName = e.target.getAttribute('data-bucket');
            const fileInput = document.getElementById(`file-${bucketName}`);
            if (!fileInput.files.length) return alert('Select a file first');
            
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('isPublic', true);
            
            try {
              e.target.disabled = true;
              e.target.textContent = 'Uploading...';
              await apiCall(`/api/storage/buckets/${bucketName}/objects`, {
                method: 'POST',
                body: formData
              });
              loadBuckets();
            } catch (err) {
              alert('Upload failed: ' + err.message);
            } finally {
              e.target.disabled = false;
              e.target.textContent = 'Upload';
              fileInput.value = '';
            }
          });
        });

      } catch (err) {
        listEl.innerHTML = \`<div class="text-red-500 text-sm">Error: \${err.message}</div>\`;
      }
    };

    if (document.getElementById('instances-list')) {
      loadInstances();
      loadBuckets();

      document.getElementById('refresh-instances').addEventListener('click', loadInstances);
      document.getElementById('refresh-buckets').addEventListener('click', loadBuckets);

      document.getElementById('create-bucket-btn').addEventListener('click', async () => {
        const name = document.getElementById('new-bucket-name').value.trim();
        if (!name) return alert('Enter a bucket name');
        try {
          await apiCall('/api/storage/buckets', {
            method: 'POST',
            body: JSON.stringify({ name })
          });
          document.getElementById('new-bucket-name').value = '';
          loadBuckets();
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }
  }
});