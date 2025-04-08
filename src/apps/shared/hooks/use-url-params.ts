import { useSearchParams } from 'react-router-dom';

export function useUrlParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const getParam = (key: string, defaultValue: string = '') => {
        return searchParams.get(key) || defaultValue;
    };

    const setParam = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const updateParams = (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    return {
        getParam,
        setParam,
        updateParams,
        searchParams
    };
} 