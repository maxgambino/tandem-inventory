type PageProps = { 
  title: string; 
  description: string; 
};

export default function Placeholder({ title, description }: PageProps) {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}






