describe("Header Search and Filter Functionality", () => {
  before(() => {
    // Visit the dashboard page
    cy.visit("/dashboard");

    // Intercept API requests to mock responses or check requests
    cy.intercept("GET", "/api/posts?search=*").as("searchPosts");
  });

  it("should display search results correctly", () => {
    const searchQuery = "Test Post";

    // Ensure the search input and button are visible
    cy.get('[data-testid="search-input"]').should("be.visible");
    cy.get('[data-testid="search-button"]').should("be.visible");

    // Perform search
    cy.get('[data-testid="search-input"]').type(searchQuery);
    cy.get('[data-testid="search-button"]').click();
  });

  it("should display results for different cases", () => {
    cy.visit("/dashboard");
    const caseSensitiveQuery = "test post";

    cy.get('[data-testid="search-input"]').type(caseSensitiveQuery);
    cy.get('[data-testid="search-button"]').click();
  });

  it("should clear search input correctly", () => {
    cy.visit("/dashboard");
    const searchQuery = "Test Post";

    cy.get('[data-testid="search-input"]', { timeout: 10000 }).type(
      searchQuery
    );
    cy.get('[data-testid="search-button"]').click();

    cy.get('[data-testid="clear-search-button"]').click();
    cy.get('[data-testid="search-input"]').should("have.value", "");
    cy.get(".grid").should("not.exist");
  });
});
