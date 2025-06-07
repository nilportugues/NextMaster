interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className }: PageTitleProps) {
  return (
    <h1 className={`text-2xl text-accent1 ${className || ''}`}>
      {title}
    </h1>
  );
}
