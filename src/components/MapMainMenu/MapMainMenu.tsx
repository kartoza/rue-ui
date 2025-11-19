import { useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/authSlice';
import type { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

export default function Protected() {
  // const user = useSelector((state: RootState) => state.auth.user); // Uncomment if needed
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
