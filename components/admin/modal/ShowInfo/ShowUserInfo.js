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

const PrivateInfoTab = dynamic(() => import('./privateInfoTab'))

const EducationInfoTab = dynamic(() => import('./EducationInfoTab'))

const WorkUserInfoTab = dynamic(() => import('./WorkUserInfo'))

function ShowUserInfoModal({ isOpen, onClose, id, token }) {
  const CustomTab = React.forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref })
    const isSelected = !!tabProps['aria-selected']

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
                <PrivateInfoTab id={id} token={token} />
              </TabPanel>
              <TabPanel>
                <EducationInfoTab id={id} token={token} />
              </TabPanel>
              <TabPanel>
                <WorkUserInfoTab id={id} token={token} />
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
