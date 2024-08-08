describe("Homepage Links and Dashboard Links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("navigates to the login page", () => {
    cy.get('a[href="/login"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .then(() => {
        cy.url().should("include", "/login");
      });
  });

  it("navigates to the sign up page", () => {
    cy.get('a[href="/signup"]').click();
    cy.url().should("include", "/signup");
  });

  it('should navigate to the create post page when the "Write" link is clicked', () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="create-post-link"]', { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.url().should("include", "/createpost");
  });

  it("should open dropdown menu when the user icon is clicked", () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="user-avatar-button"]', { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.get('[data-testid="dropdown-menu"]')
      .should("be.visible")
      .and("contain", "Dashboard")
      .and("contain", "My Posts")
      .and("contain", "Logout");
  });
});
