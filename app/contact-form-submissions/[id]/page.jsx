import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import styles from './contactFormSubmission.module.css';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export const dynamicParams = true;

async function ContactSubmission({ params }) {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase
    .from('contact-form-submissions')
    .select()
    .eq('id', params.id)
    .single();

  const { name, email, phone, company, message } = data;

  if (!data) {
    notFound();
  }

  return (
    <div className={styles.submissionScreen}>
      <div className={`${styles.contactSubmissionsLinkWrap} link`}>
        <Link href='/portal' className={styles.contactSubmissionsLink}>
          Portal Home
        </Link>
        <Link
          href='/contact-form-submissions'
          className={styles.contactSubmissionsLink}
        >
          All Contact Submissions
        </Link>
      </div>
      <div className={styles.submission}>
        <h2 className={styles.submissionHeader}>
          Submission Date: {data.created_at.slice(0, 10)}
        </h2>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Phone: {phone}</p>
        <p>Company: {company}</p>
        <p>Message: {message}</p>
      </div>
    </div>
  );
}

export default ContactSubmission;
