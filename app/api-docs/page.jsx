'use client';

import React, { useState, useEffect } from 'react';

export default function ApiDocsPage() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedModules, setExpandedModules] = useState({});

    // Request state
    const [queryParams, setQueryParams] = useState([]);
    const [body, setBody] = useState('{\\n  \\n}');
    const [response, setResponse] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    const [responseTime, setResponseTime] = useState(null);
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(() => {
        fetch('/api/internal/api-docs')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRoutes(data.data);
                    // 默认展开所有模块
                    const modules = groupRoutesByModule(data.data);
                    const initialExpanded = {};
                    Object.keys(modules).forEach(module => {
                        initialExpanded[module] = true;
                    });
                    setExpandedModules(initialExpanded);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load API docs:', err);
                setLoading(false);
            });
    }, []);

    // 从路径中提取模块名
    const extractModuleName = (path) => {
        // 路径格式: /api/模块名/...
        const parts = path.split('/').filter(p => p);
        if (parts.length >= 2 && parts[0] === 'api') {
            return parts[1];
        }
        return 'other';
    };

    // 按模块分组路由
    const groupRoutesByModule = (routesList) => {
        const grouped = {};
        routesList.forEach(route => {
            const moduleName = extractModuleName(route.path);
            if (!grouped[moduleName]) {
                grouped[moduleName] = [];
            }
            grouped[moduleName].push(route);
        });
        return grouped;
    };

    // 切换模块展开/折叠状态
    const toggleModule = (module) => {
        setExpandedModules(prev => ({
            ...prev,
            [module]: !prev[module]
        }));
    };

    const handleSelectRoute = (route, method) => {
        setSelectedRoute(route);
        setSelectedMethod(method);
        setResponse(null);
        setResponseStatus(null);
        setResponseTime(null);

        // Initialize query params
        const initialParams = (route.queryParams || []).map(key => ({ key, value: '' }));
        setQueryParams(initialParams);

        // Reset body
        setBody('{\\n  \\n}');
    };

    const handleAddQueryParam = () => {
        setQueryParams([...queryParams, { key: '', value: '' }]);
    };

    const handleRemoveQueryParam = (index) => {
        const newParams = [...queryParams];
        newParams.splice(index, 1);
        setQueryParams(newParams);
    };

    const handleQueryParamChange = (index, field, value) => {
        const newParams = [...queryParams];
        newParams[index][field] = value;
        setQueryParams(newParams);
    };

    const handleTestApi = async () => {
        if (!selectedRoute || !selectedMethod) return;

        setRequestLoading(true);
        setResponse(null);
        setResponseStatus(null);

        const startTime = performance.now();

        try {
            // Build URL with query params
            const url = new URL(selectedRoute.path, window.location.origin);
            queryParams.forEach(param => {
                if (param.key) {
                    url.searchParams.append(param.key, param.value);
                }
            });

            const options = {
                method: selectedMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (selectedMethod !== 'GET' && selectedMethod !== 'HEAD') {
                try {
                    // Validate JSON
                    JSON.parse(body);
                    options.body = body;
                } catch (e) {
                    alert('Invalid JSON body');
                    setRequestLoading(false);
                    return;
                }
            }

            const res = await fetch(url.toString(), options);
            const endTime = performance.now();
            setResponseTime((endTime - startTime).toFixed(2));
            setResponseStatus(res.status);

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                setResponse(data);
            } else {
                const text = await res.text();
                setResponse(text);
            }

        } catch (error) {
            console.error('API Test Error:', error);
            setResponse({ error: error.message });
        } finally {
            setRequestLoading(false);
        }
    };

    // Filter routes based on search query and group by module
    const getFilteredGroupedRoutes = () => {
        const filtered = routes.filter(route => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            const pathMatch = route.path.toLowerCase().includes(query);
            const descMatch = route.description?.toLowerCase().includes(query);
            return pathMatch || descMatch;
        });
        return groupRoutesByModule(filtered);
    };

    const filteredGroupedRoutes = getFilteredGroupedRoutes();
    const totalFilteredCount = Object.values(filteredGroupedRoutes).reduce((sum, routes) => sum + routes.length, 0);

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <div className="w-80 border-r border-border bg-card overflow-y-auto">
                <div className="p-4 border-b border-border">
                    <h1 className="text-xl font-bold heading-font">API 文档</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {loading ? '扫描中...' : `${routes.length} 个接口`}
                    </p>
                    {/* Search Box */}
                    <div className="mt-3">
                        <input
                            type="text"
                            placeholder="搜索 API 路径或描述..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>
                    {searchQuery && (
                        <p className="text-xs text-muted-foreground mt-2">
                            找到 {totalFilteredCount} 个匹配结果
                        </p>
                    )}
                </div>
                <div className="p-2">
                    {Object.keys(filteredGroupedRoutes).length > 0 ? (
                        Object.entries(filteredGroupedRoutes).sort(([a], [b]) => a.localeCompare(b)).map(([module, moduleRoutes]) => (
                            <div key={module} className="mb-3">
                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(module)}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-muted/50 hover:bg-muted rounded transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {expandedModules[module] ? '📂' : '📁'}
                                        </span>
                                        <span className="font-semibold text-sm">{module}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({moduleRoutes.length})
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {expandedModules[module] ? '▼' : '▶'}
                                    </span>
                                </button>

                                {/* Module Routes */}
                                {expandedModules[module] && (
                                    <div className="mt-1 ml-2 space-y-2">
                                        {moduleRoutes.map((route, i) => (
                                            <div key={i} className="border-l-2 border-border pl-3 py-1">
                                                <div className="text-xs font-mono text-muted-foreground break-all">
                                                    {route.path}
                                                </div>
                                                {route.description && (
                                                    <div className="text-xs text-muted-foreground/80 italic mt-1">
                                                        {route.description}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {route.methods.map(method => (
                                                        <button
                                                            key={method}
                                                            onClick={() => handleSelectRoute(route, method)}
                                                            className={`px-2 py-1 text-xs rounded border transition-colors
                                                                ${selectedRoute === route && selectedMethod === method
                                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                                    : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                                                                }`}
                                                        >
                                                            {method}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            未找到匹配的 API
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-background p-6">
                {selectedRoute ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-primary text-primary-foreground rounded font-bold">
                                    {selectedMethod}
                                </span>
                                <h2 className="text-2xl font-mono break-all">{selectedRoute.path}</h2>
                            </div>
                            {selectedRoute.description && (
                                <p className="text-muted-foreground text-lg border-l-4 border-primary pl-3 py-1 bg-muted/30">
                                    {selectedRoute.description}
                                </p>
                            )}
                        </div>

                        {/* Request Configuration */}
                        <div className="space-y-6">
                            {/* Query Params */}
                            <div className="bg-card border border-border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Query Parameters</h3>
                                    <button
                                        onClick={handleAddQueryParam}
                                        className="text-xs bg-secondary hover:bg-muted px-2 py-1 rounded"
                                    >
                                        + Add Param
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {queryParams.map((param, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Key"
                                                value={param.key}
                                                onChange={(e) => handleQueryParamChange(idx, 'key', e.target.value)}
                                                className="flex-1 px-2 py-1 bg-background border border-input rounded text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={param.value}
                                                onChange={(e) => handleQueryParamChange(idx, 'value', e.target.value)}
                                                className="flex-1 px-2 py-1 bg-background border border-input rounded text-sm"
                                            />
                                            <button
                                                onClick={() => handleRemoveQueryParam(idx)}
                                                className="text-destructive hover:text-destructive/80 px-2"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {queryParams.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">No query parameters</p>
                                    )}
                                </div>
                            </div>

                            {/* Request Body (Non-GET) */}
                            {selectedMethod !== 'GET' && selectedMethod !== 'HEAD' && (
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-semibold mb-4">Request Body (JSON)</h3>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        className="w-full h-48 font-mono text-sm bg-background border border-input rounded p-2 focus:ring-2 focus:ring-ring"
                                        spellCheck="false"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleTestApi}
                                disabled={requestLoading}
                                className="w-full py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {requestLoading ? 'Sending Request...' : 'Send Request'}
                            </button>

                            {/* Response Section */}
                            <div className="bg-card border border-border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Response</h3>
                                    {responseStatus && (
                                        <div className="flex gap-4 text-sm">
                                            <span className={`font-bold ${responseStatus >= 200 && responseStatus < 300 ? 'text-green-500' : 'text-red-500'}`}>
                                                Status: {responseStatus}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Time: {responseTime}ms
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-background border border-input rounded p-4 h-[400px] overflow-auto">
                                    {response ? (
                                        <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                            {typeof response === 'object'
                                                ? JSON.stringify(response, null, 2)
                                                : response}
                                        </pre>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                            Response will appear here
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Select an API endpoint from the sidebar to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
