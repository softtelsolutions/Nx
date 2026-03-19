export const metadata = {
  title: 'Retail Shopping',
  description: 'Your one-stop retail shop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

