Feature: Upload Contacts to Leadset

  Scenario: Admin uploads contacts to leadset successfully
    Given I am logged in as admin
    When I navigate to contact management page
    # And I click on "Manage Contact" submenu
    And I click on existing leadset "slashrtc"
    And I click on upload button
    #And I click on download button
    And I Choose csv file  
    And I clicked on upload button
    Then I am logging out

  