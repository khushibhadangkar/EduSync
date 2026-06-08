import type { Metadata } from "next";
import TestPageClient from "./TestPageClient";

export const metadata: Metadata = {
  title: "MCQ Test | EduSync",
  description: "Take your MCQ test on EduSync",
};

export default function TestPage() {
  return <TestPageClient />;
}
