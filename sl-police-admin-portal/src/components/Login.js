import { api } from '../services/api.js';
const { useState } = React;

export default function Login({ onLoginSuccess, isLiveMode, onToggleLiveMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.login(username, password);
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    React.createElement('div', { className: 'login-container' },
      React.createElement('div', { className: 'login-card glass-panel' },
        
        // Brand Logo Icon
        React.createElement('div', { className: 'login-logo' },
          React.createElement('i', { className: 'fa-solid fa-shield-halved' })
        ),
        
        React.createElement('h1', { className: 'login-title' }, 'SL Traffic Police'),
        React.createElement('p', { className: 'login-subtitle' }, 'Nationwide Traffic Fine Monitoring Portal'),
        
        // Connection Mode Status Card
        React.createElement('div', { className: 'toggle-container', style: { justifyContent: 'center', marginBottom: '2rem' } },
          React.createElement('span', { className: 'toggle-label' }, isLiveMode ? 'Live Gateway API' : 'Mock Simulator Mode'),
          React.createElement('label', { className: 'toggle-switch' },
            React.createElement('input', {
              type: 'checkbox',
              checked: isLiveMode,
              onChange: (e) => onToggleLiveMode(e.target.checked)
            }),
            React.createElement('span', { className: 'toggle-slider' })
          )
        ),

        // Error message alert
        error && React.createElement('div', { 
          style: { 
            padding: '0.75rem', 
            borderRadius: '8px', 
            background: 'rgba(244, 63, 94, 0.12)', 
            border: '1px solid rgba(244, 63, 94, 0.25)', 
            color: '#f43f5e',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          } 
        }, 
          React.createElement('i', { className: 'fa-solid fa-triangle-exclamation', style: { marginRight: '0.5rem' } }),
          error
        ),

        // Login Form
        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement('div', { className: 'form-group', style: { textAlign: 'left' } },
            React.createElement('label', { className: 'form-label' }, 'Username / Badge Number'),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: isLiveMode ? 'Enter username' : 'admin',
              value: username,
              onChange: (e) => setUsername(e.target.value),
              required: true,
              disabled: loading
            })
          ),
          
          React.createElement('div', { className: 'form-group', style: { textAlign: 'left' } },
            React.createElement('label', { className: 'form-label' }, 'Security Password'),
            React.createElement('input', {
              type: 'password',
              className: 'form-control',
              placeholder: isLiveMode ? 'Enter password' : 'admin123',
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
              disabled: loading
            })
          ),
          
          React.createElement('button', {
            type: 'submit',
            className: 'btn btn-primary',
            style: { width: '100%', marginTop: '1rem', padding: '0.8rem' },
            disabled: loading
          }, 
            loading ? 'Authenticating...' : 'Sign In Securely'
          )
        ),

        // Credentials hint when in mock mode
        !isLiveMode && React.createElement('p', {
          style: {
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '1.5rem',
            fontStyle: 'italic'
          }
        }, 'Demo Credentials: username "admin" & password "admin123"')
      )
    )
  );
}
