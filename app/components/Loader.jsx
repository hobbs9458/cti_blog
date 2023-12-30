import { Hourglass } from 'react-loader-spinner';
import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loadingWrap}>
      <Hourglass
        visible={true}
        height='80'
        width='80'
        ariaLabel='hourglass-loading'
        wrapperStyle={{
          display: 'block',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        wrapperClass=''
        colors={['#1b1b1b', '#1b1b1b']}
      />
    </div>
  );
}
