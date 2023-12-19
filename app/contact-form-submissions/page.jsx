import Link from "next/link";
import { cookies } from "next/headers";

import styles from "./contactFormSubmissions.module.css";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

async function ContactFormSubmissions() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("contact-form-submissions")
    .select()
    .order("id", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (
    <div className={styles.contactSubmissions}>
      <h1>Contact Form Submissions</h1>
      {data.map((submission) => {
        return (
          <div key={submission.id}>
            <Link
              href={`contact-form-submissions/${submission.id}`}
              className={`${styles.submissionLink} link`}
            >
              {submission.name} {submission.created_at.slice(0, 10)}
              <br></br>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default ContactFormSubmissions;
