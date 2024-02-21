import { m } from 'framer-motion';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { ReactNode } from 'react';
import ForbiddenIllustration from '../assets/illustrations/forbidden-illustration';
import { useAuthContext } from './auth-context';

// ----------------------------------------------------------------------

interface RBG {
  hasContent: boolean;
  roles: string[];
  children: ReactNode;
  sx?: any;
}

export default function RoleBasedGuard({ hasContent, roles, children, sx }: RBG) {
  // Logic here to get current user role
  const { user } = useAuthContext();

  // const currentRole = 'user';
  const currentRole = user?.role; // admin;

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return hasContent ? (
      <Container sx={{ textAlign: 'center', ...sx }}>
        <m.div>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </m.div>

        <m.div>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
