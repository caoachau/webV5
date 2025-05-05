describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login")
  })

  it("should display login page correctly", () => {
    cy.contains("DocShare")
    cy.contains("Join the platform to share and discover documents and courses")
    cy.contains("Sign in with Google")
  })

  it("should have Google login button", () => {
    cy.get("button").contains("Sign in with Google").should("be.visible")
  })
})
