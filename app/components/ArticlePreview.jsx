import Link from 'next/link';
import Image from 'next/image'


import styles from './ArticlePreview.module.css';


export default function ArticlePreview({ post }) {
  const title = post.title.trim().toLowerCase().split(' ').join('-');


  return (
    <Link href={`/${title}/${post._id}`} className={styles.previewLink}>
      <div className={styles.articlePreview} style={{backgroundImage: `url(" + "/uploads/1701805204145_9248298-WIDIBA304012.jpg" + ")`}}>
        <h1 className={styles.previewTitle}>{post.title}</h1>
        <Image src={`${post.blogPreviewImg}`} width={250} height={250} alt="tool" className={styles.previewImage} />
      </div>
    </Link>
  );
}
