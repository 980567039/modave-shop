import React from 'react'
import CategoryCard from '../cards/categoryCard';

export default function OrganizeCategoryView({ data, firstGridLimit = 4 }) {
    const firstGridItems = data.slice(0, firstGridLimit);
    const remainingItems = data.slice(firstGridLimit);
    
    return (
        <div>
            {/* First Grid */}
            <div className={`grid grid-cols-${Math.min(firstGridItems.length, 2)} md:grid-cols-${firstGridItems.length} gap-1 mb-1`}>
                {firstGridItems.map((item, index) => (
                    <CategoryCard
                        key={index}
                        href={item.link || '#'}
                        name={item.mainTitle}
                        image={item.image}
                    />
                ))}
            </div>

            {/* Second Grid */}
            {remainingItems.length > 0 && (
                <div className={`grid grid-cols-${Math.min(remainingItems.length, 2)} md:grid-cols-4 gap-1`}>
                    {remainingItems.map((item, index) => (
                        <CategoryCard
                            key={index}
                            href={item.link || '#'}
                            name={item.mainTitle}
                            image={item.image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
