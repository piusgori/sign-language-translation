import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Button, Grid, Stack, Typography } from "@mui/material";
import LoadingScreen from "../../components/loading-screen";
import { ITEM } from "../../utils/types";
import ItemFormDialog from "../../sections/item/item-form-dialog";
import SingleItem from "../../sections/item/single-item";
import DeleteItemDialog from "../../sections/item/delete-item-dialog";

const AdminPage = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [selectedItem, setSelectedItem] = useState<ITEM | null>(null);
  
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  
    const [items, setItems] = useState<ITEM[]>([]);

    const openNewForm = () => {
        setFormOpen(true);
    }

    const openEditForm = (item: ITEM) => {
        setSelectedItem(item);
        setFormOpen(true);
    }

    const closeForm = () => {
        setSelectedItem(null);
        setFormOpen(false);
    }

    const openDeleteForm = (item: ITEM) => {
      setSelectedItem(item);
      setDeleteOpen(true);
  }

  const closeDeleteForm = () => {
      setSelectedItem(null);
      setDeleteOpen(false);
  }
  
    const getResources = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/learning');
        setItems(data.items);
      } catch (err: any) {
        enqueueSnackbar(err, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      getResources();
    }, [])
  
    return (
      <>
        <ItemFormDialog reloadHandler={getResources} closeDialog={closeForm} open={formOpen} selectedItem={selectedItem} />
        <DeleteItemDialog reloadHandler={getResources} closeDialog={closeDeleteForm} open={deleteOpen} selectedItem={selectedItem} />
        
        <Stack gap={3}>
          <Stack direction='row' gap={2} alignItems='center' justifyContent='space-between'>
            <Typography fontWeight='600'>Learning Resources</Typography>
            <Button onClick={openNewForm} variant='contained'>New Resource</Button>
          </Stack>
  
          {isLoading && <LoadingScreen />}
          {!isLoading && 
          <>
            {items.length === 0 && <Typography textAlign='center'>No resource created</Typography>}
            {items.length > 0 && <Grid container spacing={3}>
              {items.map(item => <Grid item xs={12} md={4} key={item._id}><SingleItem item={item} openEdit={openEditForm} openDelete={openDeleteForm} /></Grid>)}
            </Grid>}
          </>
          }
        </Stack>
      </>
    )
}

export default AdminPage