export const addCategory = async (category) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to add category");
  return response.json();
};

export const updateCategory = async (category) => {
  const response = await fetch(`/api/categories/${category._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
};
