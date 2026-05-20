"use client"
import { CircleCheck, Minus } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function PasswordStrength({ password, onFocus }) {
   
    const [passwordStrength, setPasswordStrength] = useState({});
    useEffect(() =>{
        setPasswordStrength({
            length: password?.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        })
    }, [password])
    

    return (
        <ul className="pt-3 text-xs flex flex-col gap-1">
            <li className={`${passwordStrength.length ? `text-green-600` : `text-gray-400`} flex items-center gap-2`}>
                {passwordStrength.length ? <CircleCheck className='w-4 h-4 text-green-600' /> : <Minus className='w-4 h-4'/>} At least 8 characters
            </li>
            <li className={`${passwordStrength.uppercase ? `text-green-600` : `text-gray-400`} flex items-center gap-2`}>
                {passwordStrength.uppercase ? <CircleCheck className='w-4 h-4 text-green-600' /> : <Minus className='w-4 h-4'/>} One uppercase letter
            </li>
            <li className={`${passwordStrength.lowercase ? `text-green-600` : `text-gray-400`} flex items-center gap-2`}>
                {passwordStrength.lowercase ? <CircleCheck className='w-4 h-4 text-green-600' /> : <Minus className='w-4 h-4'/>} One lowercase letter
            </li>
            <li className={`${passwordStrength.number ? `text-green-600` : `text-gray-400`} flex items-center gap-2`}>
                {passwordStrength.number ? <CircleCheck className='w-4 h-4 text-green-600' /> : <Minus className='w-4 h-4'/>} One number
            </li>
            <li className={`${passwordStrength.specialChar ? `text-green-600` : `text-gray-400`} flex items-center gap-2`}>
                {passwordStrength.specialChar ? <CircleCheck className='w-4 h-4 text-green-600' /> : <Minus className='w-4 h-4'/>} And one special character
            </li>
        </ul>
    );
}
