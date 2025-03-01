import { lusitana } from '@/app/ui/fonts';
import { fetchArticles } from '@/app/lib/data';
import { Article } from '@/app/lib/definitions';
import { Card } from '@/app/ui/articles/card';

export default async function Page() {
  const articles = await fetchArticles();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Articles</h1>
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {articles?.map((article: Article) => (
              <div key={article.id}>
                <Card title={article.attributes.title} summary={article.attributes.body.processed} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
