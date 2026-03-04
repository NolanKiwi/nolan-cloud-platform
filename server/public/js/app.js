document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const path = window.location.pathname;

  // Authentication check
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
    // Protected routes (dashboard)
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

    // Example of using the token to fetch data
    fetch('/api-docs')
      .then(res => {
        document.getElementById('api-status').textContent = 'API is reachable. Check console for details.';
      })
      .catch(err => {
        document.getElementById('api-status').textContent = 'Error connecting to API.';
      });
  }
});