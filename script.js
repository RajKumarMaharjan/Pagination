const employees = [
  { id: 1, name: "Ava Rodriguez", role: "Product Designer", department: "Design" },
  { id: 2, name: "Liam Chen", role: "Frontend Developer", department: "Engineering" },
  { id: 3, name: "Maya Patel", role: "Data Analyst", department: "Analytics" },
  { id: 4, name: "Noah Williams", role: "Project Manager", department: "Operations" },
  { id: 5, name: "Isabella Kim", role: "UX Researcher", department: "Design" },
  { id: 6, name: "Ethan Brown", role: "Backend Developer", department: "Engineering" },
  { id: 7, name: "Sophia Davis", role: "Marketing Specialist", department: "Marketing" },
  { id: 8, name: "Mateo Garcia", role: "QA Engineer", department: "Engineering" },
  { id: 9, name: "Emma Johnson", role: "Account Executive", department: "Sales" },
  { id: 10, name: "Oliver Smith", role: "HR Coordinator", department: "People" },
  { id: 11, name: "Amelia Wilson", role: "Content Strategist", department: "Marketing" },
  { id: 12, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 13, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 14, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 15, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 16, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 17, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 18, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 19, name: "James Martin", role: "Systems Administrator", department: "IT" },
  { id: 20, name: "James Martin", role: "Systems Administrator", department: "IT" },
];

new Pagination({
  data: employees,
  itemsPerPage: 3,
  container: "#employee-list",
  paginationContainer: "#pagination",
  maxVisiblePages: 4, // keeps the bar short even with many pages
  renderItem: (employee) => `
    <article class="employee">
      <h2>${employee.name}</h2>
      <p>${employee.role} · ${employee.department}</p>
    </article>
  `,
});
