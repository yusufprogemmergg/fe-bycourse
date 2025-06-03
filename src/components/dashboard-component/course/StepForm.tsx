export default function StepForm({ current }: { current: number }) {
  const steps = ["Course", "Module", "Lesson"];
  return (
    <div className="flex justify-center mb-6 gap-4">
      {steps.map((step, idx) => (
        <div key={idx} className={`px-4 py-2 rounded-full ${current === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          {idx + 1}. {step}
        </div>
      ))}
    </div>
  );
}
