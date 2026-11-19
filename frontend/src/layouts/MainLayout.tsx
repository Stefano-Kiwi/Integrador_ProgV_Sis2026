import type { ReactNode } from "react";
import Navbar from "../components/organisms/Navbar";

interface MainLayoutProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
