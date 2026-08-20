import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800">
        Filter Categories
      </h3>

      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory('')}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
            selectedCategory === ''
              ? 'bg-brand-500 text-slate-950 font-bold shadow'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <span>All Categories</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
              selectedCategory === cat._id
                ? 'bg-brand-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <span className="truncate">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
