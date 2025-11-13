import React, { useState } from "react";

type Course = "Starter" | "Main" | "Dessert";

interface MenuItem {
  dishName: string;
  description: string;
  course: Course;
  price: number;
}

const courses: Course[] = ["Starter", "Main", "Dessert"];

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [view, setView] = useState<"home" | "add" | "filter">("home");

  // Form states for adding menu item
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course | "">("");
  const [price, setPrice] = useState<number | "">("");

  // Filter state for guest menu filter page
  const [filter, setFilter] = useState<Course | "All">("All");

  // Add a new menu item
  const addMenuItem = () => {
    if (!dishName.trim() || !description.trim() || !course || !price) {
      alert("Please fill all fields.");
      return;
    }
    const newItem: MenuItem = {
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price),
    };
    setMenuItems((prev) => [...prev, newItem]);
    // Clear form
    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");
    setView("home");
  };

  // Remove menu item by index
  const removeItem = (index: number) => {
    setMenuItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate average price by course
  const avgPriceByCourse = (course: Course): string => {
    const items = menuItems.filter((item) => item.course === course);
    if (items.length === 0) return "0.00";
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return (total / items.length).toFixed(2);
  };

  // Filter menu items based on filter state (for guest filtering page)
  const filteredItems =
    filter === "All" ? menuItems : menuItems.filter((item) => item.course === filter);

  return (
    <div className="min-h-screen bg-green-50 text-green-900 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Chef’s Menu Manager</h1>

      {/* Navigation */}
      <nav className="flex gap-4 mb-6">
        <button
          onClick={() => setView("home")}
          className={`px-4 py-2 rounded ${
            view === "home" ? "bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setView("add")}
          className={`px-4 py-2 rounded ${
            view === "add" ? "bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Add Menu Item
        </button>
        <button
          onClick={() => setView("filter")}
          className={`px-4 py-2 rounded ${
            view === "filter" ? "bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Guest Filter
        </button>
      </nav>

      {/* Home view - show menu, totals, averages */}
      {view === "home" && (
        <section className="w-full max-w-4xl bg-white shadow-lg rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Menu Overview</h2>

          <p className="mb-2">Total menu items: <strong>{menuItems.length}</strong></p>

          <div className="mb-4">
            <p className="font-semibold mb-1">Average Prices:</p>
            <ul className="list-disc ml-6">
              {courses.map((c) => (
                <li key={c}>
                  {c}s: R{avgPriceByCourse(c)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {menuItems.length === 0 ? (
              <p className="text-gray-500 font-semibold">No menu items added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item, i) => (
                  <article
                    key={i}
                    className="border border-green-300 rounded bg-green-100 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{item.dishName}</h3>
                      <p className="italic text-sm">{item.course}</p>
                      <p className="mb-2">{item.description}</p>
                      <p className="font-semibold">R{item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="mt-4 self-start px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Add menu item view */}
      {view === "add" && (
        <section className="w-full max-w-md bg-white shadow-lg rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMenuItem();
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Dish Name"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="border border-green-300 rounded px-3 py-2"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-green-300 rounded px-3 py-2 resize-none"
              required
              rows={3}
            />

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value as Course)}
              className="border border-green-300 rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                Select Course
              </option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Price (R)"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="border border-green-300 rounded px-3 py-2"
              required
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
            >
              Add Item
            </button>
          </form>
        </section>
      )}

      {/* Guest filter view */}
      {view === "filter" && (
        <section className="w-full max-w-4xl bg-white shadow-lg rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Guest Menu Filter</h2>

          <div className="mb-4">
            <label htmlFor="filter" className="font-semibold mr-2">
              Filter by Course:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Course | "All")}
              className="border border-green-300 rounded px-3 py-2"
            >
              <option value="All">All</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-gray-500 font-semibold">No menu items to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item, i) => (
                <article
                  key={i}
                  className="border border-green-300 rounded bg-green-100 p-4"
                >
                  <h3 className="font-bold text-lg">{item.dishName}</h3>
                  <p className="italic text-sm">{item.course}</p>
                  <p className="mb-2">{item.description}</p>
                  <p className="font-semibold">R{item.price.toFixed(2)}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
