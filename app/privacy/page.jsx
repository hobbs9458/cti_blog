import styles from "./Privacy.module.css";

function Privacy() {
  return (
    <main className={styles.privacyMain}>
      <h1>Cutting Tools Inc. Privacy Policy</h1>
      <p>
        This privacy policy sets out how Cutting Tools Inc. (or “CTI”) uses and
        protects any information that you give CTI when you use this website.
      </p>
      <p>
        Cutting Tools Inc. is committed to ensuring that your privacy is
        protected. Should we ask you to provide certain information by which you
        can be identified when using this website, then you can be assured that
        it will only be used in accordance with this privacy statement.
      </p>
      <p>
        Cutting Tools Inc. may change this policy from time to time by updating
        this page. You should check this page from time to time to ensure that
        you are happy with any changes. This policy is effective from January 1,
        2014.
      </p>
      <p className="mt1">
        <strong>What we collect </strong>
      </p>
      <p>We may collect the following information:</p>
      <ul className={styles.privacyUl}>
        <li> name and job title</li>
        <li> contact information including email address</li>
        <li>
          {" "}
          demographic information such as postcode, preferences and interests
        </li>
        <li> other information relevant to customer surveys and/or offers</li>
      </ul>
      <p className="mt1">
        <strong>What we do with the information we gather</strong>
      </p>
      <p>
        We require this information to understand your needs and provide you
        with a better service, and in particular for the following reasons:
      </p>
      <ul className={styles.privacyUl}>
        <li> Internal record keeping.</li>
        <li>
          {" "}
          We may use the information to improve our products and services.
        </li>
        <li>
          We may periodically send promotional email about new products, special
          offers or other information which we think you may find interesting
          using the email address which you have provided.
        </li>
        <li>
          {" "}
          From time to time, we may also use your information to contact you for
          market research purposes. We may contact you by email, phone, fax or
          mail.
        </li>
        <li>
          We may use the information to customize the website according to your
          interests.
        </li>
        <li>
          We may provide your information to our third party partners for
          marketing or promotional purposes.
        </li>
        <li>We may send to you statements and/or invoices for purchases.</li>
        <li>
          We may use the contact information that you provide to collect
          payments from you.
        </li>
      </ul>
      <p>
        Cutting Tools Inc. will never sell your information. Where Cutting Tools
        Inc. discloses your personal information to its agents or
        sub-contractors for these purposes, the agent or sub-contractor in
        question will be obligated to use that personal information in
        accordance with the terms of this privacy statement.{" "}
      </p>
      <p>
        In addition to the disclosures reasonably necessary for the purposes
        identified elsewhere above, Cutting Tools Inc. may disclose your
        personal information to the extent that it is required to do so by law,
        in connection with any legal proceedings or prospective legal
        proceedings, and in order to establish, exercise or defend its legal
        rights.
      </p>
      <p>
        We are committed to ensuring that your information is secure. In order
        to prevent unauthorized access or disclosure we have put in place
        suitable physical, electronic and managerial procedures to safeguard and
        secure the information we collect online.
      </p>
      <p className="mt1">
        <strong>How we use cookies</strong>
      </p>
      <ul className={styles.privacyUl}>
        <li>
          A cookie is a small file which asks permission to be placed on your
          computer's hard drive. Once you agree, the file is added and the
          cookie helps analyze web traffic or lets you know when you visit a
          particular site. Cookies allow web applications to respond to you as
          an individual. The web application can tailor its operations to your
          needs, likes and dislikes by gathering and remembering information
          about your preferences.
        </li>
        <li>
          We use traffic log cookies to identify which pages are being used.
          This helps us analyze data about web page traffic and improve our
          website in order to tailor it to customer needs. We only use this
          information for statistical analysis purposes and then the data is
          removed from the system.
        </li>
        <li>
          Overall, cookies help us provide you with a better website, by
          enabling us to monitor which pages you find useful and which you do
          not. A cookie in no way gives us access to your computer or any
          information about you, other than the data you choose to share with
          us.
        </li>
        <li>
          You can choose to accept or decline cookies. Most web browsers
          automatically accept cookies, but you can usually modify your browser
          setting to decline cookies if you prefer. This may prevent you from
          taking full advantage of the website.
        </li>
      </ul>
      <p className="mt1">
        <strong>Links to other websites</strong>
      </p>
      <p>
        Our website may contain links to enable you to visit other websites of
        interest easily. However, once you have used these links to leave our
        site, you should note that we do not have any control over that other
        website. Therefore, we cannot be responsible for the protection and
        privacy of any information which you provide whilst visiting such sites
        and such sites are not governed by this privacy statement. You should
        exercise caution and look at the privacy statement applicable to the
        website in question.
      </p>
      <p className="mt1">
        <strong>Controlling your personal information</strong>
      </p>
      <p>
        You may choose to restrict the collection or use of your personal
        information in the following ways:
      </p>
      <ul className={styles.privacyUl}>
        <li>
          {" "}
          Whenever you are asked to fill in a form on the website, do not
          include any information that you may not want to be kept by our
          computer systems, or look for a box to check to not be added to any
          marketing list(s).
        </li>
        <li>
          If you have previously agreed to us using your personal information
          for direct marketing purposes, you may change your mind at any time by
          writing to or emailing us at info@cuttingtoolsinc[dot]net.
        </li>
      </ul>
      <p>
        We will not sell, distribute or lease your personal information to third
        parties unless we have your permission or are required by law. We may
        use your personal information to send you promotional information about
        third parties which we think you may find interesting if you tell us
        that you wish this to happen.
      </p>
      <p>
        You may request details of personal information which we hold about you
        under the Data Protection Act 1998. A small fee will be payable. If you
        would like a copy of the information held on you please write to:
      </p>
      <address className="mt1 mb1">
        Cutting Tools Inc.
        <br />
        P.O. Box 7726
        <br />
        Louisville, KY 40257
      </address>
      <p>
        If you believe that any information we are holding on you is incorrect
        or incomplete, please write to or email us as soon as possible, at the
        above address. We will promptly correct any information found to be
        incorrect.
      </p>
      <p className="mt1">
        <strong>Updates to this Privacy Statement</strong>
      </p>
      <p>
        Cutting Tools Inc. may update this privacy statement by posting a new
        version on this website. You should check this page occasionally to
        ensure you are familiar with any changes.
      </p>
    </main>
  );
}

export default Privacy;
