import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getError } from '../utils/error'

export default function TreeCatSelect() {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [firstParrent, changeParrent] = useState(null)

  useEffect(() => {
    async function getFirstParrentId() {
      try {
        const { data } = await axios.get(
          `/api/category/parrent/61aedca920a1e112c43e7bf8`
        )
        console.log('parrent : ', data)
        changeParrent(data)
      } catch (err) {
        console.log(getError(err))
      }
    }
    getFirstParrentId()
  }, [])
  return <div>{firstParrent}</div>
}
