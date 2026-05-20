"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import TermsPopup from './termsPopup';

export default function ViewTerms({ terms, attributeName, onEditRow, onRemove }) {
    const [allTerms, setAllTerms] = useState([]);
    const [editTerm, setEditTerm] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const handlerEditTerm = (data, index) => {
        setEditTerm({
            data,
            index
        });
    }

    const handlerRemoveTerm = (index) => {
        const updatedTerms = [...allTerms];
        updatedTerms.splice(index, 1);
        setAllTerms(updatedTerms);
        onRemove(updatedTerms);
    }

    const handlerEditTermSubmit = (data) => {
        onEditRow(data, editTerm.index);
        setEditTerm({});
    }

    const filteredTerms = allTerms.filter(term => 
        term.termName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        term.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setAllTerms(terms);
    }, [terms]);

    return (
        <div className='space-y-3'>
            <div className='flex justify-between items-center'>
                <h4 className='text-lg font-semibold'>属性</h4>
                {allTerms && allTerms.length > 0 && (
                    <div className='w-[300px]'>
                        <Input
                            type="text"
                            placeholder="搜索属性..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {allTerms && allTerms.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">名称</TableHead>
                            <TableHead>别名</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTerms.map((term, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    <div className='flex gap-2 items-center'>
                                        {term?.color && (
                                            <div className='w-5 h-5 rounded-full' style={{ backgroundColor: term?.color?.hex }}></div>
                                        )}
                                        {term.termName}
                                    </div>
                                </TableCell>
                                <TableCell>{term.slug}</TableCell>
                                <TableCell className="text-right">
                                    <div className='flex gap-2 justify-end'>
                                        <Button onClick={() => handlerEditTerm(term, index)} variant="ghost" size="icon">
                                            <Edit className='w-4 h-4' />
                                        </Button>
                                        <Button onClick={() => handlerRemoveTerm(index)} variant="ghost" size="icon">
                                            <Trash className='w-4 h-4 text-red-500' />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className='text-center py-5 text-muted-foreground'>
                    尚未添加任何属性。
                </div>
            )}

            <TermsPopup
                onSubmit={handlerEditTermSubmit}
                attributeName={attributeName}
                edit={editTerm}
                disabledAddButton={true}
                allTerms={allTerms}
            />
        </div>
    )
}
