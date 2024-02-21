import { Divider, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminDrawer from "./admin-drawer";
import AdminTopBar from "./admin-top-bar";

const StyledOverall = styled('div')(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
}));

const RestStyled = styled('div')(() => ({
  flex: 1,
  height: '100%',
}))

const AdminLayout = () => {
  return (
    <StyledOverall>
      <AdminDrawer />
      <RestStyled>
          <AdminTopBar />
          <Divider />
          <div style={{ padding: '12px', width: '100%' }}>
              <Outlet />
          </div>
      </RestStyled>
    </StyledOverall>
  )
}

export default AdminLayout;