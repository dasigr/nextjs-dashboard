import Image from 'next/image';

export function Card({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div>
        <div className="mb-2 flex items-center">
          <Image
            src="/customers/amy-burns.png"
            className="mr-2 rounded-full"
            width={28}
            height={28}
            alt={title}
          />
          <p>{title}</p>
        </div>
        <p className="text-sm text-gray-500">{summary}</p>
      </div>
    </div>
  );
}
