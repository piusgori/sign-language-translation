import { View, ToastAndroid, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ITEM } from '@/utils/types'
import axiosInstance from '@/utils/axios';
import { useAuthContext } from '@/auth/auth-context';
import { Banner, Button, Card, Chip, Text } from 'react-native-paper';
import { PRIMARY_MAIN } from '@/config';
import AddLearnRequestDialog from '@/sections/learn/add-learn-request-dialog';

const SAMPLE = [
  { 
    _id: '1', 
    image: 'https://cdn.pixabay.com/photo/2024/02/12/21/34/sunset-8569636_640.jpg',
    meaning: 1,
    views: ['1234']
  }
]

const LearnScreen = () => {

  const { user } = useAuthContext();

  const [items, setItems] = useState<ITEM[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(true);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const getResourceHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/learning');
      setItems(data.items);
    } catch (err: any) {
      ToastAndroid.show(err, ToastAndroid.LONG);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getResourceHandler()
  }, [])

  return (
    <>
      <AddLearnRequestDialog closeDialog={() => { setFormOpen(false) }} open={formOpen} />

      <View style={{ backgroundColor: '#fff', flex: 1, gap: 16 }}>
        <Text variant='headlineMedium' style={{ textAlign: 'center' }}>Learning Resources</Text>
        <Banner
          visible={visible}
          actions={[
            { label: 'Okay', onPress: () => setVisible(false), },
          ]}
          >
          These are the learning resources for sign language which are contributed by the whole community. The sign and its meaning will appear
        </Banner>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Text>Would You Like To Contribute To The Community?</Text>
          <Button onPress={() => { setFormOpen(true) }}>Add Yours</Button>
        </View>
        <FlatList
          refreshControl={<RefreshControl
            colors={[PRIMARY_MAIN]}
            refreshing={isLoading}
            onRefresh={getResourceHandler}
          />}
          data={items}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No New Resources At The Moment. Please check in later</Text>}
          renderItem={({ item }) => {
            const userViewed = item.views.find(e => e === user?._id)
            return (
              <Card style={{ marginVertical: 12 }}>
                <Card.Cover source={{ uri: item.image }} />
                <Card.Content style={{ marginTop: 12, gap: 12 }}>
                  <Text>{item.meaning}</Text>
                  {!userViewed && <Chip selectedColor={PRIMARY_MAIN}>New</Chip>}
                </Card.Content>
              </Card>
            )
          }}
        />
      </View>
    </>
  )
}

export default LearnScreen