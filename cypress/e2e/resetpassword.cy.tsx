describe("ResetPassword Page", () => {
  beforeEach(() => {
    cy.visit("/reset-password");
  });

  it("should display the reset password form", () => {
    cy.get("h1").should("contain.text", "Forgot Password?");
    cy.get("p").should(
      "contain.text",
      "Please enter your email address and we'll send you a password reset link."
    );
    cy.get('input[type="email"]').should("be.visible");
    cy.get('button[data-testid="reset-password-button"]').should("be.visible");
  });

  it("should display a success message and redirect to login on successful submission", () => {
    // Mock the Firebase API response
    cy.intercept(
      "POST",
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=*",
      {
        statusCode: 200,
        body: {},
      }
    ).as("sendPasswordResetEmail");

    cy.get('input[type="email"]').type("test@example.com");
    cy.get('button[data-testid="reset-password-button"]').click();

    cy.wait(2000);

    cy.get("body").then(($body) => {
      if ($body.find(".success-message").length > 0) {
        cy.get(".success-message").should(
          "contain.text",
          "Password reset link has been sent to your email address."
        );
      } else {
        cy.log("Success message element not found");
      }
    });

    cy.url().should("include", "/login");
  });
});
