// File: src/components/shared/Footer.tsx
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} Zayro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}