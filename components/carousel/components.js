import styled from '@emotion/styled'

export const NEXT = 'NEXT'
export const PREV = 'PREV'

export const Item = styled.div`
  text-align: center;
  padding: 100px;
  background-image: ${props => `url(${props.img})`};
  background-size: cover;
`

export const CarouselContainer = styled.div`
  display: flex;

  transition: ${props => (props.sliding ? 'none' : 'transform 1s ease')};
  transform: ${props => {
    if (!props.sliding) return 'translateX(calc(-80% - 20px))'
    if (props.dir === PREV) return 'translateX(calc(2 * (-80% - 20px)))'
    return 'translateX(0%)'
  }};
`

export const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  direction: 'rtl',
  box-shadow: 5px 5px 20px 7px rgba(168, 168, 168, 1);
`

export const CarouselSlot = styled.div`
  flex: 1 0 100%;
  flex-basis: 80%;
  margin-right: 20px;

  order: ${props => props.order};
`

export const SlideButton = styled.button`
  color: #0a9396;
  font-family: Open Sans;
  font-size: 20px;
  font-weight: 100;
  padding: 10px;
  background-color: #94d2bd;
  border: 1px solid white;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: none;
  float: ${props => props.float};

  &:active {
    position: relative;
    top: 1px;
  }
  &:focus {
    outline: 0;
  }
`

export const AppContainer = styled.div`
  font-family: sans-serif;
  text-align: center;
  width: 100%;
`

export const ExtraInfo = styled.div`
  margin-top: 25px;
  display: inline-block;
`
