import React from 'react';
import { getDocuments } from '@/actions/document';
import { FileText, Building2, Briefcase, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const documents = await getDocuments();

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">대시보드</h1>
                <p className="text-zinc-400">내 자기소개서 관리</p>
            </div>

            {/* Documents Grid */}
            {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                        <FileText size={24} className="opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-zinc-300 mb-1">문서가 없습니다</h3>
                    <p className="text-sm">새로운 자기소개서를 작성해보세요.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="group bg-surface border border-white/5 rounded-xl p-5 hover:border-primary/50 transition-all flex flex-col h-full"
                        >
                            {/* Top: Title & Status */}
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-white line-clamp-1" title={doc.title}>
                                    {doc.title}
                                </h3>
                                <Badge variant={doc.status === 'pass' ? 'success' : doc.status === 'fail' ? 'destructive' : 'secondary'} className="capitalize">
                                    {doc.status}
                                </Badge>
                            </div>

                            {/* Middle: Company & Role */}
                            <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Building2 size={14} />
                                    <span>{doc.company}</span>
                                </div>
                                <div className="w-px h-3 bg-zinc-700" />
                                <div className="flex items-center gap-1.5">
                                    <Briefcase size={14} />
                                    <span>{doc.role}</span>
                                </div>
                            </div>

                            {/* Bottom: Content Preview */}
                            <p className="text-sm text-zinc-300 line-clamp-3 mb-4 flex-1 leading-relaxed">
                                {doc.content}
                            </p>

                            {/* Footer: Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                                {doc.tags && doc.tags.length > 0 ? (
                                    doc.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700"
                                        >
                                            <Tag size={10} className="mr-1" />
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-zinc-600 italic">태그 없음</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
