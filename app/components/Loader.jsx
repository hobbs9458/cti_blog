import { Hourglass } from 'react-loader-spinner';
import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loadingWrap}>
      <div
        style={{
          display: 'block',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className={styles.hourGlassWrap}
      >
        <Hourglass
          visible={true}
          height='80'
          width='80'
          ariaLabel='hourglass-loading'
          wrapperStyle={{}}
          wrapperClass=''
          colors={['#1b1b1b', '#1b1b1b']}
        />
      </div>
    </div>
  );
}
