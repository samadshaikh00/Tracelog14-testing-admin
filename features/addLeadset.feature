Feature: Mapping Leadset

Scenario: Admin Mpas Leadset to the process
  Given I am logged in as admin
  When I navigate in campaign view
  And I select a campaign id
  And I click on process "MyAutoProcess"
  And I click on add leadset
  And I click on input and select leadset
  And I click on save button
  Then I am logging out

  

