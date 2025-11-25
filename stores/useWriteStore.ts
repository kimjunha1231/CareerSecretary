import { create } from 'zustand';

export interface RecommendedDoc {
    id: string;
    companyName: string;
    originalContent: string;
    subtitle?: string;
    aiAdvice: string;
    similarityScore: number;
    tags?: string[];
}

interface WriteState {
    searchTags: string[];
    searchResults: RecommendedDoc[];
    isSearching: boolean;

    // Actions
    setSearchTags: (tags: string[]) => void;
    setSearchResults: (docs: RecommendedDoc[]) => void;
    setIsSearching: (isSearching: boolean) => void;
}

export const useWriteStore = create<WriteState>((set) => ({
    searchTags: [],
    searchResults: [],
    isSearching: false,

    setSearchTags: (tags) => set({ searchTags: tags }),
    setSearchResults: (docs) => set({ searchResults: docs }),
    setIsSearching: (isSearching) => set({ isSearching }),
}));
