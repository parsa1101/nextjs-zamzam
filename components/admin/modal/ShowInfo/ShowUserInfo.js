import React from 'react'

import dynamic from 'next/dynamic'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
  Image,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  useTab,
  useMultiStyleConfig
} from '@chakra-ui/react'

// import PrivateInfoTab from './privateInfoTab'
// import EducationInfoTab from './EducationInfoTab'
// import WorkUserInfoTab from './WorkUserInfo'
const PrivateInfoTab = dynamic(() => import('./privateInfoTab'))
const EducationInfoTab = dynamic(() => import('./EducationInfoTab'))
const WorkUserInfoTab = dynamic(() => import('./WorkUserInfo'))

function ShowUserInfoModal({ isOpen, onClose, id }) {
  const CustomTab = React.forwardRef((props, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ...props, ref })
    const isSelected = !!tabProps['aria-selected']

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig('Tabs', tabProps)

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Box as="span" mr="2">
          {isSelected ? '😎' : '😐'}
        </Box>
        {tabProps.children}
      </Button>
    )
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> نمایش اطلاعات کاربر</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center my={6}>
            <Image src="/images/works/amembo_icon.png" alt="icon" />
          </Center>
          <Tabs>
            <TabList>
              <CustomTab>اطلاعات شخصی</CustomTab>
              <CustomTab>اطلاعات تحصیلی</CustomTab>
              <CustomTab>اطلاعات شغلی</CustomTab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PrivateInfoTab id={id} />
              </TabPanel>
              <TabPanel>
                <EducationInfoTab id={id} />
              </TabPanel>
              <TabPanel>
                <WorkUserInfoTab id={id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            بستن
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ShowUserInfoModal
