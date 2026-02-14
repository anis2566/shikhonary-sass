import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface TenantWelcomeEmailProps {
  adminName: string;
  tenantName: string;
  dashboardUrl: string;
}

export const TenantWelcomeEmail = ({
  adminName,
  tenantName,
  dashboardUrl,
}: TenantWelcomeEmailProps) => {
  return (
    <BaseLayout previewText={`Welcome to your ${tenantName} workspace`}>
      <Section>
        <Text style={h1}>Welcome, {adminName}!</Text>
        <Text style={text}>
          Congratulations on setting up your new workspace:{" "}
          <strong>{tenantName}</strong>.
        </Text>
        <Text style={text}>
          Your workspace is ready for you to start inviting team members,
          managing projects, and scaling your operations.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={dashboardUrl}>
            Go to Dashboard
          </Button>
        </Section>
        <Text style={text}>
          We've put together a setup guide to help you get the most out of your
          new workspace. You can find it in your dashboard.
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

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
