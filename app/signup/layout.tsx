export const metadata = {
  title: "Sign up",
  description: "Register or signup user",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
