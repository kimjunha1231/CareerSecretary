'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            // Note: Redirect happens immediately, so alert might not be seen or needed here.
            // But user asked for it. Since it redirects, maybe they mean "after login"?
            // But "after login" happens in the callback or when session is restored.
            // Let's just add it for now, but it might be fleeting.
            // Actually, for OAuth, the user leaves the page.
            // The user might mean "when I click login".
            // Or maybe they mean "when I am successfully logged in".
            // Given the flow, "successfully logged in" happens on the callback page or when the session is detected.
            // However, `signOut` is an action we control fully.
        } catch (error) {
            console.error('Error signing in with Google:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            alert('로그아웃 되었습니다.');
            window.location.href = '/'; // Force refresh and go to home
        } catch (error) {
            console.error('Error signing out:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
