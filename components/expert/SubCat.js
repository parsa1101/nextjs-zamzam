import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useToast,
  Link
} from '@chakra-ui/react'
import useSWR from 'swr'
// import axios from 'axios'

export default function SubCat({ catName, catId }) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const toast = useToast()

  const res = useSWR(`/api/category/${catId}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error) {
        toast({
          title: 'خطا',
          description: error.message,
          status: 'error',
          duration: 9000
        })
      }

      if (retryCount >= 10) return

      // Retry after 5 seconds.
    }
  })

  const data = res.data
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left" role="button">
              <Link
                color="teal.500"
                size="md"
                href={`/expert/showQuestions/${catId}`}
                isExternal
              >
                {catName}
              </Link>
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
