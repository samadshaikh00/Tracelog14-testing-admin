Feature: Create a Process

Scenario Outline: Admin creates a new process with different calling modes
  Given I am logged in as admin
  When I navigate to the campaign view
  And I select the campaign
  And I expand and select create process
  And I fill in process "InboundProcess" with "Inbound" calling mode
  Then I should see a successful message
  When I Add gateway
  And I click on input and select gateway
  Then I should see gateway added successful message
  When I click on down arrow
  And I hover on Agent
  And I click on add agent
  And I click on input and select agent
  Then I should see a agent map successful message
  Then I am logging out
