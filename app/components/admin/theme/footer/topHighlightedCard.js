"use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import Image from 'next/image';
import { ImagePlus, Minus, PlusCircle, Undo2 } from 'lucide-react';
import { AdminContext } from '@/app/contexts/adminContexts';
import MediaLibrary from '@/app/components/mediaLibrary';
import TrashButton from '@/app/components/trashButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const initialItem = { icon: null, mainTitle: '', tagline: '' };

export default function TopHighlightedCard({ store, findBy = null, max = null, onChange, data }) {
  const [items, setItems] = useState([{ id: 1, ...initialItem }]);
  const [openImageModal, setOpenImageModal] = useState({ isOpen: false, rowId: null });


  useEffect(() => {
    onChange?.(items);
  }, [items]);

  useEffect(() => {
    if(data && data?.highlightedCard){
      setItems(data?.highlightedCard)
    }
  }, [data]);

  const handleAddRow = useCallback(() => {
    if (max && items.length >= max) return;
    setItems(prevItems => [...prevItems, { id: prevItems.length + 1, ...initialItem }]);
  }, [items.length, max]);

  const handleRemoveRow = useCallback((id) => {
    setItems(prevItems => prevItems.filter(row => row.id !== id).map((row, index) => ({ ...row, id: index + 1 })));
  }, []);

  const handleInputChange = useCallback((id, field, value) => {
    setItems(prevItems => prevItems.map(row => row.id === id ? { ...row, [field]: value } : row));
  }, []);

  const handleImageAction = useCallback((action, rowId, image = null) => {
    setItems(prevItems => prevItems.map(row => 
      row.id === rowId ? { ...row, icon: action === 'remove' ? null : (image?.url || row.icon) } : row
    ));
    if (action === 'select') setOpenImageModal({ isOpen: false, rowId: null });
  }, []);

  const ImageSelector = ({ row }) => (
    <div 
      onClick={() => !row.icon && setOpenImageModal({ isOpen: true, rowId: row.id })}
      className='min-w-[50px] overflow-hidden border-dashed border-2 rounded-md h-[50px] flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75'
    >
      {row.icon ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Image
              src={row.icon}
              alt={`attr_${row.id}`}
              width={50}
              height={50}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAbEAADAAMBAQAAAAAAAAAAAAABAgMABBEhMf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAFREBAQAAAAAAAAAAAAAAAAAAAQD/2gAMAwEAAhEDEQA/ALTDacXxKe+ZjhKSpamNXoDTRhAOEXbDWzSHH//Z"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleImageAction('remove', row.id)} className="text-sm cursor-pointer text-red-500 flex gap-1">
              <Minus className='w-4 h-4' />
              <span className='text-xs'>删除</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenImageModal({ isOpen: true, rowId: row.id })} className="text-sm cursor-pointer flex gap-1">
              <Undo2 className='w-4 h-4' />
              <span className='text-xs'>替换图片</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <ImagePlus className='w-5 h-5 text-muted-foreground' strokeWidth={1} />
          <p className='text-xs text-muted-foreground'>图标</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {items.map((row) => (
        <div key={row.id} className="border-b-2 pb-3 mb-3 flex items-start justify-between">
          <div className='flex items-center gap-3'>
            <ImageSelector row={row} />
            <Input
              type="text"
              placeholder="主标题"
              value={row.mainTitle}
              onChange={(e) => handleInputChange(row.id, 'mainTitle', e.target.value)}
            />
            <Input
              type="text"
              placeholder="副标题"
              value={row.tagline}
              onChange={(e) => handleInputChange(row.id, 'tagline', e.target.value)}
            />
          </div>
          <TrashButton
            onContinue={() => handleRemoveRow(row.id)}
            title="您确定吗？"
            content="您确定要删除这个项目吗？"
          />
        </div>
      ))}

      {(!max || items.length < max) && (
        <div onClick={handleAddRow} className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer">
          <PlusCircle className='w-10 h-10 text-muted-foreground' strokeWidth={0.8} />
          <span>添加新行</span>
        </div>
      )}

      <Dialog open={openImageModal.isOpen} onOpenChange={() => setOpenImageModal({ isOpen: false, rowId: null })}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>选择图片</DialogTitle>
            <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片，或直接从本地电脑上传。</p>
          </DialogHeader>
          <MediaLibrary selectedMedia={(image) => handleImageAction('select', openImageModal.rowId, image)} />
        </DialogContent>
      </Dialog>
    </>
  );
}