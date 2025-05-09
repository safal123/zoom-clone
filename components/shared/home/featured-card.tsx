export const FeatureCard = ({ title, description, icon }: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-violet-800 mb-2">{title}</h3>
      <p className="text-violet-600">{description}</p>
    </div>
  );
};