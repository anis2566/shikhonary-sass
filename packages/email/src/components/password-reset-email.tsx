import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => {
  return (
    <BaseLayout previewText="Reset your password">
      <Section>
        <Text style={h1}>Reset your password</Text>
        <Text style={text}>
          Someone requested a password reset for your account. If this was you,
          click the button below to set a new password:
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          If you didn't request a password reset, you can safely ignore this
          email. Your password will not be changed.
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
  backgroundColor: "#e53e3e",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
