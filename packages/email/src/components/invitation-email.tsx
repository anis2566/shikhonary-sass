import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface InvitationEmailProps {
  tenantName: string;
  inviterName: string;
  invitationLink: string;
}

export const InvitationEmail = ({
  tenantName,
  inviterName,
  invitationLink,
}: InvitationEmailProps) => {
  return (
    <BaseLayout previewText={`Join ${tenantName} on our platform`}>
      <Section>
        <Text style={h1}>You've been invited!</Text>
        <Text style={text}>
          {inviterName} has invited you to join <strong>{tenantName}</strong> on
          our platform.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={invitationLink}>
            Accept Invitation
          </Button>
        </Section>
        <Text style={text}>
          This invitation will expire in 7 days. If you weren't expecting this
          invitation, you can safely ignore this email.
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
  backgroundColor: "#0070f3",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
