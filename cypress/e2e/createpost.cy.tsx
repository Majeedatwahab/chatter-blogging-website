describe("Create Post", () => {
  beforeEach(() => {
    cy.visit("/createpost");
  });

  it("allows a user to create a post", () => {
    // Fill in the form fields
    cy.get('[data-testid="title-input"]')
      .should("be.visible")
      .clear()
      .type("New Post");
    cy.get('[data-testid="snippet-input"]')
      .should("be.visible")
      .clear()
      .type("This is a snippet of the new post");
    cy.get('[data-testid="author-input"]')
      .should("be.visible")
      .clear()
      .type("Jane Doe");
    cy.get('[data-testid="date-input"]')
      .should("be.visible")
      .clear()
      .type("2021-09-01");
    cy.get('[data-testid="create-post-button"]').should("be.visible").click();

    cy.visit("/dashboard");
  });
});
