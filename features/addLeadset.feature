Feature: Create a Process

Scenario: Admin creates a new process
  Given I am logged in as admin
  When I navigate in campaign view
  And I select a campaign id
  And I click on process "testAutoprocess123" 
  And I click on add leadset
  And I click on input and select leadset
  And I click on save button
  And I see alert message of leadset count 
  #And I click ok button
  #Then I should see a leadset added successfully
