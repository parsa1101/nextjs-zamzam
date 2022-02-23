import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useToast,
  Button
} from '@chakra-ui/react'
import useSWR from 'swr'
import { useRouter } from 'next/router'

export default function SubCat({ catName, catId }) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const toast = useToast()

  const router = useRouter()

  const res = useSWR(`/api/category/${catId}`, fetcher, {
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

  const data = res.data
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Button
                variant="ghost"
                colorScheme="teal"
                size="md"
                onClick={() => router.push(`/expert/showQuestions/${catId}`)}
              >
                {catName}
              </Button>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {data &&
            data.length > 0 &&
            data.map((cat, index) => (
              <div key={index}>
                {<SubCat catId={cat._id} catName={cat.name} />}
              </div>
            ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
