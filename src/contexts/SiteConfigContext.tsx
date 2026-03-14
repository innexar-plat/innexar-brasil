'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Default config values (fallbacks)
export interface SiteConfig {
    site_phone_br?: string;
    site_whatsapp_br?: string;
    site_address_br?: string;
    sales_email?: string;
    support_email?: string;
    company_name?: string;
    [key: string]: any;
}

interface SiteConfigContextType {
    config: SiteConfig;
    loading: boolean;
    refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
    config: {},
    loading: true,
    refreshConfig: async () => { },
});

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<SiteConfig>({});
    const [loading, setLoading] = useState(true);

    const refreshConfig = async () => {
        try {
            // Config do site (env).
            const res = await fetch('/api/public-config/site');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            } else {
                console.warn('Failed to fetch site config', res.status);
            }
        } catch (error) {
            console.error('Error fetching site config:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshConfig();
    }, []);

    return (
        <SiteConfigContext.Provider value={{ config, loading, refreshConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
};
