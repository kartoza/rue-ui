import './style.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { Container } from 'react-bootstrap';
import { useState } from 'react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      dispatch(login({ username: username }));
      navigate('/map');
    } else {
      alert('Please enter username and password');
    }
  };

  return (
    <Container>
      <br />

      <form>
        <div className="card" style={{ width: '60vh', margin: '0 auto' }}>
          <div className="card-body">
            <h2>Login</h2>
            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label">Username</label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
              />
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
              />
            </div>

            <button type="button" onClick={handleLogin} className="btn btn-primary btn-block mb-4">
              Sign in
            </button>
          </div>
        </div>
      </form>
    </Container>
  );
}
