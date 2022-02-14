import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: Vazir;
        src: url('/fonts/Vazir-Regular.eot');
        src: url('/fonts/Vazir-Regular.eot?#iefix') format('embedded-opentype'),
             url('/fonts/Vazir-Regular.woff2') format('woff2'),
             url('/fonts/Vazir-Regular.woff') format('woff'),
             url('/fonts/Vazir-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: Vazir;
        src: url('/fonts/Vazir-Bold.eot');
        src: url('/fonts/Vazir-Bold.eot?#iefix') format('embedded-opentype'),
             url('/fonts/Vazir-Bold.woff2') format('woff2'),
             url('/fonts/Vazir-Bold.woff') format('woff'),
             url('/fonts/Vazir-Bold.ttf') format('truetype');
        font-weight: bold;
        font-style: normal;
    }
    @font-face {
        font-family: Vazir;
        src: url('/fonts/Vazir-Black.eot');
        src: url('/fonts/Vazir-Black.eot?#iefix') format('embedded-opentype'),
             url('/fonts/Vazir-Black.woff2') format('woff2'),
             url('/fonts/Vazir-Black.woff') format('woff'),
             url('/fonts/Vazir-Black.ttf') format('truetype');
        font-weight: 900;
        font-style: normal;
    }
    @font-face {
        font-family: Vazir;
        src: url('/fonts/Vazir-Medium.eot');
        src: url('/fonts/Vazir-Medium.eot?#iefix') format('embedded-opentype'),
             url('/fonts/Vazir-Medium.woff2') format('woff2'),
             url('/fonts/Vazir-Medium.woff') format('woff'),
             url('/fonts/Vazir-Medium.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: Vazir;
        src: url('/fonts/Vazir-Light.eot');
        src: url('/fonts/Vazir-Light.eot?#iefix') format('embedded-opentype'),
             url('/fonts/Vazir-Light.woff2') format('woff2'),
             url('/fonts/Vazir-Light.woff') format('woff'),
             url('/fonts/Vazir-Light.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: Vazir;
        src: url('/fonts/Vazir-Thin.eot');
        src: url('/fonts/Vazir-Thin.eot?#iefix') format('embedded-opentype'),
             url('/fonts/Vazir-Thin.woff2') format('woff2'),
             url('/fonts/Vazir-Thin.woff') format('woff'),
             url('/fonts/Vazir-Thin.ttf') format('truetype');
        font-weight: 100;
        font-style: normal;
    }
      `}
  />
);

export default Fonts;
