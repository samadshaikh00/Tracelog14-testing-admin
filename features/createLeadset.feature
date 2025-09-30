

Feature: Create Leadset as Admin

  Scenario: Admin creates a new leadset successfully
    Given I am logged in as admin
    When I navigate to contact management page for creating leadset
    And I click on create leadset icon
    And I fill leadset name as "leadsintern999"
    And I fill leadset description as "Test leadset for slash team"
    And I enable skill option
    And I click save button
    Then I should see leadset created successfully message
    And I should be on manage leadset page
    Then I am logging out