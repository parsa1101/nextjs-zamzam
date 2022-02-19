import {
  Button,
  CircularProgress,
  List,
  ListIcon,
  ListItem,
  useToast
} from '@chakra-ui/react'
import React from 'react'

import useSWR from 'swr'

import { MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/router'

export default function TreeCatSelect({ catId }) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const toast = useToast()

  const { data } = useSWR(`/api/category/${catId}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error) {
        toast({
          title: 'خطا',
          description: 'متاسفانه در بازیابی اطلاعات مشکلی به وجود آمده است.',
          status: 'error',
          duration: 9000
        })
      }

      if (retryCount >= 10) return

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  })

  const router = useRouter()

  if (!data)
    return (
      <div>
        <CircularProgress />
      </div>
    )

  return (
    <List spacing={3}>
      {data.map((item, index) => (
        <ListItem key={index}>
          <ListIcon as={MdCheckCircle} color="green.500" />
          <Button
            variant="ghost"
            onClick={() => router.push(`/question/category/${item._id}`)}
          >
            {item.name}
          </Button>
          {item.hasChild && <TreeCatSelect catId={item._id} />}
        </ListItem>
      ))}
    </List>
  )
}
