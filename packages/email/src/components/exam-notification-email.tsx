import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface ExamNotificationEmailProps {
  studentName: string;
  examName: string;
  examDate: string;
  examUrl: string;
  type: "scheduled" | "released";
}

export const ExamNotificationEmail = ({
  studentName,
  examName,
  examDate,
  examUrl,
  type,
}: ExamNotificationEmailProps) => {
  const title =
    type === "scheduled" ? "New Exam Scheduled" : "Exam Results Released";
  const message =
    type === "scheduled"
      ? `A new exam, ${examName}, has been scheduled for you on ${examDate}.`
      : `The results for your exam, ${examName}, have been released.`;
  const btnText = type === "scheduled" ? "View Exam Details" : "View Results";

  return (
    <BaseLayout previewText={title}>
      <Section>
        <Text style={h1}>{title}</Text>
        <Text style={text}>Hi {studentName},</Text>
        <Text style={text}>{message}</Text>
        <Section style={btnContainer}>
          <Button style={button} href={examUrl}>
            {btnText}
          </Button>
        </Section>
        <Text style={text}>Good luck with your studies!</Text>
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
  backgroundColor: "#f59e0b",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
