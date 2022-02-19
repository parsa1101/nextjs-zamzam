import React from 'react'
// import axios from 'axios'
// import { getError } from '../utils/error'
import useSWR from 'swr'

export default function TreeCatSelect({ catId }) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())

  const { data, error } = useSWR(`/api/category/parrent/${catId}`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello</div>
}
