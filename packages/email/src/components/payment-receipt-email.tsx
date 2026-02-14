import { Section, Text, Hr, Row, Column } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface PaymentReceiptEmailProps {
  receiptNumber: string;
  date: string;
  amount: string;
  paymentMethod: string;
}

export const PaymentReceiptEmail = ({
  receiptNumber,
  date,
  amount,
  paymentMethod,
}: PaymentReceiptEmailProps) => {
  return (
    <BaseLayout previewText={`Receipt for payment ${receiptNumber}`}>
      <Section>
        <Text style={h1}>Payment Receipt</Text>
        <Text style={text}>
          Thank you for your payment. Here's a summary of your transaction:
        </Text>
        <Section style={receiptContainer}>
          <Row>
            <Column>
              <Text style={label}>Receipt Number</Text>
              <Text style={value}>{receiptNumber}</Text>
            </Column>
            <Column>
              <Text style={label}>Date</Text>
              <Text style={value}>{date}</Text>
            </Column>
          </Row>
          <Hr style={hrSmall} />
          <Row>
            <Column>
              <Text style={label}>Payment Method</Text>
              <Text style={value}>{paymentMethod}</Text>
            </Column>
            <Column>
              <Text style={label}>Total Amount</Text>
              <Text style={totalValue}>{amount}</Text>
            </Column>
          </Row>
        </Section>
        <Text style={text}>
          A PDF version of this receipt is available in your billing dashboard.
        </Text>
        <Text style={text}>
          Best regards,
          <br />
          The Team
        </Text>
      </Section>
    </BaseLayout>
  );
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const receiptContainer = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0",
};

const value = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: "500",
  margin: "4px 0 0 0",
};

const totalValue = {
  color: "#111827",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "4px 0 0 0",
};

const hrSmall = {
  borderColor: "#f3f4f6",
  margin: "16px 0",
};
