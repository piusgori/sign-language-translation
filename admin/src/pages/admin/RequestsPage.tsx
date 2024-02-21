import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Grid, Stack, Typography } from "@mui/material";
import LoadingScreen from "../../components/loading-screen";
import { ITEM } from "../../utils/types";
import SingleItem from "../../sections/item/single-item";
import ApproveItemDialog from "../../sections/item/approve-item-dialog";

const AdminPage = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [selectedItem, setSelectedItem] = useState<ITEM | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
  
    const [items, setItems] = useState<ITEM[]>([]);

    const openApproveHandler = (item: ITEM) => {
      setSelectedItem(item);
      setApproveOpen(true);
  }

  const closeApproveHandler = () => {
      setSelectedItem(null);
      setApproveOpen(false);
  }
  
    const getRequests = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/admin/requests');
        setItems(data.items);
      } catch (err: any) {
        enqueueSnackbar(err, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      getRequests();
    }, [])
  
    return (
      <>
        <ApproveItemDialog reloadHandler={getRequests} closeDialog={closeApproveHandler} open={approveOpen} selectedItem={selectedItem} />
        
        <Stack gap={3}>
          <Stack direction='row' gap={2} alignItems='center' justifyContent='space-between'>
            <Typography fontWeight='600'>Learning Resources Requests</Typography>
          </Stack>
  
          {isLoading && <LoadingScreen />}
          {!isLoading && 
          <>
            {items.length === 0 && <Typography textAlign='center'>No resource requested</Typography>}
            {items.length > 0 && <Grid container spacing={3}>
              {items.map(item => <Grid item xs={12} md={4} key={item._id}><SingleItem item={item} openApprove={openApproveHandler} isRequest /></Grid>)}
            </Grid>}
          </>
          }
        </Stack>
      </>
    )
}

export default AdminPage