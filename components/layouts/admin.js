import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'

// import PageContainer from '../admin/dashboard/PageContainer'
// import Nav from '../admin/dashboard/Nav'

const PageContainer = dynamic(() => import('../admin/dashboard/PageContainer'))
const Nav = dynamic(() => import('../admin/dashboard/Nav'))

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

function AdminLayout({ children }) {
  // const token = Cookies.get('userToken')

  const userId = Cookies.get('userId')

  // const [user, setUser] = useState('')

  const router = useRouter()

  // const toast = useToast()

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }

    // const fetchData = async () => {
    //   try {
    //     const { data } = await axios.get(`/api/admin/users/${userId}`, {
    //       headers: { authorization: `Bearer ${token}` }
    //     })
    //     setUser(data.user)
    //   } catch (err) {
    //     toast({
    //       title: err.message,
    //       status: 'error',
    //       isClosable: true
    //     })
    //   }
    // }
    // fetchData()
  }, [userId])

  return (
    <PageContainer isFixedNav>
      <Nav />
      {children}
      {/* <Footer /> */}
    </PageContainer>
  )
}

export default AdminLayout
