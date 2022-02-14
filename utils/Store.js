import Cookies from 'js-cookie'
import { createContext, useState } from 'react'

const LayoutContext = createContext({
  layoutValue: null, //{countUserFav}
  userInfo: null, //email,  mobile,  password,  isAdmin,  token,
  uploadInfo: null,
  catId: '',
  showDrawer: false,

  setShowDrawer: function () {},
  setCatId: function () {},
  setDarkMode: function () {},
  setCountUserFav: function () {},
  setUserInfo: function () {},
  setUploadInfo: function () {},
  logout: function () {}
})
export default LayoutContext

export function LayoutContextProvider(props) {
  const [layoutState, setLayoutState] = useState({
    countUserFav: 0
  })

  const initialState = {
    _id: '',
    email: '',
    mobile: '',
    token: '',
    isAdmin: false
  }

  const [cat, setCat] = useState('')
  const [user, setUser] = useState(initialState)
  const [uploadState, changeUploadState] = useState({ status: '', message: '' })
  const [drawer, changeDrawer] = useState(false)

  function changeUploadStateHandler(status, message) {
    changeUploadState(prev => ({ ...prev, status: status, message: message }))
  }
  function setCatHandler(id) {
    setCat(id)
  }

  function setUserHanler(user) {
    const userId = user._id.toString()
    Cookies.set('userId', userId)
    Cookies.set('userToken', user.token)

    setUser(prevState => ({
      ...prevState,
      _id: user._id,
      email: user.email,
      mobile: user.mobile,
      token: user.token,
      isAdmin: user.isAdmin
    }))
  }

  function setCountUserFavHandler(value) {
    setLayoutState(prevState => {
      return { ...prevState, countUserFav: value }
    })
  }

  function DrawerHandler() {
    changeDrawer(!drawer)
  }
  function logoutHandler() {
    Cookies.remove('userId')
    Cookies.remove('userToken')
    return setUser(initialState)
  }

  const context = {
    layoutValue: layoutState,
    userInfo: user,
    setUserInfo: setUserHanler,
    setCountUserFav: setCountUserFavHandler,
    logout: logoutHandler,
    catId: cat,
    setCatId: setCatHandler,
    showDrawer: drawer,
    setShowDrawer: DrawerHandler,
    uploadInfo: uploadState,
    setUploadInfo: changeUploadStateHandler
  }
  return (
    <LayoutContext.Provider value={context}>
      {props.children}
    </LayoutContext.Provider>
  )
}
