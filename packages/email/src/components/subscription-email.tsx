import { Section, Text, Hr } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface SubscriptionEmailProps {
  planName: string;
  amount: string;
  nextBillingDate: string;
  status: "active" | "upgraded" | "renewed";
}

export const SubscriptionEmail = ({
  planName,
  amount,
  nextBillingDate,
  status,
}: SubscriptionEmailProps) => {
  const statusText = {
    active: "Your subscription is now active",
    upgraded: "Your subscription has been upgraded",
    renewed: "Your subscription has been renewed",
  };

  return (
    <BaseLayout previewText={statusText[status]}>
      <Section>
        <Text style={h1}>{statusText[status]}</Text>
        <Text style={text}>
          Thank you for choosing our platform. Here are your subscription
          details:
        </Text>
        <Section style={detailsContainer}>
          <Text style={detailsText}>
            <strong>Plan:</strong> {planName}
          </Text>
          <Text style={detailsText}>
            <strong>Amount:</strong> {amount}
          </Text>
          <Text style={detailsText}>
            <strong>Next Billing Date:</strong> {nextBillingDate}
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={text}>
          You can manage your subscription and billing details in your account
          settings.
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

const detailsContainer = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const detailsText = {
  color: "#374151",
  fontSize: "14px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};
