import { Link } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

interface LOGO {
    path?: string
    width?: string;
}

const Logo = ({ path = '/', width = '150px' }: LOGO) => {
  return (
    <Link component={RouterLink} to={path}>
        <img alt='logo' src='/logo-trans.png' style={{ width: width }} />
    </Link>
  )
}

export default Logo