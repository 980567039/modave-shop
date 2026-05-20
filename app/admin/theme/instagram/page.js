"use client";

import InstagramFeed from '@/app/components/admin/theme/instagramFeed';
import { AdminContext } from '@/app/contexts/adminContexts';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'

export default function ThemeInstagramFeed() {
    const [data, setData] = useState({});
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();
    const { store, setStore } = useContext(AdminContext);


    const handlerSubmitForm = async () => {
        const payload = {
            instagramFeed: data,
            storeId: store?._id,
        };

        handleSubmitForm(
            'admin/store/theme', // Dynamic URL
            'POST', // HTTP method
            payload, // Dynamic payload
            (data) => {
                setStore((prevState) => ({
                    ...prevState,
                    theme: data,
                }));
            }
        );
    }

    const handlerError = (error) => {
        alert(error)
    }


    useEffect(() => {
        if (store && store?.theme) {
            const { instagramFeed } = store?.theme || {};
            setData(instagramFeed);
        }
    }, [store]);


    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">Instagram Feed</h2>
                {/* <p className="text-muted-foreground text-sm">Fill out all the latest arrival section</p> */}
            </div>

            <div className="space-y-3 w-full">
                <div className="flex items-start gap-3">
                    <div className="space-y-3 w-full">
                        <label className="text-sm font-semibold">Section title</label>
                        <Input
                            type="text"
                            placeholder="Section title"
                            value={data?.mainTitle}
                            onChange={(e) => setData((prevData) => ({
                                ...prevData,
                                mainTitle: e.target.value
                            }))}
                        />
                    </div>
                    <div className="space-y-3 w-full">
                        <label className="text-sm font-semibold">Tagline</label>
                        <Input
                            type="text"
                            placeholder="Tagline"
                            value={data?.tagLine}
                            onChange={(e) => setData((prevData) => ({
                                ...prevData,
                                tagLine: e.target.value
                            }))}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3 w-full">
                <label className="text-sm font-semibold">Access token</label>
                <Input
                    type="text"
                    placeholder="Access Token"
                    value={data?.accessToken}
                    onChange={(e) => setData((prevData) => ({
                        ...prevData,
                        accessToken: e.target.value
                    }))}
                />
            </div>

            <InstagramFeed accessToken={data?.accessToken} isError={handlerError} onChange={(d) => setData((prevState) => ({
                ...prevState,
                images: d
            }))} />


            <div className="flex justify-end">
                <Button type="button" onClick={handlerSubmitForm} disabled={isLoading}>
                    {isLoading ? <>
                        <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                        Saving
                    </> : <>
                        Save
                    </>}
                </Button>
            </div>
        </div>
    )
}
