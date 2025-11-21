import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Text } from '@chakra-ui/react';
import { login } from '../../redux/reducers/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';

import './style.scss';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    if (username && password) {
      dispatch(login({ username, password })).then((unwrapResult) => {
        if (unwrapResult.meta.requestStatus === 'fulfilled') {
          navigate('/map');
        }
      });
    } else {
      alert('Please enter username and password');
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Container maxW="md" padding={10}>
      <form>
        <div className="card">
          <div className="card-body">
            <h2>Login</h2>
            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label">Username</label>
              <input type="text" onChange={handleUsernameChange} className="form-control" />
            </div>
            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label">Password</label>
              <input onChange={handlePasswordChange} type="password" className="form-control" />
            </div>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <button type="button" onClick={handleLogin} className="btn btn-primary btn-block mb-4">
              Sign in
            </button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default Login;
