import React from "react";

export default function CategoryTabs({ allCategories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex flex-wrap gap-2 py-2 sticky top-[72px] z-10 bg-white">
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-3 py-1 rounded-full text-sm font-medium border shadow-sm transition ${
            selectedCategory === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
