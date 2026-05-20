"use client";

import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { AdminContext } from "@/app/contexts/adminContexts";
import { Button } from "@/components/ui/button";
import TopHighlightedCard from "@/app/components/admin/theme/footer/topHighlightedCard";
import FooterLeftContent from "@/app/components/admin/theme/footer/leftContent";
import FooterMenus from "@/app/components/admin/theme/footer/menus";
import { toast } from 'sonner';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { LoaderCircle } from 'lucide-react';

const ThemeFooterPage = () => {
  const { store, setStore } = useContext(AdminContext);
  const [data, setData] = React.useState({});
  const { isLoading, handleSubmitForm } = useSubmitThemeForm();

  useEffect(() => {
    if (store?.theme?.footer) {
      setData(store.theme.footer);
    }
  }, [store?.theme?.footer]);

  const handlerOnChange = useCallback((newData, type) => {
    setData(prevData => ({
      ...prevData,
      [type]: newData
    }));
  }, []);

  const handlerSave = useCallback(() => {
    console.log(data);

    const payload = {
      footer: data,
      storeId: store?._id,
    };

    handleSubmitForm(
      'admin/store/theme', // 动态URL
      'POST', // HTTP方法
      payload, // 动态载荷
      (data) => {
        setStore((prevState) => ({
          ...prevState,
          theme: data,
        }));
      }
    );

  }, [data]);

  const memoizedTopHighlightedCard = useMemo(() => (
    <TopHighlightedCard
      data={data}
      onChange={newData => handlerOnChange(newData, 'highlightedCard')}
      max={4}
    />
  ), [data, handlerOnChange]);

  const memoizedFooterLeftContent = useMemo(() => (
    <FooterLeftContent
      data={data}
      onChange={(newData) => setData(prevData => ({ ...prevData, ...newData }))}
    />
  ), [data, handlerOnChange]);

  const memoizedFooterMenus = useMemo(() => (
    <FooterMenus
      data={data}
      onChange={newData => handlerOnChange(newData, 'footerMenus')}
    />
  ), [data, handlerOnChange]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold text-xl">底部信息配置</h2>
        <p className="text-muted-foreground text-sm">网站的所有底部信息自定义将在此集中管理。</p>
      </div>

      {/* <h3 className="font-semibold">左侧内容</h3> */}
      {memoizedFooterLeftContent}

      <h3 className="font-semibold">页脚菜单</h3>
      {memoizedFooterMenus}

      <div className="flex justify-end">
        <div className="flex justify-end ">
          <Button type="button" onClick={handlerSave} disabled={isLoading}>
            {isLoading ? <>
              <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
              保存中
            </> : <>
              保存
            </>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ThemeFooterPage);