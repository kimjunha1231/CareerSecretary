'use client';

import React, { useEffect, useState } from 'react';
import { useWriteStore } from '@/stores/useWriteStore';
import { getRelevantResumes } from '@/actions/recommend';
import { Sparkles, Copy, Loader2, Lightbulb, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISidebar() {
    const { activeField, relevantDocs, isLoading, setRelevantDocs, setLoading, requestTimestamp } = useWriteStore();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!activeField) return;

            setLoading(true);
            try {
                // In a real app, we would pass the actual user ID from session
                const docs = await getRelevantResumes(activeField, 'current-user');
                setRelevantDocs(docs);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [requestTimestamp, activeField, setRelevantDocs, setLoading]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex items-center gap-2 text-indigo-400">
                <Sparkles size={20} />
                <h2 className="font-semibold text-lg">AI 추천 도우미</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {!activeField ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center p-4">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <FileText size={24} />
                        </div>
                        <p>문항 제목 옆의 'AI 추천 받기' 버튼을 누르면<br />관련된 과거 자소서를 추천해드려요.</p>
                    </div>
                ) : isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 animate-pulse">
                                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-3" />
                                <div className="h-20 bg-zinc-800 rounded w-full mb-3" />
                                <div className="h-8 bg-zinc-800 rounded w-full" />
                            </div>
                        ))}
                        <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mt-4">
                            <Loader2 size={14} className="animate-spin" />
                            <span>AI가 관련 문서를 분석 중입니다...</span>
                        </div>
                    </div>
                ) : relevantDocs.length === 0 ? (
                    <div className="text-center text-zinc-500 p-8 bg-zinc-900/30 rounded-xl border border-white/5">
                        <p>관련된 과거 자소서를 찾지 못했습니다.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {relevantDocs.map((doc) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-indigo-500/30 rounded-xl p-5 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-medium text-white text-sm">{doc.companyName}</h3>
                                        {doc.subtitle && (
                                            <p className="text-xs text-indigo-400 mt-0.5">{doc.subtitle}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(doc.originalContent, doc.id)}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="내용 복사"
                                    >
                                        {copiedId === doc.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all whitespace-pre-wrap">
                                        {doc.originalContent}
                                    </p>
                                </div>

                                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-3 flex gap-3">
                                    <Lightbulb size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-indigo-200 leading-relaxed">
                                        {doc.aiAdvice}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
