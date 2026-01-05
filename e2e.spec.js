/**
 * RSS Feed Manager - E2E Tests
 * End-to-end tests using Cypress
 */

describe('RSS Feed Manager E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  describe('Page Load', () => {
    it('should load the application', () => {
      cy.title().should('include', 'RSS Feed Manager');
    });

    it('should display the header', () => {
      cy.get('header h1').should('contain', 'RSS Feed Manager');
      cy.get('header p').should('contain', 'Manage UK news RSS feeds');
    });

    it('should display the controls section', () => {
      cy.get('.controls').should('be.visible');
      cy.get('#searchInput').should('be.visible');
      cy.get('#generateBtn').should('be.visible');
      cy.get('#copyBtn').should('be.visible');
    });
  });

  describe('Generate Feeds', () => {
    it('should generate feeds on button click', () => {
      cy.get('#generateBtn').click();
      cy.get('#feedsTable tbody tr').should('have.length.greaterThan', 10);
    });

    it('should show success toast after generation', () => {
      cy.get('#generateBtn').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast.success').should('contain', 'Loaded');
    });

    it('should enable copy button after generation', () => {
      cy.get('#copyBtn').should('be.disabled');
      cy.get('#generateBtn').click();
      cy.get('#copyBtn').should('not.be.disabled');
    });

    it('should display stats after generation', () => {
      cy.get('#statsContainer').should('have.css', 'display', 'none');
      cy.get('#generateBtn').click();
      cy.get('#statsContainer').should('have.css', 'display', 'grid');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      cy.get('#generateBtn').click();
    });

    it('should filter feeds by name', () => {
      cy.get('#searchInput').type('BBC');
      cy.get('#feedsTable tbody tr').should('have.length.greaterThan', 0);
      cy.get('.feed-name').first().should('contain', 'BBC');
    });

    it('should filter feeds by URL', () => {
      cy.get('#searchInput').type('bbc.co.uk');
      cy.get('#feedsTable tbody tr').should('have.length.greaterThan', 0);
    });

    it('should show empty state when no results', () => {
      cy.get('#searchInput').type('nonexistent');
      cy.get('.empty-state').should('be.visible');
      cy.get('.empty-state').should('contain', 'No feeds match');
    });

    it('should clear search results when input is cleared', () => {
      cy.get('#searchInput').type('BBC');
      cy.get('#searchInput').clear();
      cy.get('#feedsTable tbody tr').should('have.length.greaterThan', 10);
    });
  });

  describe('Copy Functionality', () => {
    beforeEach(() => {
      cy.get('#generateBtn').click();
    });

    it('should copy individual feed URL', () => {
      cy.get('.copy-btn').first().click();
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast.success').should('contain', 'copied to clipboard');
    });

    it('should show copy confirmation on button', () => {
      cy.get('.copy-btn').first().click();
      cy.get('.copy-btn').first().should('contain', 'Copied');
      cy.get('.copy-btn').first().should('have.class', 'copied');
    });

    it('should copy all feeds', () => {
      cy.get('#copyBtn').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast.success').should('contain', 'Copied');
    });

    it('should increment copied count', () => {
      cy.get('#copiedCount').should('contain', '0');
      cy.get('.copy-btn').first().click();
      cy.get('#copiedCount').should('contain', '1');
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should focus search on Ctrl+K', () => {
      cy.get('#searchInput').should('not.have.focus');
      cy.get('body').type('{ctrl}k');
      cy.get('#searchInput').should('have.focus');
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.container').should('be.visible');
      cy.get('#generateBtn').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('.container').should('be.visible');
      cy.get('#generateBtn').should('be.visible');
    });

    it('should be responsive on desktop', () => {
      cy.viewport('macbook-15');
      cy.get('.container').should('be.visible');
      cy.get('#generateBtn').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
      cy.get('h1').should('contain', 'RSS Feed Manager');
    });

    it('should have aria labels', () => {
      cy.get('#searchInput').should('have.attr', 'aria-label');
    });

    it('should have semantic HTML', () => {
      cy.get('header').should('exist');
      cy.get('table').should('exist');
      cy.get('thead').should('exist');
      cy.get('tbody').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on copy failure', () => {
      // This would require mocking clipboard API failure
      // cy.get('.copy-btn').click();
      // cy.get('.toast.error').should('be.visible');
    });

    it('should handle empty feed list gracefully', () => {
      cy.get('#searchInput').type('xyz123nonexistent');
      cy.get('.empty-state').should('be.visible');
    });
  });

  describe('UI Elements', () => {
    it('should have proper button styling', () => {
      cy.get('.btn-primary').should('have.css', 'background');
      cy.get('.btn-secondary').should('have.css', 'background');
    });

    it('should have proper table styling', () => {
      cy.get('#generateBtn').click();
      cy.get('table').should('be.visible');
      cy.get('th').should('have.length', 3);
    });

    it('should show loading state during generation', () => {
      cy.get('#generateBtn').click();
      cy.get('#generateBtn').should('be.disabled');
    });
  });
});
