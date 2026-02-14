import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface VerificationEmailProps {
  verificationCode?: string;
  verificationUrl?: string;
}

export const VerificationEmail = ({
  verificationCode,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <BaseLayout previewText="Verify your email address">
      <Section>
        <Text style={h1}>Verify your email</Text>
        <Text style={text}>
          Thanks for signing up!{" "}
          {verificationCode
            ? "Please use the following verification code to complete your registration:"
            : "Please click the button below to verify your email address:"}
        </Text>
        {verificationCode && (
          <Section style={codeContainer}>
            <Text style={code}>{verificationCode}</Text>
          </Section>
        )}
        {verificationUrl && (
          <Section style={btnContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email
            </Button>
          </Section>
        )}
        <Text style={text}>
          If you didn't request this, you can safely ignore this email.
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

const codeContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  margin: "32px 0",
  padding: "16px",
  textAlign: "center" as const,
};

const code = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
