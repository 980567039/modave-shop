"use client";

import { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { apiReq, transformS3UrlsInObject } from "@/lib/common";
import TrashButton from "../../trashButton";
import { AdminContext, useAdminContext } from "@/app/contexts/adminContexts";
import { FormMessage } from "@/components/ui/form";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 3;

const ProductItem = ({ product, isSelected, onAdd }) => (
    <div
        className={`flex items-center gap-3 justify-between ${!isSelected ? 'cursor-pointer hover:bg-slate-50' : ''} p-2`}
        onClick={() => !isSelected && onAdd(product)}
    >
        <div className="flex items-center gap-3">
            <img
                src={product?.defaultImage?.url || "https://dummyimage.com/400x400/ddd/000"}
                width={60}
                height={70}
                alt={product.title || "产品图片"}
            />
            <div className="flex flex-col">
                <span className="text-sm">{product.title}</span>
                {product.sku && <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>}
                <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? '有库存' : '缺货'}
                </span>
            </div>
        </div>
        {!isSelected ? (
            <Button className="w-[30px] h-[30px] rounded-full flex items-center justify-center p-0">
                <Plus className="w-4 h-4" />
            </Button>
        ) : (
            <div className="text-xs text-muted-foreground">已选择</div>
        )}
    </div>
);

const SelectedProduct = ({ product, onRemove }) => {
    const allFormattedImages = transformS3UrlsInObject(product);
    return (
        <div className="bg-white p-1">
            <AspectRatio className="relative overflow-hidden" ratio={8 / 12}>
                <div className="absolute top-3 right-3 z-10">
                    <TrashButton
                        title="移除产品"
                        content="您确定要移除此产品吗？"
                        onContinue={() => onRemove(allFormattedImages._id)}
                    />
                </div>
                <img
                    src={allFormattedImages?.defaultImage?.url || "https://dummyimage.com/400x400/ddd/000"}
                    width={400}
                    height={500}
                    alt={allFormattedImages.title || "产品图片"}
                    className="w-full h-full absolute left-0 top-0 object-cover"
                    unoptimized={true}
                />
            </AspectRatio>
            <div className="pt-2 flex flex-col">
                <span className="text-sm">{allFormattedImages.title}</span>
                {allFormattedImages.sku && <span className="text-xs text-muted-foreground">SKU: {allFormattedImages.sku}</span>}
                <span className={`text-xs ${allFormattedImages.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {allFormattedImages.inStock ? '有库存' : '缺货'}
                </span>
            </div>
        </div>
    )
};

export default function SearchAndAddProduct({ onSelect, isAutoFetch, max = null, findKey = null }) {
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [inputAlert, setInputAlert] = useState('');
    const dropdownRef = useRef(null);
    const { store, setStore } = useContext(AdminContext);

    const getSearchedProduct = useCallback(async (query) => {
        if (query.trim().length < MIN_SEARCH_LENGTH) {
            setInputAlert(`搜索文本至少需要 ${MIN_SEARCH_LENGTH} 个字符`);
            return;
        }

        try {
            setIsLoading(true);
            setShowResults(true);
            setInputAlert('')
            const url = `admin/product/filter?query=${query}`;
            const res = await apiReq(url, 'GET');

            if (!res.ok) {
                throw new Error("获取产品失败");
            }

            const { data } = await res.json();


            setProducts(data);
        } catch (error) {
            toast.error("获取产品失败", { description: error.message });
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedSearch = useCallback(
        (value) => {
            const handler = setTimeout(() => getSearchedProduct(value), DEBOUNCE_DELAY);
            return () => clearTimeout(handler);
        },
        [getSearchedProduct]
    );

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim()) {
            debouncedSearch(value);
        } else {
            setProducts([]);
            setShowResults(false);
        }
    }, [debouncedSearch]);

    const handleAddProduct = useCallback((product) => {
        if (max && selectedProducts.length >= max) {
            return;
        }
        setSelectedProducts(prev => [...prev, product]);
    }, [max, selectedProducts]);

    const handleRemoveProduct = useCallback((productId) => {
        setSelectedProducts(prev => prev.filter(product => product._id !== productId));
    }, []);

    const isProductSelected = useCallback((productId) => {
        return selectedProducts.some(product => product._id === productId);
    }, [selectedProducts]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        onSelect(selectedProducts);
    }, [selectedProducts, onSelect]);

    useEffect(() => {
        if (store?.theme && findKey) {
            const themeSelectedProduct = store.theme[findKey];
            setSelectedProducts(themeSelectedProduct?.selectedProducts || []);
        }
    }, [store, findKey]);

    const memoizedProducts = useMemo(() => products.map(product => (
        <ProductItem
            key={product._id}
            product={product}
            isSelected={isProductSelected(product._id)}
            onAdd={handleAddProduct}
        />
    )), [products, isProductSelected, handleAddProduct]);

    const memoizedSelectedProducts = useMemo(() => selectedProducts.map(product => (
        <SelectedProduct
            key={product._id}
            product={product}
            onRemove={handleRemoveProduct}
        />
    )), [selectedProducts, handleRemoveProduct]);

    return (
        <div className="space-y-3">
            <div className="relative" ref={dropdownRef}>
                <Input
                    type="text"
                    value={searchText}
                    onChange={handleInputChange}
                    placeholder="按名称或SKU搜索产品"
                    onFocus={() => setShowResults(products.length > 0)}
                />
                <p className="text-xs text-muted-foreground mt-2">{inputAlert}</p>
                {showResults && (
                    <div className="w-full border-[1px] p-1 bg-white rounded-sm absolute top-[calc(100%+5px)] max-h-[400px] overflow-y-auto z-20">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        ) : products.length > 0 ? (
                            memoizedProducts
                        ) : (
                            <div className="text-center text-sm text-muted-foreground p-2">无结果</div>
                        )}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-4 gap-4">
                {memoizedSelectedProducts}
            </div>
        </div>
    );
}