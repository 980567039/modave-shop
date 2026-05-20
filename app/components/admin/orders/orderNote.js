import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea'
import { apiReq } from '@/lib/common';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import TrashButton from '../../trashButton';
import { useSession } from 'next-auth/react';

export default function OrderNote({
  orderData,
  orderNoteText
}) {
  const [orderNote, setOrderNote] = useState('');
  const [displayOrderNote, setDisplayOrderNote] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession(); 


  const getOrderStatusRecord = async (orderId) => {
    // fetch data from DB
    try {
      setIsLoading(true)
      const response = await apiReq(`admin/order/note?id=${orderId}`, 'GET');

      const { data } = await response.json();


      if (!response.ok) {

        toast.error('出现错误', {
          description: "请稍后再试"
        })
      }

      if(data && Object.keys(data).length !== 0 ){
        setDisplayOrderNote({
          message: data?.customMessage,
          createAt: data?.createdAt,
          user: `${data?.changeBy?.firstName || ''} (${data?.changeBy?.email})`
        });

        orderNoteText(data?.customMessage)
      } else{
        setDisplayOrderNote({})
      }


      setIsLoading(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async () => {
    // Clear any previous errors first
    setError('');

    // Proper validation with null/undefined check and trimming
    if (!orderNote?.trim() || orderNote.trim().length < 5) {
      setError('备注至少需要5个字符');
      return;
    }

    try {
      const payload = {
        orderId: orderData?._id,
        message: orderNote.trim()
      };

      const res = await apiReq('admin/order/note', 'POST', payload);

      if (!res.ok) {
        throw new Error(res.message || '创建备注失败');
      }

      const { data } = await res.json();

      setDisplayOrderNote(data);
      orderNoteText(data?.message)

      toast.success("备注已创建", {
        description: "订单备注已成功创建"
      });

      // Clear the note input after successful creation
      setOrderNote('');

    } catch (error) {
      // Handle the error properly
      const errorMessage = error.message || '创建备注失败';
      setError(errorMessage);
      toast.error("错误", {
        description: errorMessage
      });
    }
  };

  const handlerConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const res = await apiReq(`admin/order/note?id=${orderData?._id}`, 'DELETE');

      if (!res.ok) {
        throw new Error(res.message || '删除备注失败');
      }

      setIsLoading(false);
      setDisplayOrderNote({})
      orderNoteText('')
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    
    if(orderData && Object.keys(orderData).length !== 0){
      getOrderStatusRecord(orderData?._id);
    }
  }, [orderData])


  

  return (
    <div className='space-y-3'>
      {isLoading && <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-7/12 h-4" />
      </div>}


      {displayOrderNote && Object.keys(displayOrderNote).length !== 0 && displayOrderNote?.message !== "" ? <>
        <div className='bg-slate-50 p-5 rounded-sm italic text-xs flex justify-between'>
          {displayOrderNote?.message}

          {session?.data?.user?.role === "admin" && <TrashButton 
            title="您确定吗？"
            content={`您确定要删除此备注吗？`}
            onContinue={handlerConfirmDelete}
            isLoading={isLoading}
          />}
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-xs text-muted-foreground'>创建于 : {moment(displayOrderNote?.createdAt).format('YYYY-MM-DD hh:mm A')}</div>
          <div className='text-xs text-muted-foreground'>创建者 : {displayOrderNote?.user}</div>
        </div>
      </> : <>
        <Textarea rows={2} cols={5} placeholder="在此输入您的订单备注..." className="placeholder:italic" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
        {error && error !== "" && <p className='text-xs text-red-500'>{error}</p>}

        <div className='flex justify-end'>
          <Button size="sm" className="flex items-center gap-2" onClick={handleCreateNote} disabled={isLoading}>{isLoading && <Loader2 size={10} className='animate-spin' />} 创建备注</Button>
        </div>
      </>}


    </div>
  )
}
