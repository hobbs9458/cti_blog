import Link from 'next/link';
import { cookies } from 'next/headers';

import styles from './contactFormSubmissions.module.css';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

async function ContactFormSubmissions() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('contact-form-submissions')
    .select()
    .order('id', { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (
    <div className={styles.contactSubmissionsWrap}>
      <h1 className={styles.contactSubmissionsHeader}>
        Contact Form Submissions
      </h1>
      <div className={styles.linksWrap}>
        {data.map((submission) => {
          return (
            <div key={submission.id} className={styles.submissionLinkWrap}>
              <Link
                href={`contact-form-submissions/${submission.id}`}
                className={`${styles.submissionLink} link`}
              >
                <div className={styles.nameDateWrap}>
                  <div>{submission.name}</div>
                  <div className={styles.linkDate}>
                    {submission.created_at.slice(0, 10)}
                  </div>
                </div>
                <br></br>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactFormSubmissions;
