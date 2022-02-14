import { useEffect, useState } from 'react'

export const useDocument = () => {
  const [myDocument, setMyDocument] = useState(null)

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    setMyDocument(document)
  }, [])

  return myDocument
}
