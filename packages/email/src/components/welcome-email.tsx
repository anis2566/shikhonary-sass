import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface WelcomeEmailProps {
  userFirstname: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  userFirstname,
  loginUrl = "https://example.com/login",
}: WelcomeEmailProps) => {
  return (
    <BaseLayout previewText={`Welcome to our platform, ${userFirstname}!`}>
      <Section>
        <Text style={h1}>Welcome, {userFirstname}!</Text>
        <Text style={text}>
          We're excited to have you on board. Our platform helps you manage your
          business efficiently and scale with ease.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={loginUrl}>
            Get Started
          </Button>
        </Section>
        <Text style={text}>
          If you have any questions, simply reply to this email. We'd love to
          help!
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
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
