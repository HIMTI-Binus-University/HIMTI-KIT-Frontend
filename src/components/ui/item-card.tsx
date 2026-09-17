import { Download, FileText } from "lucide-react";

export type CatalogItem = {
  id: string;
  type: "resource" | "software";
  title: string;
  description: string;
  majors: string[];
  coverImageUrl?: string;
  fileUrl: string;
};

type CatalogCardProps = {
  item: CatalogItem;
};

export function CatalogCard({ item }: CatalogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <div className="flex aspect-[16/9] items-center justify-center bg-slate-100">
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt={`${item.title} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileText className="h-12 w-12 text-slate-400" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <a
          href={item.fileUrl}
          download
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </article>
  );
}