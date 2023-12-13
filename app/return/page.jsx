import styles from "./Return.module.css";

function Return() {
  return (
    <main className={styles.returnMain}>
      <h1>Cutting Tools Inc Return Policy</h1>
      <p>
        Thank you for choosing Cutting Tools, Inc. We are committed to providing
        high-quality products and exceptional customer service. In the event
        that you need to return goods, please review the following return goods
        policy:
      </p>
      <h3 className={styles.returnH3}>Eligibility for Return:</h3>
      <ol type="a" className={styles.returnOl}>
        <li>
          To be eligible for return, requests must be made within 30 days from
          the date of purchase.
        </li>
        <li>
          The product must be in its original condition, unused, and in its
          original packaging.
        </li>
        <li>
          Proof of purchase, such as an invoice or receipt, is required for all
          returns.
        </li>
        <li>
          Claims for shipment discrepancies must be made within 7 days of
          receipt of merchandise.
        </li>
        <li>
          Due to their unique nature, custom made items and modified standard
          items are non-returnable.
        </li>
        <li>
          Items that have been modified or altered by the customer are
          non-returnable.
        </li>
        <li>
          Request for RMA will only be considered for accounts in good standing.
        </li>
      </ol>
      <h3 className={styles.returnH3}>Return Process:</h3>
      <ol type="a" className={styles.returnOl}>
        <li>
          Prior to returning the goods, please contact our customer service
          department to initiate the return process. They will provide you with
          a Return Merchandise Authorization (RMA) number.
        </li>
        <li>
          The RMA number must be clearly marked on the outside of the package
          being returned.
        </li>
        <li>
          Please include a copy of the original proof of purchase with the
          returned goods.
        </li>
        <li>
          The customer is responsible for the shipping costs associated with the
          return unless the return is due to a product defect or an error on our
          part.
        </li>
        <li>COD returns will not be accepted.</li>
      </ol>
      <h3 className={styles.returnH3}>Inspection and Refunds:</h3>
      <ol type="a" className={styles.returnOl}>
        <li>
          Once we receive the returned goods, our quality control team will
          inspect them to ensure they meet the eligibility criteria mentioned in
          point 1.
        </li>
        <li>
          If the returned goods meet the eligibility criteria, we will process
          the refund within 7 business days.
        </li>
        <li>
          Refunds will be issued in the original form of payment used during the
          purchase.
        </li>
        <li>
          Shipping costs are non-refundable, except in cases where the return is
          due to a product defect or an error on our part.
        </li>
      </ol>
      <h3 className={styles.returnH3}>Warranty:</h3>
      <ol type="a" className={styles.returnOl}>
        <li>
          Many of our manufacturers warranty their products against defects in
          material and workmanship.
        </li>
        <li>
          The warranty period may vary depending on the specific product. Please
          refer to the product documentation or contact our customer service
          department for more information.
        </li>
        <li>
          Warranty claims will be evaluated on a case-by-case basis, and we
          reserve the right to repair or replace the product at our discretion.
        </li>
      </ol>
      <h3 className={styles.returnH3}>Customer Responsibilities:</h3>
      <ol type="a" className={styles.returnOl}>
        <li>
          It is the customer's responsibility to provide accurate information
          and follow the return process as outlined in this policy.
        </li>
        <li>
          The customer is responsible for adequately packaging the returned
          goods to prevent damage during transit.
        </li>
      </ol>
      <p>
        Please note that this Return Goods Policy is subject to change without
        prior notice. We encourage you to review the policy on our website or
        contact our customer service department for any updates or
        clarifications.
      </p>
      <p>
        If you have any further questions or require assistance with a return,
        please don't hesitate to reach out to our customer service department.
        We appreciate your business and will do our best to ensure your
        satisfaction.
      </p>
      <h3 className={styles.returnH3}>Disclaimer:</h3>
      <p className="mb1">
        Cutting Tools, Inc. reserves the right to refuse the return of any
        products. These decisions will be made at the sole discretion of Cutting
        Tools, Inc.
      </p>
      <p>
        <b>
          Effective January 1, 2023. This policy supersedes all previous
          policies.
        </b>
      </p>
    </main>
  );
}

export default Return;
