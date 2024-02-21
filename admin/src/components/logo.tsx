import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Logo = () => {
  return (
    <Link component={RouterLink} to='/'>
        <img style={{ width: '150px' }} alt='logo' src='/logo-trans.png' />
    </Link>
  )
}

export default Logo