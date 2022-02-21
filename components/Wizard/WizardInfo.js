import { Button, Center, Flex, Heading } from '@chakra-ui/react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import dynamic from 'next/dynamic'

import { FiCheckCircle } from 'react-icons/fi'

// import EducationInfo from './info/EducationInfo'
// import PrivateInfo from './info/PrivateInfo'
// import WorkInfo from './info/WorkInfo'

const EducationInfo = dynamic(() => import('./info/EducationInfo'))
const PrivateInfo = dynamic(() => import('./info/PrivateInfo'))
const WorkInfo = dynamic(() => import('./info/WorkInfo'))

export default function WizardInfo({
  userId,
  userInfo,
  userEduInfo,
  userWorkInfo,
  provinces,
  profileCities,
  eduCities,
  workCities
}) {
  const steps = [
    {
      label: 'اطلاعات شخصی',
      content: (
        <PrivateInfo
          userId={userId}
          userInfo={userInfo}
          provinces={provinces}
          profileCities={profileCities}
        />
      )
    },
    {
      label: 'اطلاعات تحصیلی',
      content: (
        <EducationInfo
          userId={userId}
          userEduInfo={userEduInfo}
          eduProvinces={provinces}
          educationCities={eduCities}
        />
      )
    },
    {
      label: 'اطلاعات شغلی',
      content: (
        <WorkInfo
          userId={userId}
          userWorkInfo={userWorkInfo}
          workProvinces={provinces}
          userWorkCities={workCities}
        />
      )
    }
  ]

  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0
  })

  return (
    <Flex
      width="100%"
      flexDir="column"
      bg="#e6b8a2"
      rounded={'lg'}
      boxShadow={'lg'}
      pt={10}
      pb={10}
      pl={5}
      pr={5}
    >
      <Steps
        checkIcon={FiCheckCircle}
        activeStep={activeStep}
        responsive={true}
        orientation="vertical"
        onClickStep={step => setStep(step)}
      >
        {steps.map(({ label, content }, index) => (
          <Step label={label} key={index}>
            {content}
          </Step>
        ))}
      </Steps>

      {activeStep === 3 ? (
        <Center p={4} flexDir="column">
          {userInfo && userEduInfo && userWorkInfo ? (
            <>
              <Heading fontSize="lg">کاربر گرامی :</Heading>
              <Heading fontSize="md">
                کاربر گرامی : اطلاعات شما با موفقیت ثبت شد و پس از تایید توسط
                ادمین ، شما می توانید به سوالات مطرح شده توسط کاربران پاسخ دهید.
              </Heading>
            </>
          ) : (
            <Heading fontSize="xl">
              لطفا اطلاعات را به طور کامل وارد نمایید
            </Heading>
          )}
          <Button mt={6} size="sm" onClick={reset}>
            مرحله اول
          </Button>
        </Center>
      ) : (
        <Flex width="100%" justify="flex-end">
          <Button
            mr={4}
            size="sm"
            variant="ghost"
            onClick={prevStep}
            isDisabled={activeStep === 0}
          >
            مرحله قبل
          </Button>
          <Button size="sm" onClick={nextStep}>
            {activeStep === steps.length - 1 ? 'تمام ' : 'بعدی'}
          </Button>
        </Flex>
      )}
    </Flex>
  )
}
