describe("SignUp And Login Page", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });
  it("allows a user to sign up with valid credentials", () => {
    cy.get('[data-testid="username-input"]').type("newestuser");
    cy.get('[data-testid="email-input"]').type("newestuser@example.com");
    cy.get('[data-testid="password-input"]').type("correctpass");
    cy.get('[data-testid="confirm-password-input"]').type("correctpass");
    cy.get('[data-testid="signup-button"]').click();

    cy.url().should("include", "/signup");
  });

  it("allows a user to log in  with valid credentials", () => {
    cy.visit("/login");
    cy.get('[data-testid="email-input"]').type("newestuser@example.com");
    cy.get('[data-testid="password-input"]').type("correctpass");

    cy.get('[data-testid="email-sign-in-button"]').click();
    cy.url().should("include", "/login");
  });
});
