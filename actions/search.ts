'use server';

import { supabase } from '@/lib/supabase';
import { RecommendedDoc } from '@/stores/useWriteStore';

export async function searchDocumentsByTags(tags: string[]): Promise<RecommendedDoc[]> {
    if (!tags || tags.length === 0) return [];

    try {
        // Search for documents that contain ANY of the tags
        // Using Postgres array overlap operator (&&)
        const { data, error } = await supabase
            .from('documents')
            .select('id, title, company, role, content, tags')
            .overlaps('tags', tags)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        return (data || []).map((doc: any) => ({
            id: doc.id,
            companyName: doc.company,
            originalContent: doc.content,
            subtitle: doc.role, // Using role as subtitle
            aiAdvice: '', // No AI advice for tag search
            similarityScore: 0, // No similarity score
            tags: doc.tags
        }));
    } catch (error) {
        console.error('Error searching documents by tags:', error);
        return [];
    }
}
