interface Props {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-10">
      <h2 className="text-4xl font-bold">{title}</h2>

      <p className="text-white/50 mt-3">{subtitle}</p>
    </div>
  );
}
