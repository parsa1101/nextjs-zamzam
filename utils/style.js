/* eslint-disable node/no-unsupported-features/es-syntax */
// eslint-disable-next-line node/no-unsupported-features/es-syntax
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    },
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },

  section: {
    marginBottom: 10,
    marginTop: 10,
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
    direction: 'rtl',
  },
  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },

  transparentBackgroud: {
    backgroundColor: 'transparent',
  },
  dropzone: {
    background: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '100px',
    padding: '10px',
    cursor: 'pointer',
    height: '150px',
    width: '400px',
    border: '2px dashed cyan',
    outline: 'none',
    margin: 'auto',
  },
  playerWrapper: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  controlPlayerWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  controlIconsPlayerWrapper: {
    color: '#777',
    fontSize: 50,
    transform: 'scale(0.9)',
    '&:hover': {
      color: '#fff',
      transform: 'scale(1)',
    },
  },
  bottomIconsPlayerWrapper: {
    color: '#999',
    '&:hover': {
      color: '#fff',
    },
  },
  volumeSilder: {
    width: 100,
  },
});

export default useStyle;
